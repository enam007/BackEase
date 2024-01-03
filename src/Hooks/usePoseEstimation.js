import { useEffect, useState, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";
tf.setBackend("webgpu").then(() => main());

const usePoseEstimation = () => {
  const webcamRef = useRef(null);
  const [pose, setPose] = useState(null);

  useEffect(() => {
    const runPosenet = async () => {
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      };
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      const detect = async () => {
        if (
          typeof webcamRef.current !== "undefined" &&
          webcamRef.current !== null &&
          webcamRef.current.video.readyState === 4
        ) {
          const video = webcamRef.current.video;
          const Detectedpose = await detector.estimatePoses(video);
          //console.log(Detectedpose[0]);
          setPose(Detectedpose[0]);
        }

        requestAnimationFrame(detect);
      };
      detect();
    };
    runPosenet();
  }, []);
  return { webcamRef, pose };
};

export default usePoseEstimation;
