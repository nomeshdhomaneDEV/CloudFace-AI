"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadFaceApiModels, detectAllFacesInVideo } from "@/lib/face-api";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ScanFace,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";

interface FaceEnrollmentKioskProps {
  initialEnrolled: boolean;
  initialEnrolledAt: string | null;
}

type KioskState =
  | "IDLE"
  | "LOADING_MODELS"
  | "CAMERA_ACTIVE"
  | "CAPTURING"
  | "SUCCESS"
  | "ERROR";

type DetectionStatus = "NO_FACE" | "MULTIPLE_FACES" | "READY";

/**
 * Face detector classification confidence threshold (0.65) used strictly as an enrollment quality filter.
 *
 * Metric breakdown:
 * - This value represents TinyFaceDetector's bounding-box classification confidence:
 *   P(box contains a human face) under standard webcam illumination and resolution.
 * - It is an enrollment-quality gating threshold to reject background clutter, non-face objects,
 *   or poor framing before extracting biometric descriptors.
 * - It is NOT a face-recognition accuracy metric or biometric security guarantee (which is evaluated
 *   separately via Euclidean distance during face verification/matching).
 * - For TinyFaceDetector (default base threshold 0.50), 0.65 is technically optimal for this academic MVP:
 *   it eliminates false positives while avoiding high false rejections on diverse student laptop webcams.
 */
const ENROLLMENT_DETECTION_THRESHOLD = 0.65;

export function FaceEnrollmentKiosk({
  initialEnrolled,
  initialEnrolledAt,
}: FaceEnrollmentKioskProps) {
  const router = useRouter();

  const [kioskState, setKioskState] = useState<KioskState>("IDLE");
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>("NO_FACE");
  const [detectionScore, setDetectionScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled);
  const [enrolledAt, setEnrolledAt] = useState<string | null>(initialEnrolledAt);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopRef = useRef<number | null>(null);
  const isCapturingRef = useRef(false);

  // Safely stop all tracks on the webcam stream
  const stopCameraStream = useCallback(() => {
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Ensure camera is stopped on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Detection loop running on active video frames
  const runDetectionLoop = useCallback(() => {
    const loop = () => {
      const video = videoRef.current;
      if (!video || video.paused || video.ended || isCapturingRef.current) {
        loopRef.current = requestAnimationFrame(loop);
        return;
      }

      // Wait until video has valid dimensions
      if (video.readyState < 2) {
        loopRef.current = requestAnimationFrame(loop);
        return;
      }

      detectAllFacesInVideo(video)
        .then((detections) => {
          if (isCapturingRef.current) return;

          if (detections.length === 0) {
            setDetectionStatus("NO_FACE");
            setDetectionScore(null);
          } else if (detections.length > 1) {
            setDetectionStatus("MULTIPLE_FACES");
            setDetectionScore(null);
          } else {
            // Exactly one face detected
            const face = detections[0];
            const score = face.detection.score;
            setDetectionScore(Math.round(score * 100));

            // Enrollment quality threshold filter for single face
            if (score >= ENROLLMENT_DETECTION_THRESHOLD) {
              setDetectionStatus("READY");
            } else {
              setDetectionStatus("NO_FACE");
            }
          }
        })
        .catch((err) => {
          console.warn("Frame detection error:", err);
        })
        .finally(() => {
          if (!isCapturingRef.current) {
            loopRef.current = requestAnimationFrame(loop);
          }
        });
    };

    loopRef.current = requestAnimationFrame(loop);
  }, []);

  // User-initiated camera start
  const handleStartCamera = async () => {
    setErrorMessage(null);
    setKioskState("LOADING_MODELS");

    try {
      // 1. Load static model weights from /public/models
      await loadFaceApiModels();

      // 2. Request user media with optimal face detection constraints
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Webcam access is not supported by your browser. Please use Chrome, Edge, Firefox, or Safari."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setKioskState("CAMERA_ACTIVE");
      isCapturingRef.current = false;
      loopRef.current = requestAnimationFrame(runDetectionLoop);
    } catch (err: unknown) {
      stopCameraStream();
      setKioskState("ERROR");

      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setErrorMessage(
            "Camera permission was denied. Please allow camera access in your browser settings to proceed with face enrollment."
          );
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setErrorMessage(
            "No webcam device was detected. Please connect a functional camera and try again."
          );
        } else if (err.name === "NotReadableError") {
          setErrorMessage(
            "Webcam is in use by another application. Please close other software using the camera and try again."
          );
        } else {
          setErrorMessage(err.message || "Failed to initialize camera or AI models.");
        }
      } else {
        setErrorMessage("An unexpected error occurred while starting camera.");
      }
    }
  };

  // Capture face and submit embedding vector
  const handleCaptureAndEnroll = async () => {
    const video = videoRef.current;
    if (!video || isCapturingRef.current) return;

    isCapturingRef.current = true;
    setKioskState("CAPTURING");

    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
    }

    try {
      // Perform single-face extraction with descriptor
      const detections = await detectAllFacesInVideo(video);

      if (detections.length === 0) {
        throw new Error("No face was detected at the capture moment. Please try again.");
      }

      if (detections.length > 1) {
        throw new Error("Multiple faces were detected at the capture moment. Only one face is permitted.");
      }

      const singleFace = detections[0];

      if (singleFace.detection.score < ENROLLMENT_DETECTION_THRESHOLD) {
        throw new Error("Face detection quality did not meet the enrollment threshold. Please position your face clearly in good lighting.");
      }

      // Convert Float32Array to standard serializable number array (128 floats)
      const descriptorArray = Array.from(singleFace.descriptor);

      if (descriptorArray.length !== 128) {
        throw new Error("Generated face descriptor length is invalid.");
      }

      // Submit embedding vector to secure API
      const response = await fetch("/api/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descriptor: descriptorArray }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server failed to register face enrollment.");
      }

      // Clean up camera hardware
      stopCameraStream();

      setIsEnrolled(true);
      setEnrolledAt(data.enrolledAt ? new Date(data.enrolledAt).toLocaleDateString() : new Date().toLocaleDateString());
      setKioskState("SUCCESS");

      router.refresh();
    } catch (captureErr: unknown) {
      isCapturingRef.current = false;
      setKioskState("CAMERA_ACTIVE");
      loopRef.current = requestAnimationFrame(runDetectionLoop);

      if (captureErr instanceof Error) {
        setErrorMessage(captureErr.message);
      } else {
        setErrorMessage("Failed to capture face embedding. Please try again.");
      }
    }
  };

  const formattedEnrolledDate = enrolledAt
    ? new Date(enrolledAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Current Status Badge Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isEnrolled
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
            }`}
          >
            <ScanFace className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Enrollment Status
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-cyan-400 font-mono">Phase 6 Active</span>
            </div>
            <h2 className="text-base font-bold text-white">
              {isEnrolled ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 inline" /> Face Enrollment: Enrolled
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 inline" /> Face Enrollment: Not Enrolled
                </span>
              )}
            </h2>
          </div>
        </div>

        {formattedEnrolledDate && (
          <span className="text-xs text-slate-400 font-mono sm:text-right">
            Last enrolled on {formattedEnrolledDate}
          </span>
        )}
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div
          id="enroll-error-alert"
          className="p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block text-red-200">Action Required</span>
            <p className="leading-relaxed text-xs text-red-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Interactive Webcam Kiosk Viewport */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        {/* State: SUCCESS Banner */}
        {kioskState === "SUCCESS" ? (
          <div className="py-12 px-4 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Enrollment Successful</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your 128-dimensional face embedding has been verified and registered for classroom attendance matching.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-[11px] text-slate-400 text-left space-y-1">
              <p>• The original webcam image was not stored.</p>
              <p>• Only numerical biometric embedding vectors are retained.</p>
              <p>• Used exclusively for project attendance verification.</p>
            </div>

            <button
              type="button"
              id="btn-re-enroll"
              onClick={handleStartCamera}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update / Re-Enroll Face</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Container */}
            <div className="relative aspect-video max-w-2xl mx-auto rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center">
              {/* HTML Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${
                  kioskState === "CAMERA_ACTIVE" || kioskState === "CAPTURING"
                    ? "block"
                    : "hidden"
                }`}
              />

              {/* State: IDLE Placeholder */}
              {kioskState === "IDLE" && (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-400 mx-auto flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Camera Standby</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                      Camera access is activated only when you click Start Camera.
                    </p>
                  </div>
                </div>
              )}

              {/* State: LOADING_MODELS */}
              {kioskState === "LOADING_MODELS" && (
                <div className="p-8 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Preparing Detection Models</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Loading lightweight neural network weights...
                    </p>
                  </div>
                </div>
              )}

              {/* State: ERROR Placeholder */}
              {kioskState === "ERROR" && (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center">
                    <CameraOff className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Camera Unavailable</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                      Please check permissions and hardware connections.
                    </p>
                  </div>
                </div>
              )}

              {/* Live Oval Guide Overlay & Telemetry Pill */}
              {(kioskState === "CAMERA_ACTIVE" || kioskState === "CAPTURING") && (
                <>
                  {/* Subtle face centering guide oval */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div
                      className={`w-44 sm:w-56 h-60 sm:h-72 rounded-[48%] border-2 transition-colors duration-200 ${
                        detectionStatus === "READY"
                          ? "border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                          : detectionStatus === "MULTIPLE_FACES"
                          ? "border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                          : "border-cyan-400/40 border-dashed"
                      }`}
                    />
                  </div>

                  {/* Corner reticle decorations */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70" />

                  {/* Real-Time Detection Telemetry Status Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {detectionStatus === "READY" ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-emerald-300 font-sans text-[11px] sm:text-xs">
                            Face detected — ready to capture
                          </span>
                        </>
                      ) : detectionStatus === "MULTIPLE_FACES" ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-amber-300 font-sans text-[11px] sm:text-xs flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Multiple faces detected (only 1 allowed)
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                          <span className="text-slate-300 font-sans text-[11px] sm:text-xs">
                            No face detected — position face in oval
                          </span>
                        </>
                      )}
                    </div>

                    {detectionScore !== null && (
                      <span className="text-cyan-400 text-[11px] hidden sm:inline">
                        Quality: {detectionScore}%
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Controls and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {kioskState === "IDLE" || kioskState === "ERROR" ? (
                <button
                  type="button"
                  id="btn-start-camera"
                  onClick={handleStartCamera}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    id="btn-capture-enroll"
                    onClick={handleCaptureAndEnroll}
                    disabled={
                      kioskState === "CAPTURING" ||
                      detectionStatus !== "READY"
                    }
                    className={`w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                      detectionStatus === "READY" && kioskState !== "CAPTURING"
                        ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20 cursor-pointer"
                        : "bg-white/10 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {kioskState === "CAPTURING" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Embedding...</span>
                      </>
                    ) : (
                      <>
                        <ScanFace className="w-4 h-4" />
                        <span>Capture & Enroll Face</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    id="btn-stop-camera"
                    onClick={() => {
                      stopCameraStream();
                      setKioskState("IDLE");
                      setDetectionStatus("NO_FACE");
                    }}
                    disabled={kioskState === "CAPTURING"}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Biometric Privacy Transparency Card */}
      <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Biometric Privacy & Processing Disclosure</span>
        </div>
        <ul className="space-y-1.5 text-slate-400 list-disc list-inside leading-relaxed text-[11px]">
          <li>
            Webcam video frames are processed entirely within your browser using a FREE, MIT-licensed browser-side face recognition library suitable for this academic MVP.
          </li>
          <li>
            The original webcam image/video is not stored. The system stores a numerical face embedding for future face matching.
          </li>
          <li>
            Only the extracted 128-dimensional mathematical descriptor vector is transmitted to the server.
          </li>
          <li>
            The embedding is treated as sensitive biometric information used strictly for this project&apos;s face verification and attendance tracking purpose.
          </li>
          <li>
            The quality threshold is utilized solely as an enrollment quality indicator and does not represent biometric-grade security.
          </li>
        </ul>
      </div>
    </div>
  );
}
