
// contentScript.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'sap_url_changed') {
  }else if (request.action === 'get_user') {    
    let username_span = document.querySelector("#header-user-menu > article > ul > li:nth-child(1) > span");
    if (username_span) {
      sendResponse( username_span.innerHTML)
    } else {
      sendResponse({ data: null })
    }
  } else { sendResponse('no action') }
});
console.log('listening')