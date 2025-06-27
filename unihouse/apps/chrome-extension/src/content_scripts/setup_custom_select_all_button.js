async function waitForLoadingToStart(body, timeout = 3000) {
    const start = Date.now();
    while (!body.classList.contains('loading')) {
        if (Date.now() - start > timeout) {
            return false;  // signal that loading didn't start
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return true;  // loading started
}


async function waitForLoadingToEnd(body) {
    // Wait until loading ends
    while (body.classList.contains('loading')) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function select_all_group_booking() {
    let list = [];
    let prevLength = -1;
    let body = document.querySelector('body');

    let button = document.querySelector('.uga-btn-selectall')
    let tmp = getComputedStyle(button).color;
    button.classList.toggle('loading');
    button.style.color = getComputedStyle(button).backgroundColor;
    button.setAttribute("aria-busy","true");

    while (true) {
        list = document.querySelectorAll("tbody.clickable > tr > td.tick-cell > div");

        // Exit if length hasn't changed
        if (list.length === prevLength) break;
        prevLength = list.length;

        // Scroll last visible row into view
        list[list.length - 1].scrollIntoView({ behavior: 'smooth', block: 'end' });

        // Wait for loading to start and finish
        await waitForLoadingToStart(body);
        await waitForLoadingToEnd(body);
    }

    // Click all divs
    for (let div of list) {
        div.click();
    }

    button.classList.toggle('loading');
    button.style.color = tmp;
    button.removeAttribute('aria-busy');
    
}

/**
 * Looks for div.button-bar for timeout (ms). Throw error if timeout
 * @param {number} timeout 
 * @returns 
 */
function waitForButtonBar(timeout = 10000) {
  return new Promise((resolve, reject) => {
    // Check if it already exists
    const existing = document.querySelector('article > div > div.section-container > div > div > div > div.button-bar');
    if (existing) {
      resolve(existing);
      return;
    }

    // Set up a mutation observer
    const observer = new MutationObserver((mutations, obs) => {
      const found = document.querySelector('article > div > div.section-container > div > div > div > div.button-bar');
      if (found) {
        obs.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Optional: timeout to avoid hanging forever
    setTimeout(() => {
      observer.disconnect();
      reject(new Error('button-bar not found within timeout'));
    }, timeout);
  });
}

/**
 * Adds the Toggle All button to the button bar on the conference Group - Bookings page.
 * @param {*} buttonBar 
 */
function create_select_all_button(buttonBar) {
    
    if (buttonBar !== null) {
        const button = document.createElement('button');

        button.setAttribute('title', 'Toggle All');
        button.setAttribute('type', 'button');
        
        button.setAttribute('class', 'sr_button_primary sr_button uga-btn-selectall');
        button.style = "margin: 0 5px;";
        button.onclick = function() { select_all_group_booking() };
        button.innerText = "UGA Toggle All"

        // Optionally, append it to the DOM
        document.body.appendChild(button);

        buttonBar.prepend(button);
    }
}

waitForButtonBar()
    .then(buttonBar => {
        create_select_all_button(buttonBar);
    });

