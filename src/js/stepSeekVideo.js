//Since background page cannot forward video, insert seeking script into the content and execute.
var seekTimer;
var stepSeekVideo = (sec) => {
  console.log("Seek time:" + sec);
  var video = document.querySelector("video[width='100%'][src^='blob:https://www.amazon.com']");
  console.log(video);
  console.log(video.currentTime);
  console.log(video.readyState);
  video.currentTime += sec;
  /*
  var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
  if (!isPlaying) {
    video.play();
  }
  */
  var resumeVideo = () => {
    var video = document.querySelector("video[width='100%'][src^='blob:https://www.amazon.com']");
    var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
    if (!isPlaying) {
      video.play();
    }
  };
  seekTimer = window.setTimeout(resumeVideo, 1000);
};
