if (!localStorage["enabled"]) {
  localStorage["enabled"] = true;
  localStorage["stepTime"] = 3;
}

function setConf(obj){
    localStorage["enabled"] = obj["enabled"];
    localStorage["stepTime"] = obj["stepTime"];
}

function getConf(){
  var res = {
    enabled: localStorage["enabled"],
    stepTime: localStorage["stepTime"],
  };
  return res;
}

/*
function sendRequestUpdate(obj){
  chrome.tabs.query({url: URL}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, Object.assign({sm: "REQ_UPDATE"}, obj), (res) => {
      if (res.sm && res.sm == "RES_UPDATED")
        console.log("Update succeeded");
      else
        console.log("Update failure");
    });
  });
}
*/

chrome.runtime.onMessage.addListener((request, sender, res) => {
  if (!request.sm)
    return;
  if (request.sm == "REQ_CONF")
    res(getConf());
});
