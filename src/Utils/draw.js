import * as poseDetection from "@tensorflow-models/pose-detection";
export const SCORE_THRESHOLD = 0.5;
function drawKeypoint(keypoint, ctx) {
  // If score is null, just show the keypoint.
  const score = keypoint.score != null ? keypoint.score : 1;
  const scoreThreshold = SCORE_THRESHOLD;

  if (score >= scoreThreshold) {
    const circle = new Path2D();
    circle.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
    ctx.fill(circle);
    ctx.stroke(circle);
  }
}
export function drawKeypoints(keypoint, ctx, color) {
  const keypointInd = poseDetection.util.getKeypointIndexBySide(
    poseDetection.SupportedModels.MoveNet
  );
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (const i of keypointInd.middle) {
    drawKeypoint(keypoint[i], ctx);
  }

  ctx.fillStyle = "Green";
  for (const i of keypointInd.left) {
    drawKeypoint(keypoint[i], ctx);
  }

  ctx.fillStyle = "Orange";
  for (const i of keypointInd.right) {
    drawKeypoint(keypoint[i], ctx);
  }
}

export function drawSkeleton(keypoints, ctx, color) {
  //const color = "red";
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  const pointsR = getPoints(
    keypoints,
    "right_shoulder",
    "right_elbow",
    "right_wrist"
  );
  const pointsL = getPoints(
    keypoints,
    "left_shoulder",
    "left_elbow",
    "left_wrist"
  );
  //console.log(points);
  const angleR = calculateAngle(
    pointsR,
    "right_shoulder",
    "right_elbow",
    "right_wrist"
  );
  const angleL = calculateAngle(
    pointsL,
    "left_shoulder",
    "left_elbow",
    "left_wrist"
  );
  //console.log(angle);
  poseDetection.util
    .getAdjacentPairs(poseDetection.SupportedModels.MoveNet)

    .forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null, just show the keypoint.
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = SCORE_THRESHOLD;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        if (kp1.name === "right_elbow") {
          writeTextOnCanvas(kp1.x, kp1.y, angleR, ctx, "yellow");
        }
        if (kp1.name === "left_elbow") {
          writeTextOnCanvas(kp1.x, kp1.y, angleL, ctx, "red");
        }

        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
}

export const drawPose = (pose, videoRef, color, canvasRef) => {
  const canvas = canvasRef.current;
  const video = videoRef.current?.video;

  if (!canvas || !pose || !pose.keypoints || !video) {
    return;
  }

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const keypoints = pose.keypoints;
  const isMirrored = true; // Set to true if the video is mirrored

  const mirroredKeypoints = keypoints.map((keypoint) => ({
    x: isMirrored ? videoWidth - keypoint.x : keypoint.x,
    y: keypoint.y,
    score: keypoint.score,
    name: keypoint.name,
  }));

  drawKeypoints(mirroredKeypoints, ctx, "yellow");
  drawSkeleton(mirroredKeypoints, ctx, color);
};

export const getPoints = (keypoints, jointA, jointB, jointC) => {
  const result = {};
  //console.log(keypoints);
  keypoints.forEach((keypoint) => {
    const { name, score } = keypoint;
    if (score >= SCORE_THRESHOLD) {
      if (name === jointA || name === jointB || name === jointC) {
        result[name] = keypoint;
      }
    }
  });

  return result;
};

// draw.js

function calculateAngle(points, pointA, pointB, pointC) {
  if (!points || !points[pointA] || !points[pointB] || !points[pointC]) {
    console.error("Invalid points or point names");
    return NaN; // or any other value to indicate an error
  }
  // Extract coordinates of three points (A, B, C)
  const { x: ax, y: ay } = points[pointA];
  const { x: bx, y: by } = points[pointB];
  const { x: cx, y: cy } = points[pointC];

  // Calculate vectors AB and BC
  const AB = { x: bx - ax, y: by - ay };
  const BC = { x: cx - bx, y: cy - by };

  // Calculate dot product of AB and BC
  const dotProduct = AB.x * BC.x + AB.y * BC.y;

  // Calculate magnitudes of AB and BC
  const magnitudeAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
  const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);

  // Calculate the cosine of the angle
  const cosAngle = dotProduct / (magnitudeAB * magnitudeBC);

  // Calculate the angle in radians
  const angleRad = Math.acos(cosAngle);

  // Convert the angle to degrees
  const angleDeg = Math.round(angleRad * (180 / Math.PI));

  return angleDeg;
}

function writeTextOnCanvas(x, y, text, ctx, color) {
  // Set font properties
  ctx.font = "130px Arial";
  ctx.fillStyle = color;

  // Draw the text on the canvas
  ctx.fillText(text, x, y);
}
