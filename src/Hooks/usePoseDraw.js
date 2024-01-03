import { useEffect } from "react";
import { drawPose } from "../Utils/draw";

const usePoseDraw = (pose, videoRef, canvasRef, calculateColors) => {
  useEffect(() => {
    if (pose && videoRef.current && canvasRef.current) {
      drawPose(pose, videoRef, calculateColors(pose), canvasRef);
    }
  }, [pose, videoRef, canvasRef, calculateColors]);
};

export default usePoseDraw;
