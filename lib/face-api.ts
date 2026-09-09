import * as faceapi from "@vladmandic/face-api";

let modelsLoaded = false;
let modelLoadingPromise: Promise<void> | null = null;

/**
 * Loads the face detection, landmark, and recognition models from public/models.
 * Uses a singleton promise to avoid multiple redundant load operations.
 * Operates purely in the client browser using WebGL / CPU.
 */
export async function loadFaceApiModels(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (modelsLoaded) {
    return;
  }

  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }

  modelLoadingPromise = (async () => {
    const MODEL_URL = "/models";

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);

    modelsLoaded = true;
  })();

  return modelLoadingPromise;
}

export function areModelsLoaded(): boolean {
  return modelsLoaded;
}

/**
 * Detects all faces in a video frame with landmarks and descriptors.
 * Returning all detected faces allows the enrollment kiosk to validate that
 * exactly ONE face is visible (rejecting 0 or multiple faces).
 */
export async function detectAllFacesInVideo(video: HTMLVideoElement) {
  if (!modelsLoaded) {
    await loadFaceApiModels();
  }

  // Using TinyFaceDetector options configured for standard webcam resolution
  const detectorOptions = new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,
    scoreThreshold: 0.5,
  });

  return faceapi
    .detectAllFaces(video, detectorOptions)
    .withFaceLandmarks()
    .withFaceDescriptors();
}

/**
 * Validates that an extracted face embedding matches the standard 128-dimensional float vector.
 *
 * Mathematical guarantee:
 * ResNet-34 FaceRecognitionNet outputs an L2-normalized unit vector (sum of squares = 1.0).
 * Because sum_{i=1}^{128} x_i^2 = 1.0, each individual coordinate is mathematically bounded
 * within [-1.0, 1.0]. Any value outside this range indicates an invalid or corrupted vector.
 */
export function validateFaceDescriptor(descriptor: unknown): descriptor is number[] {
  if (!Array.isArray(descriptor)) {
    return false;
  }

  if (descriptor.length !== 128) {
    return false;
  }

  return descriptor.every(
    (val) =>
      typeof val === "number" &&
      !Number.isNaN(val) &&
      Number.isFinite(val) &&
      val >= -1.0 &&
      val <= 1.0
  );
}

export { faceapi };
