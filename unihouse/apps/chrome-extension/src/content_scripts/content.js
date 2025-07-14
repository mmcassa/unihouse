
// contentScript.js
var user_service_port = chrome.runtime.connect({ name: "user_service_conn"});
var stored_credentials = null;

function waitForElementWithMutationObserver(selector) {
    return new Promise(resolve => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes) {
                    const foundElement = document.querySelector(selector);
                    if (foundElement) {
                        observer.disconnect();
                        resolve(foundElement);
                        return;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * 
 */
async function create_api_key() {
  let user_button, account_button, add_api_button, api_key_name, api_key_value, save_api_key_button;
  // user_button = document.querySelector("#header-user-button")
  //                       .shadowRoot
  //                       .querySelector("button");
  // user_button.click();
  account_button = await waitForElementWithMutationObserver("#header-user-menu > footer > habitat-button.ui-btn-account")
  account_button = account_button.shadowRoot.querySelector("button");
  account_button.click();

  add_api_button = await waitForElementWithMutationObserver('table:not(.cloned) > thead > tr > th.add-cell[data-controller="ApiSecurityUser"] > div');
  await sleep(1000);
  add_api_button.scrollIntoView();
  add_api_button.click();

  api_key_name = await waitForElementWithMutationObserver('ul.edit-fields > li > div[data-fieldname="IPAddress"] > div > input.medium[name="IPAddress"]')
  token_name = Math.random().toString(36).substring(0,30);
  api_key_name.value = token_name;

  api_key_value = document.querySelector('ul.edit-fields > li > span[data-name="Token"]').innerHTML;

  await sleep(1000);
  save_api_key_button = await waitForElementWithMutationObserver('div.ui-btn-save[title="Save Token"]');
  save_api_key_button.click();
  return [api_key_value,token_name];

}


async function fetchAndParseDirectQuery(query) {
  try {
    let sr_dq = new MVC.DirectQuery.directQueryResults(query)
    sr_dq.Request( res => {
      return res;
    })
  } catch (error) {
    console.error("failed to use MCV",error)
  }
  try {
    const response = await fetch(window.location.origin + "/StarRezWeb/Tools/DirectQuery/DirectQueryResults", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "Accept" : "text/html"
      },
      body: JSON.stringify({
      starQLQuery: query,
      tableGuid: ""
    })
    });
    const htmlText = await response.text();

    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Locate the target table
    const table = doc.querySelector('table.ui-active-table');
    if (!table) throw new Error("Table not found");

    // Extract column names from <thead>
    const headers = Array.from(table.querySelectorAll('thead th')).map(th =>
      th.getAttribute('data-colname')
    );

    // Extract each row from <tbody>
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const data = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const rowData = {};
      cells.forEach((cell, i) => {
        const field = cell.querySelector('.field');
        rowData[headers[i]] = field ? field.textContent.trim() : null;
      });
      return rowData;
    });

    return data;
  } catch (error) {
    console.error("Error parsing table:", error);
    return [];
  }
}

async function fetch_credentials() {
  // create an api key and fetch the username from the header window
    let res;
    let username_span = document.querySelector("#header-user-menu > article > ul > li:nth-child(1) > span");
    let credentials = {"username" : username_span.innerHTML};
    if (username_span) {
      credentials["username"] = username_span.innerHTML;
    } else {
      console.error('No Username found, sending null')
      return null;
    }
    try {
      let fullname_el =  document.querySelector("#header-user-button")
                        .shadowRoot
                        .querySelector("div.dropdown > h3");
      if (fullname_el) {
        credentials['full_name'] = fullname_el.innerHTML;
      }else {
        console.error('No full_name element found, sending null')
        return null;
      }
    } catch {
      console.error('Error while traversing DOM for full_name value.')
      return null;
    }
    create_api_key().then((res) => {
        if (Array.isArray(res) 
            && typeof res[0] === 'string' 
            && typeof res[1] === 'string'
          ) {
          credentials['api_key'] = res[0];
          credentials['token_name'] = res[1];
          stored_credentials = credentials;
          // user_service_port.postMessage(credentials);
          return credentials;
        } else {
          console.error('Failed to create/find api_key');
          return null
        }
    });
    
    
}


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  console.log(request)
  if (request.action === 'fetch_transaction_list') {
    // fetches a list of transactions and then returns a list of async 
    console.log(request)
    let transaction_list = request.body;
    fetchAndParseDirectQuery(
      `SELECT transactionid, description, comments,chargeitem,chargegroup,amount 
        FROM transaction where transactionid in ( `+ transaction_list + ` )`
    ).then((data) => {
      if (data) {
        sendResponse(data)
      } else {
        sendResponse({ data: null })
      }
     });
     return true;

  } else if (request.action === 'fetch_credentials') {
    if (stored_credentials === null) {
        fetch_credentials().then( (creds) => {
          if (creds) {
              console.log('responding with creds: ',creds)
              sendResponse(creds); // NOT JSON.stringify
          } else {
              sendResponse(null);
          }
        });
      } else {
        sendResponse(stored_credentials);
      }
      return true;
  } else if (request.action === 'get_user') {    
    let username_span = document.querySelector("#header-user-menu > article > ul > li:nth-child(1) > span");
    if (username_span) {
      sendResponse( username_span.innerHTML);
    } else {
      sendResponse({ data: null });
    }
  } else if (request.action === 'create_api_key') {

    let api_key = create_api_key();
    sendResponse( api_key );
  } else { sendResponse('no action'); }
});
console.log('listening');



