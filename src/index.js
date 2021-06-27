import "@tensorflow/tfjs-backend-webgl";

import { load } from "@tensorflow-models/deeplab"; /** This is not from npm! */
import * as tf from "@tensorflow/tfjs-core";

const modelName = "pascal";
const deeplab = {};
// const state = {};
const quantizationBytes = 2; //default 2

/** Initialize TF */
const initializeModels = async () => {
  // state.quantizationBytes = quantizationBytes;
  deeplab[modelName] = await load({ base: modelName, quantizationBytes });

  const runner = document.getElementById(`cropBtn`);
  runner.onclick = async () => {
    changeModalMsg(
      "去背中請稍候...🥺<br>可能需要數秒鐘不等 😆"
    );
    displayModal(true);
    await tf.nextFrame();
    await runDeeplab(modelName);
  };

  // add event to upload-image
  const uploader = document.getElementById(`uploadFile`);
  uploader.addEventListener("change", processImages);

  initializeModelsDone();
};

const initializeModelsDone = () => {
  status("Initialised models, waiting for input...");
  displayModal(false);
};

const loadImage = (canvasId, file) => {
  return new Promise((resolve, reject) => {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    let image = new Image();
    let reader = new FileReader();
    reader.onload = (e) => {
      image.onload = () => {
        //console.log(factor);
        canvas.width = parseInt(image.naturalWidth);
        canvas.height = parseInt(image.naturalHeight);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.style.display = "inline";
        document.querySelector("#cropBtn").style.display = "inline";
        document.querySelector("#downloadBtn").style.display = "none";
        document.querySelector("#outputCanvas").style.display = "none";
        resolve(image);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const processImages = (event) => {
  // only process the first file
  const file = event.target.files[0];

  if (!file.type.match("image.*")) {
    return;
  }

  loadImage("inputCanvas", file);
};

const displaySegmentationMap = async (modelName, deeplabOutput) => {
  console.log(deeplabOutput);
  const { legend, height, width, segmentationMap } = deeplabOutput;

  /** After we get segmentation map, the width&height is re-sized! (In config: max = 513)
   *  So we need to re-size our original input canvas so that we could retrive the ROI
   */
  const canvas = document.getElementById("inputCanvas");
  const ctx = canvas.getContext("2d");
  // using tf to resize
  let img = tf.image.resizeBilinear(tf.browser.fromPixels(canvas), [height, width]);
  img = tf.cast(img, 'int32');
  await tf.browser.toPixels(img, canvas);//re-draw on canvas

  /*
  Here we only extract person!
  person = [192,128,128]
  */
 
  console.log(legend);
  if (legend["person"] == undefined) {
    alert("失敗！ 沒有偵測到任何人像！");
  }
  //has detect person!
  else {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(imgData);

    let count = 0;
    for (let i = 0; i < segmentationMap.length; i++) {
      if (
        !(
          segmentationMap[i] == legend["person"][0] &&
          segmentationMap[i + 1] == legend["person"][1] &&
          segmentationMap[i + 2] == legend["person"][2]
        )
      ) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 0;
        count++;
      }
      i = i + 3;
    }

    const canvas2 = document.getElementById("outputCanvas");
    const ctx2 = canvas2.getContext("2d");
    canvas2.width = canvas.width;
    canvas2.height = canvas.height;

    ctx2.putImageData(imgData, 0, 0);
    canvas2.style.display = "inline";
    document.querySelector("#downloadBtn").style.display = "inline";
    console.log(count);
  }
  displayModal(false);
};

const status = (message) => {
  console.log(message);
};

const runPrediction = (modelName, input, initialisationStart) => {
  deeplab[modelName].segment(input).then((output) => {
    displaySegmentationMap(modelName, output);
    status(
      `Ran in ${((performance.now() - initialisationStart) / 1000).toFixed(
        2
      )} s`
    );
  });
};

const changeModalMsg = (msg) => {
  document.querySelector("#loader-txt").innerHTML = msg;
};

const displayModal = (show) => {
  if (show) {
    $("#loadMe").modal({
      backdrop: "static", //remove ability to close modal with click
      keyboard: false, //remove option to close with keyboard
      show: show, //Display loader!
    });
  } else {
    $("#loadMe").modal("hide");
  }
};

const runDeeplab = async (modelName) => {
  status(`Running the inference...`);

  const input = document.getElementById("inputCanvas");

  //use setTimeout for modal showing
  setTimeout(() => {
    const predictionStart = performance.now();
    runPrediction(modelName, input, predictionStart);
  }, 500);
};


const dataUriToBlob = (dataUri) => {
  const b64 = atob(dataUri.split(",")[1]);
  const u8 = Uint8Array.from(b64.split(""), (e) => e.charCodeAt());
  return new Blob([u8], { type: "image/png" });
};


const downloadPhoto = () => {
  const data = document.querySelector("#outputCanvas").toDataURL();
  const blobUrl = URL.createObjectURL(dataUriToBlob(data));
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = blobUrl;
  a.download = new Date().getTime() + ".png";
  a.click();
  window.URL.revokeObjectURL(blobUrl);
};

document.addEventListener("DOMContentLoaded", async (e) => {
  changeModalMsg(`Tensorflow Model 載入中🙇`);
  displayModal(true);
  setTimeout(initializeModels, 500);

  document.querySelector("#downloadBtn").addEventListener("click", (e) => {
    downloadPhoto();
  });
});
