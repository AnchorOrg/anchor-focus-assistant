// monitor.ts
import * as mpFaceDetection from '@mediapipe/face_detection';
import * as mpDrawing from '@mediapipe/drawing_utils';

const videoElement = document.getElementsByClassName('input_video')[0] as HTMLVideoElement;
const canvasElement = document.getElementsByClassName('output_canvas')[0] as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext('2d');

const faceDetection = new mpFaceDetection.FaceDetection({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
  }
});

faceDetection.setOptions({
  modelSelection: 1,
  minDetectionConfidence: 0.5
});

faceDetection.onResults(onResults);

function onResults(results: mpFaceDetection.Results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  let isFocused = false;
  let focusScore = 0;

  if (results.detections.length > 0) {
    for (const detection of results.detections) {
      mpDrawing.drawRectangle(canvasCtx, detection.boundingBox, {color: 'blue', lineWidth: 4});
      mpDrawing.drawLandmarks(canvasCtx, detection.landmarks, {color: 'red', radius: 2});

      // 詳細な集中状態の検知ロジック
      const landmarks = detection.landmarks;
      const leftEye = landmarks[0]; // 左目のランドマーク
      const rightEye = landmarks[1]; // 右目のランドマーク
      const nose = landmarks[2]; // 鼻のランドマーク

      // 目の開閉を検出
      const leftEyeOpen = leftEye.visibility > 0.5;
      const rightEyeOpen = rightEye.visibility > 0.5;

      // 視線の方向を検出
      const gazeDirection = Math.abs(leftEye.x - rightEye.x) < 0.1 && Math.abs(leftEye.y - rightEye.y) < 0.1;

      // 目が開いていて、視線が正面を向いている場合、集中していると判断
      if (leftEyeOpen && rightEyeOpen && gazeDirection) {
        isFocused = true;
        focusScore = 100; // 仮のスコア
      }
    }
  }

  canvasCtx.restore();

  // 集中状態とスコアを更新するためのコールバックを呼び出す
  if (typeof window.updateFocusState === 'function') {
    window.updateFocusState(isFocused, focusScore);
  }
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceDetection.send({image: videoElement});
  },
  width: 1280,
  height: 720
});

export { camera, faceDetection, onResults };