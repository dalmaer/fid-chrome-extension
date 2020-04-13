"use strict";

const errorCode = -1; // unable to get the value

//
// Extention Events
//
//chrome.runtime.onInstalled.addListener(function() {});

// When a tab is updated check to see if it is loaded and reset the icon UI
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (
    changeInfo.status == "complete" &&
    tab.url.startsWith("http") &&
    tab.active
  ) {
    chrome.tabs.executeScript({ file: "content.js" }, (result) => {
      // Catch errors such as "This page cannot be scripted due to an ExtensionsSettings policy."
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        console.log("Error: " + lastErr.message);

        chrome.browserAction.setIcon({ path: "icon-error.png" });
        clearBadge();

        let key = hashCode(tab.url);
        chrome.storage.local.set({
          [key]: {
            score: errorCode,
            url: tab.url,
            title: tab.title,
          },
        });
      }
    });
  }
});

// Fires when the active tab in a window changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  tryToUpdateIconUIFromStorage(activeInfo.tabId);
});

// If another window is focused, switch the badge to those results
// Ideally you could have different icons/badges per window
chrome.windows.onFocusChanged.addListener((windowId) => {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id > 0) {
      tryToUpdateIconUIFromStorage(tabs[0].id);
    }
  });
});

// message from content script, the FID will be in request.result
chrome.runtime.onMessage.addListener((request, sender, response) => {
  updateIconUI(request.result);

  if (sender.tab.url) {
    let key = hashCode(sender.tab.url);
    chrome.storage.local.set({
      [key]: {
        score: request.result,
        url: sender.tab.url,
        title: sender.tab.title,
      },
    });
  }
});

//
// Mess around with the Icon UI
//

// Given the fid as a number in milliseconds, update the Icon UI
function updateIconUI(fid) {
  let color = getColor(fid);

  chrome.browserAction.setIcon({ path: "icon-" + color + ".png" });
  chrome.browserAction.setBadgeText({ text: badgeTextFromScore(fid) });
  chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

// load up the most recent result for this tab and update the IconUI
function tryToUpdateIconUIFromStorage(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url) {
      let key = hashCode(tab.url);
      chrome.storage.local.get(key, (result) => {
        if (result[key] && result[key].score == errorCode) {
          chrome.browserAction.setIcon({ path: "icon-error.png" });
          clearBadge();
        } else if (result[key] && result[key].score) {
          updateIconUI(result[key].score);
        } else {
          resetIconUI();
        }
      });
    }
  });
}

// Reset the UI to the base icon
function resetIconUI() {
  chrome.browserAction.setIcon({ path: "icon-on.png" });
  clearBadge();
}

function clearBadge() {
  chrome.browserAction.setBadgeText({ text: "" });
}

//
// Helper Functions
//

// Given the FID score in, return an appropriate sized label for the icon's badge
function badgeTextFromScore(score) {
  return score > 9999 ? "BAD" : score.toString();
}

// Given the FID in ms, return green, yellow, or red depending on the amount
function getColor(fid) {
  let color = "red";

  // GREEN < 100 milliseconds, YELLOW < 300ms, RED > 300ms
  if (fid < 100) {
    color = "green";
  } else if (fid < 300) {
    color = "yellow";
  }

  return color;
}

// Hash the URL and return a numeric hash as a String to be used as the key
function hashCode(str) {
  let hash = 0;
  if (str.length == 0) {
    return "";
  }
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}
