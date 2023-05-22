// For gesture control
let video
let classifier
let flipVideo

function setupVideo() {
  video = createCapture(VIDEO)
  video.hide()
  //flipVideo = ml5.flipImage(video)
}

// This function is called when there is a video frame available
function classifyVideo() {
  // Flip left/right (because P5 flips the video feed)
  flipVideo = ml5.flipImage(video)
  
  // Classify the frame using our machine learning model
  classifier.classify(video, gotResults);
}

// This function is called when our model has classified the image
function gotResults(error, results) {
  // Check if there was a problem
  if (error) {
    console.error(error);
    return;
  }
  
  videoClassified(results[0].label)

}


