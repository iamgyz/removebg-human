# AI-based background removal for human portrait

Fully powered by Tensorflow with the Semantic Segmentation in the Browser: DeepLab v3 Model!

## Live demo
https://rmbg.gyzlab.com/

![image](https://github.com/iamgyz/removebg-human/raw/master/demo.gif?t=1)


## Setup

Install dep

```sh
yarn
```

Launch the development server watching the files for changes.

```sh
yarn watch
```

Done!

## How to generate tensorflow-deeplab dependency if need update? 
1. Go to https://github.com/tensorflow/tfjs-models/tree/master/deeplab and download.
2. Follow instruction to build, and find everything in ./dist folder
3. Copy everything in the dist folder to /tensoflow-deeplab

## Reference
https://www.tensorflow.org/js/models?hl=zh-tw

https://github.com/tensorflow/tfjs-models/tree/master/deeplab

