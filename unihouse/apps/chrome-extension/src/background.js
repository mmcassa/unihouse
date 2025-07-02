/**
 * When a web nav is completed and directed to a Conference Booking page in StarRez, add the Toggle All button
 */
chrome.webNavigation.onCompleted.addListener(function(details) {
  actions_on_url(details.url,details.tabId);
});

/**
 * When a URL is updated (within an SAP) to a Conference Booking page in StarRez, add the Toggle All button
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (  changeInfo.url ) { actions_on_url(changeInfo.url,tabId) } 
});

function actions_on_url(url,tabId) {
  // add toggle all button
  if (  match_group_bookings_tab_url(url)
      ) {
      add_script_to_group_booking_tab(tabId);
      
  }  
}

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


chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url) {
    const url = new URL(tab.url);
    const path = url.pathname + url.search + url.hash;

    chrome.storage.local.set({ currentPath: path });
  }
});

// Optional: update on tab URL change too
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);
    const path = url.pathname + url.search + url.hash;
    chrome.storage.local.set({ currentPath: path });
  }
});
