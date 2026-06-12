// src/components/Applications/Camera/Camera.tsx
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

export const Camera = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setHasPermission(true);
      toast.success("Camera started");
    } catch (err) {
      console.error(err);
      setHasPermission(false);
      toast.error("Cannot access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL("image/png");
      setCapturedImage(photo);
      stopCamera();
      toast.success("Photo taken!");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.download = `photo-${Date.now()}.png`;
      link.href = capturedImage;
      link.click();
      toast.success("Photo saved");
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-6xl mb-4">📷</div>
        <h2 className="text-xl font-bold mb-2">Camera Access Denied</h2>
        <p className="text-gray-500 mb-4">
          Please allow camera access in your browser settings
        </p>
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-primary rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Camera View */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/90 backdrop-blur-lg">
        <div className="flex justify-center gap-6">
          {!capturedImage ? (
            <>
              <button
                onClick={takePhoto}
                className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:scale-105 transition"
              />
              <button
                onClick={stopCamera}
                className="px-6 py-2 bg-red-500 rounded-full text-white"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                className="px-6 py-3 bg-gray-600 rounded-full text-white"
              >
                Retake
              </button>
              <button
                onClick={downloadPhoto}
                className="px-6 py-3 bg-primary rounded-full text-gray-800"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};
