export const POINTS = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
  LEFT_ANKLE: 15,
  RIGHT_ANKLE: 16,
};

export const keypointConnections = {
  nose: ["left_ear", "right_ear"],
  left_ear: ["left_shoulder"],
  right_ear: ["right_shoulder"],
  left_shoulder: ["right_shoulder", "left_elbow", "left_hip"],
  right_shoulder: ["right_elbow", "right_hip"],
  left_elbow: ["left_wrist"],
  right_elbow: ["right_wrist"],
  left_hip: ["left_knee", "right_hip"],
  right_hip: ["right_knee"],
  left_knee: ["left_ankle"],
  right_knee: ["right_ankle"],
};
export function drawSegment(ctx, [mx, my], [tx, ty], color) {
  ctx.beginPath();
  ctx.moveTo(mx, my);
  ctx.lineTo(tx, ty);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawKeypoints(
  keypoints,
  minConfidence,
  skeletonColor,
  canvasContext,
  scale = 1
) {
  //console.log("context", canvasContext);
  keypoints.forEach((keypoint) => {
    if (keypoint.score >= minConfidence) {
      const { x, y } = keypoint;
      canvasContext.beginPath();
      canvasContext.arc(x * scale, y * scale, 5, 0, 2 * Math.PI);
      canvasContext.fillStyle = skeletonColor;
      canvasContext.fill();
    }
  });
}

export function drawSkeleton(keypoints, minConfidence, ctx) {
  // Clear the canvas
  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw lines between connected keypoints
  const connectedKeypoints = [
    [0, 1],
    [1, 3],
    [3, 5],
    [5, 7],
    [0, 2],
    [2, 4],
    [4, 6],
    [6, 8], // Upper body
    [9, 10],
    [11, 12],
    [11, 13],
    [13, 15],
    [15, 17],
    [10, 12],
    [12, 14],
    [14, 16],
    [16, 18], // Lower body
    [5, 11],
    [6, 12], // Connect upper and lower body
  ];

  connectedKeypoints.forEach(([indexA, indexB]) => {
    console.log("indexB", indexB);
    const keypointA = keypoints[indexA];
    const keypointB = keypoints[indexB];
    console.log(keypointA);
    console.log(keypointB);
    // Draw the line if both keypoints have confidence above the threshold
    if (keypointA && keypointB) {
      if (
        keypointA.score >= minConfidence &&
        keypointB.score >= minConfidence
      ) {
        ctx.beginPath();
        ctx.moveTo(keypointA.x, keypointA.y);
        ctx.lineTo(keypointB.x, keypointB.y);
        ctx.strokeStyle = "red"; // You can set any color you like
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  });

  // Draw circles at each keypoint
  keypoints.forEach((keypoint) => {
    if (keypoint.score >= minConfidence) {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "blue"; // You can set any color you like
      ctx.fill();
    }
  });
}
