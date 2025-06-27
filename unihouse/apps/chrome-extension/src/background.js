/**
 * 
 */
chrome.webNavigation.onCompleted.addListener(function(details) {

  if (  match_group_bookings_tab_url(details.url) ) {
    add_script_to_group_booking_tab(details.tabId)
  }
});

/**
 * 
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (  changeInfo.url 
        && match_group_bookings_tab_url(changeInfo.url)
        ) {
        add_script_to_group_booking_tab(tabId);
        
    }
});

/**
 * 
 * @param {*} url 
 * @returns 
 */
function match_group_bookings_tab_url(url) {
    return url.match('https://uga.starrezhousing.com/StarRezWeb/.*group:[0-9]+:bookings');
}

/**
 * 
 * @param {*} tabId 
 */
function add_script_to_group_booking_tab(tabId) {
    chrome.scripting
        .executeScript({
            target: {tabId : tabId},
            files : [ "content_scripts/setup_custom_select_all_button.js" ]
        })
        .then(() => console.log("injected script"));
}