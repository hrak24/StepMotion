let isEnabled = false;
let stepTime = 3;
let video;
let initTimer;
let observer;
let VIDEO_PTN = "video[width='100%'][src^='blob:https://www.amazon.com']";
let stepSeekBack;
let stepSeekForward;

var init = () => {
  //console.log("init");
  //addMutationObserver();
  startTimer();
};

var startTimer = () => {
  //console.log("startTimer");
  initTimer = window.setTimeout(initVideo, 300);
};

var stopTimer = () => {
  //console.log("stopTimer");
  window.clearTimeout(initTimer);
  initTimer = null;
};

/*
var addMutationObserver = () => {
  console.log("addMutationObserver");
  var target = document.getElementById("dv-web-player");
  var conf = { attributes: true, childList: true, characterData: true };
  observer = new MutationObserver(() => {
    console.log("mutated");
    initVideo();
  });
  observer.observe(target, conf);
};
*/

/*
var removeMutationObserver = () => {
  console.log("removeMutationObserver");
  observer.disconnect();
}
*/

var initVideo = () => {
  stopTimer();
  //console.log("initVideo");
  if(!document.querySelector(VIDEO_PTN) || !document.querySelector(".playIcon, .pausedIcon") || !document.querySelector(".fastSeekBack") || !document.querySelector(".fastSeekForward")){
    //console.log("noVideo or icons");
    startTimer();
    return false;
  }
  video = document.querySelector(VIDEO_PTN);
  //removeMutationObserver();
  insertSeekScript();
  initParam();
};

var insertSeekScript = () => {
  var script = document.createElement('script');
  script.setAttribute('src', chrome.extension.getURL('js/stepSeekVideo.js'));
  document.body.appendChild(script);
};

var executeSeek = (sec) => {
  var script = document.createElement('script');
  script.innerText = "stepSeekVideo(" + sec + ");";
  document.body.appendChild(script);
};

var initParam = () => {
  chrome.runtime.sendMessage({sm: "REQ_CONF"}, (res) => {
    updateConf(res);
  });
};

function updateConf(res){
  //console.log("updateConf");
  isEnabled = encodeURIComponent(res["enabled"]) == "true";
  stepTime = encodeURIComponent(res["stepTime"]);
  if (isEnabled) {
    updateView();
  }
}

function updateView() {
  //console.log("updateView");
  var buttonsArea = document.querySelector(".buttons");
  var orgBackBtn = document.querySelector(".fastSeekBack");
  var orgForwardBtn = document.querySelector(".fastSeekForward");
  stepSeekBack = orgBackBtn.cloneNode(true);
  stepSeekForward = orgForwardBtn.cloneNode(true);
  var styleElm = document.createElement("style");
  document.head.appendChild(styleElm);

  var additionalStyle = [
    {
      key: ".cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekBack, .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekForward",
      value: "-webkit-align-items: center; align-items: center; display: -webkit-inline-flex; display: inline-flex; font-size: 19px; font-weight: 400"
    },
    {
      key: ".cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekBack, .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekForward",
      value: "border-style: solid; border-color: transparent; border-width: 10px; opacity: .25"
    },
    {
      key: ".cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekBack, .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekForward",
      value: "position: relative; width: 50px; height: 50px; shape-rendering: crispEdges; float: left"
    },
    {
      key: ".cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekBack>.seekTime, .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekForward>.seekTime",
      value: "text-align: center; height: 20px; width: 49px"
    },
    {
      key: ".cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekBack.hide, .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekForward.hide",
      value: "opacity: 0; visibility: hidden",
    },
    {
      key:".cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.animatedPausedIcon, .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.pausedIcon, .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.playIcon",
      value: "margin: 0;"
    },
    {
      key: ".cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekBack:hover:not(.hide), .cascadesContainer>div>.webPlayer .pausedOverlay>.buttons>.stepSeekForward:hover:not(.hide)",
      value: "opacity: .75"
    }
  ]

  additionalStyle.forEach((style) => {
    var rule = style.key + "{" + style.value + "}";
    styleElm.sheet.insertRule(rule, 0);
  });

  stepSeekBack.style = orgBackBtn.style;
  stepSeekForward.style = orgForwardBtn.style;
  stepSeekBack.querySelector(".svgBackground").style = orgBackBtn.querySelector(".svgBackground").style;
  stepSeekForward.querySelector(".svgBackground").style = orgForwardBtn.querySelector(".svgBackground").style;
  stepSeekBack.querySelector(".seekTime").style = orgBackBtn.querySelector(".seekTime").style;
  stepSeekForward.querySelector(".seekTime").style = orgForwardBtn.querySelector(".seekTime").style;
  /*
  var stepSeekVideo = (sec) => {
    console.log("Seek time:" + sec);
    var video = document.querySelector(VIDEO_PTN);
    console.log(video);
    console.log(video.currentTime);
    video.currentTime += sec;
    video.play();
  };
  */
  var hideStepBtns = () => {
    stepSeekForward.classList.value = "stepSeekForward hide";
    stepSeekBack.classList.value = "stepSeekBack hide";
  };
  var showStepBtns = () => {
    stepSeekForward.classList.value = "stepSeekForward";
    stepSeekBack.classList.value = "stepSeekBack";
  };

  stepSeekBack.classList.value = "stepSeekBack";
  stepSeekBack.removeAttribute("data-reactid");
  stepSeekBack.querySelector(".seekTime").innerText = stepTime;
  stepSeekBack.querySelectorAll(".seekTime, img").forEach((elm) => {elm.removeAttribute("data-reactid")});
  stepSeekBack.addEventListener("click", () => {
    //stepSeekVideo(-1 * stepTime);
    executeSeek(-1 * stepTime);
  });

  stepSeekForward.classList.value = "stepSeekForward";
  stepSeekForward.removeAttribute("data-reactid");
  stepSeekForward.querySelector(".seekTime").innerText = stepTime;
  stepSeekForward.querySelectorAll(".seekTime, img").forEach((elm) => {elm.removeAttribute("data-reactid")});
  stepSeekForward.addEventListener("click", () => {
    //stepSeekVideo(stepTime);
    executeSeek(stepTime);
  });

  buttonsArea.insertBefore(stepSeekBack, document.querySelector(".playIcon, .pausedIcon"));
  buttonsArea.insertBefore(stepSeekForward, document.querySelector(".fastSeekForward"));
  var mo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.target.classList.contains("fastSeekBack")) {
        return;
      }
      if (mutation.target.classList.contains("hide")) {
        hideStepBtns();
      } else {
        showStepBtns();
      }
    });
  });
  mo.observe(document.querySelector(".fastSeekBack"), {attributes: true});
  hideStepBtns();

}

window.onkeydown = (e) => {
  if (e.key == 'ArrowLeft') {
    if (e.shiftKey) {
      video.currentTime -= 10;
    } else if (e.altKey) {
      video.currentTime -= 5;
    } else {
      video.currentTime -= 3;
    }
  } else if (e.key == 'ArrowRight') {
    if (e.shiftKey) {
      video.currentTime += 10;
    } else if (e.altKey) {
      video.currentTime += 5;
    } else {
      video.currentTime += 3;
    }
  }
};

init();

/*
chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.sm != "REQ_UPDATE") 
    return;
  updateConf(req);
  res({sm: "RES_UPDATED"});
});
*/

