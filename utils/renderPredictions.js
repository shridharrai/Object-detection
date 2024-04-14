import { throttle } from "lodash";

export const renderPredictions = (predictions, canvasCtx) => {
  // Clear the canvas rectangular area, making it fully transparent
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  // Set the font for text rendering
  const font = "16px sans-serif";
  canvasCtx.font = font;
  canvasCtx.textBaseline = "top";

  predictions.forEach((prediction) => {
    // Extract the bounding box coordinates
    const [x, y, width, height] = prediction["bbox"];

    const isPerson = prediction.class === "person";

    // Draw the bounding box
    canvasCtx.strokeStyle = isPerson ? "#FF0000" : "00FFFF"; // Set the stroke(drawing) color
    canvasCtx.lineWidth = 4; // Sets the width of lines for stroke(drwaing)
    canvasCtx.strokeRect(x, y, width, height); // Draws a rectangle but only strokes the outline of the rectangle

    // Fill the bounding box with color
    canvasCtx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`; // Sets the color used for filling shapes.
    canvasCtx.fillRect(x, y, width, height); // Fill the rectangle

    // Draw the label background
    canvasCtx.fillStyle = isPerson ? "FF0000" : "00FFFF"; // Set the background color
    const textWidth = canvasCtx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10);
    canvasCtx.fillRect(x, y, textWidth + 8, textHeight + 8); // Draw the background

    // Draw the label text
    canvasCtx.fillStyle = "#000000"; // Set the text color
    canvasCtx.fillText(prediction.class, x + 4, y + 4); // Render the text

    // if (isPerson) playAudio();
  });
};

const playAudio = throttle(() => {
  const audio = new Audio("/pols-aagyi-pols.mp3");
  audio.play();
}, 2000);
