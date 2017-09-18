var enabled = false;
var stepTime = 0;
var slider;

window.addEventListener("DOMContentLoaded", () => {
  slider = new Slider('#stepTime', {
    formatter: function(value) {
      return 'Time: ' + value + ' s';
    },
    tooltip: 'always',
    tooltip_position: 'bottom'
  });
  enabled = document.getElementById("enabled");
  secSlider = document.getElementById("secSlider");
  chrome.runtime.getBackgroundPage((bg) => {
    var conf = bg.getConf();
    enabled.checked = conf.enabled == 'true';
    slider.setValue(conf.stepTime);
    updateView();
  });
  enabled.addEventListener("click", () => {
    updateView();
    setConf();
  });
  secSlider.addEventListener("mouseup", () => {
    updateView();
    setConf();
  });
});

var updateView = () => {
  console.log('updateView');
  if (enabled.checked){
    slider.enable();
  } else {
    slider.disable();
  }
}

var setConf = () => {
  chrome.runtime.getBackgroundPage((bg) => {
    var obj = {
      enabled: enabled.checked,
      stepTime: slider.getValue()
    };
    bg.setConf(obj);
    bg.sendRequestUpdate(obj);
  });
}

