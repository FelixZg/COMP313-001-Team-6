chrome.browserAction.onClicked.addListener(tab => {
  chrome.windows.create({
    url: chrome.runtime.getURL("landingPage.html"),
    type: "popup",
    focused: true,
    width: 310,
    height: 500
  });
});