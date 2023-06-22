import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { notifySuccess, notifyError } from "./notify";

tf.setBackend("webgl").then(() => console.log(tf.getBackend()));

const detectorConfig = {
  modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  enableTracking: true,
  trackerType: poseDetection.TrackerType.BoundingBox,
};

const detector = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet
);

function PoseDetection() {
  const [webcam, setWebCam] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const audio = new Audio("/alert.mp3");
  let idealDetection = null;
  let notify = 0;

  const runModel = () => {
    detect(detector, detectorConfig);
  };

  const detect = async (detector) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    const video = document.getElementById("video");
    detector.estimatePoses(video).then((item) => {
      [0, 1, 2, 3, 4].map((index) =>
        item.map((value) => {
          ctx.fillStyle = "teal";
          ctx.strokeStyle = "white";
          ctx.lineWidth = "3";
          const diffX =
            value.keypoints[index].x - idealDetection[0].keypoints[index].x;
          const diffY =
            value.keypoints[index].y - idealDetection[0].keypoints[index].y;
          ctx.beginPath();
          ctx.arc(
            value.keypoints[index].x,
            value.keypoints[index].y,
            5,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.stroke();
          if (Math.abs(diffX) > 100 || Math.abs(diffY) > 100) {
            notify = notify + 1;
            if (notify % 20 == 0) {
              audio.play();
            }
          }
        })
      );
    });
  };

  const idealPose = () => {
    const video = document.getElementById("video");
    detector.estimatePoses(video).then((item) => {
      idealDetection = item;
    });
  };

  useEffect(() => {
    var interval = null;
    if (webcam === true) {
      setTimeout(() => {
        idealPose();
      }, 3000);

      setTimeout(() => {
        interval = setInterval(() => runModel(), 100);
      }, 3500);
    }
    return () => {
      clearInterval(interval);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [webcam]);

  //
  //

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {webcam && (
            <Webcam
              id="video"
              ref={webcamRef}
              height={"480px"}
              width={"640px"}
              style={{ borderRadius: "8px" }}
            />
          )}
          {
            <canvas
              ref={canvasRef}
              style={{
                background: `${webcam ? "transparent" : "rgb(100 116 139 )"}`,
                position: `${webcam ? "absolute" : "relative"}`,
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "8px",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
              }}
            />
          }

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              className="btn btn-success"
              onClick={() => {
                setWebCam(true);
                notifyError("Camera Enabled");
              }}
            >
              Enable Video
            </button>
            <button
              className="btn btn-warning"
              onClick={() => {
                setWebCam(false);
                notifySuccess("Camera Disabled");
              }}
            >
              Disable Video
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PoseDetection;
