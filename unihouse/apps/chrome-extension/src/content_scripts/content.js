
// contentScript.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'sap_url_changed') {
  }
});