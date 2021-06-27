"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var tf = require("@tensorflow/tfjs-core");
var config_1 = require("./config");
function createPascalColormap() {
    /**
     * Generates the colormap matching the Pascal VOC dev guidelines.
     * The original implementation in Python: https://git.io/fjgw5
     */
    var pascalColormapMaxEntriesNum = config_1.config['DATASET_MAX_ENTRIES']['PASCAL'];
    var colormap = new Array(pascalColormapMaxEntriesNum);
    for (var idx = 0; idx < pascalColormapMaxEntriesNum; ++idx) {
        colormap[idx] = new Array(3);
    }
    for (var shift = 7; shift > 4; --shift) {
        var indexShift = 3 * (7 - shift);
        for (var channel = 0; channel < 3; ++channel) {
            for (var idx = 0; idx < pascalColormapMaxEntriesNum; ++idx) {
                colormap[idx][channel] |= ((idx >> (channel + indexShift)) & 1)
                    << shift;
            }
        }
    }
    return colormap;
}
exports.createPascalColormap = createPascalColormap;
/**
 * Returns
 *
 * @param base  :: `ModelArchitecture`
 *
 * The type of model to load (either `pascal`, `cityscapes` or `ade20k`).
 *
 * @param quantizationBytes (optional) :: `QuantizationBytes`
 *
 * The degree to which weights are quantized (either 1, 2 or 4).
 * Setting this attribute to 1 or 2 will load the model with int32 and
 * float32 compressed to 1 or 2 bytes respectively.
 * Set it to 4 to disable quantization.
 *
 * @return The URL of the TF.js model
 */
function getURL(base, quantizationBytes) {
    var TFHUB_BASE = "" + config_1.config['BASE_PATH'];
    var TFHUB_QUERY_PARAM = 'tfjs-format=file';
    var modelPath = quantizationBytes === 4 ?
        base + "/1/default/1/model.json" :
        base + "/1/quantized/" + quantizationBytes + "/1/model.json";
    // Example of url that should be generated.
    // https://tfhub.dev/tensorflow/tfjs-model/deeplab/pascal/1/default/1/model.json?tfjs-format=file
    return TFHUB_BASE + "/" + modelPath + "?" + TFHUB_QUERY_PARAM;
}
exports.getURL = getURL;
/**
 * @param base  :: `ModelArchitecture`
 *
 * The type of model to load (either `pascal`, `cityscapes` or `ade20k`).
 *
 * @return colormap :: `[number, number, number][]`
 *
 * The list of colors in RGB format, represented as arrays and corresponding
 * to labels.
 */
function getColormap(base) {
    if (base === 'pascal') {
        return config_1.config['COLORMAPS']['PASCAL'];
    }
    else if (base === 'ade20k') {
        return config_1.config['COLORMAPS']['ADE20K'];
    }
    else if (base === 'cityscapes') {
        return config_1.config['COLORMAPS']['CITYSCAPES'];
    }
    throw new Error("SemanticSegmentation cannot be constructed " +
        ("with an invalid base model " + base + ". ") +
        "Try one of 'pascal', 'cityscapes' and 'ade20k'.");
}
exports.getColormap = getColormap;
/**
 * @param base  :: `ModelArchitecture`
 *
 * The type of model to load (either `pascal`, `cityscapes` or `ade20k`).
 *
 * @return labellingScheme :: `string[]`
 *
 * The list with verbal descriptions of labels
 */
function getLabels(base) {
    if (base === 'pascal') {
        return config_1.config['LABELS']['PASCAL'];
    }
    else if (base === 'ade20k') {
        return config_1.config['LABELS']['ADE20K'];
    }
    else if (base === 'cityscapes') {
        return config_1.config['LABELS']['CITYSCAPES'];
    }
    throw new Error("SemanticSegmentation cannot be constructed " +
        ("with an invalid base model " + base + ". ") +
        "Try one of 'pascal', 'cityscapes' and 'ade20k'.");
}
exports.getLabels = getLabels;
/**
 * @param input  ::
 * `ImageData|HTMLImageElement|HTMLCanvasElement| HTMLVideoElement|tf.Tensor3D`
 *
 * The input image to prepare for segmentation.
 *
 * @return resizedInput :: `string[]`
 *
 * The input tensor to run through the model.
 */
function toInputTensor(input) {
    return tf.tidy(function () {
        var image = input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
        var _a = image.shape, height = _a[0], width = _a[1];
        var resizeRatio = config_1.config['CROP_SIZE'] / Math.max(width, height);
        var targetHeight = Math.round(height * resizeRatio);
        var targetWidth = Math.round(width * resizeRatio);
        return tf.expandDims(tf.image.resizeBilinear(image, [targetHeight, targetWidth]));
    });
}
exports.toInputTensor = toInputTensor;
/**
 * @param colormap :: `Color[]`
 *
 * The list of colors in RGB format, represented as arrays and corresponding
 * to labels.
 *
 * @param labellingScheme :: `string[]`
 *
 * The list with verbal descriptions of labels
 *
 * @param rawSegmentationMap :: `tf.Tensor2D`
 *
 * The segmentation map of the image
 *
 * @param canvas (optional) :: `HTMLCanvasElement`
 *
 * The canvas where to draw the output
 *
 * @returns A promise of a `DeepLabOutput` object, with four attributes:
 *
 * - **legend** :: `{ [name: string]: [number, number, number] }`
 *
 *   The legend is a dictionary of objects recognized in the image and their
 *   colors in RGB format.
 *
 * - **height** :: `number`
 *
 *   The height of the returned segmentation map
 *
 * - **width** :: `number`
 *
 *   The width of the returned segmentation map
 *
 * - **segmentationMap** :: `Uint8ClampedArray`
 *
 *   The colored segmentation map as `Uint8ClampedArray` which can be
 *   fed into `ImageData` and mapped to a canvas.
 */
function toSegmentationImage(colormap, labelNames, rawSegmentationMap, canvas) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, height, width, segmentationImageBuffer, mapData, labels, columnIndex, rowIndex, label, segmentationImageTensor, segmentationMap, legend, _i, _b, label;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (colormap.length < labelNames.length) {
                        throw new Error('The colormap must be expansive enough to encode each label. ' +
                            ("Aborting, since the given colormap has length " + colormap.length + ", ") +
                            ("but there are " + labelNames.length + " labels."));
                    }
                    _a = rawSegmentationMap.shape, height = _a[0], width = _a[1];
                    segmentationImageBuffer = tf.buffer([height, width, 3], 'int32');
                    return [4 /*yield*/, rawSegmentationMap.array()];
                case 1:
                    mapData = _c.sent();
                    labels = new Set();
                    for (columnIndex = 0; columnIndex < height; ++columnIndex) {
                        for (rowIndex = 0; rowIndex < width; ++rowIndex) {
                            label = mapData[columnIndex][rowIndex];
                            labels.add(label);
                            segmentationImageBuffer.set(colormap[label][0], columnIndex, rowIndex, 0);
                            segmentationImageBuffer.set(colormap[label][1], columnIndex, rowIndex, 1);
                            segmentationImageBuffer.set(colormap[label][2], columnIndex, rowIndex, 2);
                        }
                    }
                    segmentationImageTensor = segmentationImageBuffer.toTensor();
                    return [4 /*yield*/, tf.browser.toPixels(segmentationImageTensor, canvas)];
                case 2:
                    segmentationMap = _c.sent();
                    tf.dispose(segmentationImageTensor);
                    legend = {};
                    for (_i = 0, _b = Array.from(labels); _i < _b.length; _i++) {
                        label = _b[_i];
                        legend[labelNames[label]] = colormap[label];
                    }
                    return [2 /*return*/, { legend: legend, segmentationMap: segmentationMap }];
            }
        });
    });
}
exports.toSegmentationImage = toSegmentationImage;
