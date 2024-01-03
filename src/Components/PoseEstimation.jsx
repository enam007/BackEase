import { useRef, useEffect, useState } from "react";
// import * as poseDetection from "@tensorflow-models/pose-detection";
// import * as tf from "@tensorflow/tfjs-core";
// import "@tensorflow/tfjs-backend-webgl";
// tf.setBackend("webgpu").then(() => main());
import Webcam from "react-webcam";
import usePoseEstimation from "../Hooks/usePoseEstimation";
import usePoseDraw from "../Hooks/usePoseDraw";
// import { drawSkeleton, drawKeypoints } from "../Utils/draw";

const PoseEstimation = () => {
  // const webcamRef = useRef(null);
  const { webcamRef, pose } = usePoseEstimation();
  const [currentColor, setCurrentColor] = useState("red");
  const canvasRef = useRef(null); // const [pose, setPose] = useState(null);
  const handleCanvasClick = () => {
    setCurrentColor((prevColor) => (prevColor === "red" ? "green" : "red"));
  };

  const calculateColors = (pose) => {
    return currentColor;
  };
  usePoseDraw(pose, webcamRef, canvasRef, calculateColors);

  // useEffect(() => {
  //   const runPosenet = async () => {
  //     // const net = await posenet.load({
  //     //   inputResolution: { width: 640, height: 480 },
  //     //   scale: 0.8,
  //     // });
  //     const detectorConfig = {
  //       modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  //     };
  //     const detector = await poseDetection.createDetector(
  //       poseDetection.SupportedModels.MoveNet,
  //       detectorConfig
  //     );
  //     if (
  //       typeof webcamRef.current !== "undefined" &&
  //       webcamRef.current !== null &&
  //       webcamRef.current.video.readyState === 4
  //     ) {
  //       const video = webcamRef.current.video;
  //       const videoWidth = webcamRef.current.video.videoWidth;
  //       const videoHeight = webcamRef.current.video.videoHeight;
  //       webcamRef.current.video.width = videoWidth;
  //       webcamRef.current.video.height = videoHeight;
  //       console.log(videoWidth);
  //       console.log(videoHeight);

  //       const detect = async () => {
  //         const Detectedpose = await detector.estimatePoses(video);
  //         setPose(Detectedpose);
  //         //console.log("psoe", Detectedpose);
  //         drawPose(Detectedpose[0], video, videoWidth, videoHeight);

  //         requestAnimationFrame(detect);
  //       };
  //       detect();
  //     }
  //   };
  //   runPosenet();
  // }, []);

  // const drawPose = (pose, video, videoWidth, videoHeight) => {
  //   console.log("in draw", pose);
  //   //console.log("text", pose["keypoints"]);
  //   console.log(canvasRef.current);
  //   if (canvasRef.current && pose && pose.keypoints) {
  //     console.log("in iffff");
  //     const ctx = canvasRef.current.getContext("2d");
  //     canvasRef.current.width = videoWidth;
  //     canvasRef.current.height = videoHeight;
  //     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  //     // ctx.scale(-1, 1);
  //     // ctx.translate(-videoWidth, 0);
  //     const keypoints = pose.keypoints;
  //     const isMirrored = true; // Set to true if the video is mirrored
  //     const mirroredKeypoints = keypoints.map((keypoint) => {
  //       const mirroredX = isMirrored ? videoWidth - keypoint.x : keypoint.x;
  //       const mirroredY = keypoint.y;
  //       // Create a new object with mirrored coordinates
  //       return { x: mirroredX, y: mirroredY, score: keypoint.score };
  //     });

  //     // Draw keypoints using adjusted x and y
  //     //drawKeypoints(mirroredKeypoints, 0.4, "red", ctx);
  //     drawKeypoints(mirroredKeypoints, ctx);
  //     drawSkeleton(mirroredKeypoints, ctx);
  //   }
  // };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        // style={{ transform: "scaleX(-1)" }}
        mirrored={true}
        className="absolute left-0 text-center z-9 w-1/2 h-full"
      />
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute left-0 text-center z-9 w-1/2 h-full"
      />
    </div>
  );
};

export default PoseEstimation;
