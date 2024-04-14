"use client";

import { useEffect, useRef, useState } from "react";
import WebCam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import { renderPredictions } from "@/utils/renderPredictions";

let detectInterval;
const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    runCoco();
    showMyVideo();
  }, []);

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  const runObjectDetection = async (net) => {
    if (canvasRef.current && webCamRef.current.video?.readyState === 4) {
      canvasRef.current.width = webCamRef.current.video.videoWidth;
      canvasRef.current.height = webCamRef.current.video.videoHeight;

      //find detected objects
      const detectedObjects = await net.detect(
        webCamRef.current.video,
        undefined,
        0.6
      );

      //   console.log(detectedObjects);

      const canvasCtx = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, canvasCtx);
    }
  };

  const showMyVideo = () => {
    if (webCamRef.current && webCamRef.current.video?.readyState === 4) {
      const myVideoWidth = webCamRef.current.video.videoWidth;
      const myVideoHeight = webCamRef.current.video.videoHeight;

      webCamRef.current.video.videoWidth = myVideoWidth;
      webCamRef.current.video.videoHeight = myVideoHeight;
    }
  };
  return (
    <div className="text-white mt-8">
      {isLoading ? (
        <div className="gradient-title">Loading AI Model...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          <WebCam
            ref={webCamRef}
            className="rounded-md w-full lg:h-[720px]"
            muted
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
