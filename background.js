browser.commands.onCommand.addListener((command) => {
  console.log("Command received:", command); // Debugging
  switch (command) {
    case "copy-all-tabs":
      copyAllTabs();
      break;
    case "paste-urls":
      pasteURLs();
      break;
    default:
      console.warn("Unknown command:", command); // Debugging
  }
});
// Listen for messages from the popup or other parts of the extension
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message); // Debugging
  switch (message.action) {
    case "copy-all-tabs":
      console.log("Handling copy-all-tabs action"); // Debugging
      copyAllTabs()
        .then(() => {
          sendResponse({ success: true }); // Send a response back to the popup
          window.close();
        })
        .catch((error) => {
          console.error("Error copying tabs:", error); // Debugging
          sendResponse({ success: false, error: error.message });
          window.close();
        });
      break;

    case "paste-urls":
      console.log("Handling paste-urls action"); // Debugging
      pasteURLs()
        .then(() => {
          sendResponse({ success: true }); // Send a response back to the popup
          window.close();
        })
        .catch((error) => {
          console.error("Error pasting URLs:", error); // Debugging
          sendResponse({ success: false, error: error.message });
          window.close();
        });
      break;

    case "reverse-paste-urls":
      console.log("Handling reverse-paste-urls action"); // Debugging
      pasteURLs(true)
        .then(() => {
          sendResponse({ success: true }); // Send a response back to the popup
          window.close();
        })
        .catch((error) => {
          console.error("Error pasting URLs in reverse:", error); // Debugging
          sendResponse({ success: false, error: error.message });
          window.close();
        });
      break;

    case "random-single-url":
      console.log("Handling random-single-url action"); // Debugging
      pasteRandomSingleURL()
        .then(() => {
          sendResponse({ success: true }); // Send a response back to the popup
          window.close();
        })
        .catch((error) => {
          console.error("Error pasting random single URL:", error); // Debugging
          sendResponse({ success: false, error: error.message });
          window.close();
        });
      break;

    case "random-all-urls":
      console.log("Handling random-all-urls action"); // Debugging
      pasteRandomAllURLs()
        .then(() => {
          sendResponse({ success: true }); // Send a response back to the popup
          window.close();
        })
        .catch((error) => {
          console.error("Error pasting all URLs in random order:", error); // Debugging
          sendResponse({ success: false, error: error.message });
          window.close();
        });
      break;

    default:
      console.warn("Unknown action:", message.action); // Debugging
      sendResponse({ success: false, error: "Unknown action" });
      break;
  }
  return true; // Required to use sendResponse asynchronously
});
// Copy all tabs
async function copyAllTabs() {
  console.log("Copying all tabs..."); // Debugging
  try {
    const tabs = await browser.tabs.query({ currentWindow: true });
    console.log("Tabs found:", tabs); // Debugging

    const data = readSettingsFromLocalStorage();
    const format = data.formatCopy ? data.formatText : "$url\n";

    console.log("Using format:", format); // Debugging

    const text = tabs
      .map((tab) =>
        format.replace("$url", tab.url).replace("$title", tab.title)
      )
      .join("");
    console.log("Text to copy:", text); // Debugging

    // Use the clipboard API
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard successfully"); // Debugging
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error); // Debugging
    throw error; // Propagate the error
  }
}

// Paste URLs
function pasteURLs(reverse = false) {
  navigator.clipboard.readText().then((text) => {
    const data = readSettingsFromLocalStorage();
    const urls = extractURLs(text, data.smartPast);
    if (reverse) urls.reverse();
    urls.forEach((url) => browser.tabs.create({ url }));
  });
}

// Paste a random single URL
function pasteRandomSingleURL() {
  navigator.clipboard.readText().then((text) => {
    const data = readSettingsFromLocalStorage();
    const urls = extractURLs(text, data.smartPast);
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    if (randomUrl) browser.tabs.create({ url: randomUrl });
  });
}

function pasteRandomAllURLs() {
  navigator.clipboard.readText().then((text) => {
    const data = readSettingsFromLocalStorage();
    let urls = extractURLs(text, data.smartPast);
    urls = shuffleArray(urls);
    urls.forEach((url) => browser.tabs.create({ url }));
  });
}

// Extract URLs from text
function extractURLs(text, smartPast) {
  const urlRegex =
    /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»""'']))/gi;
  return smartPast
    ? text.match(urlRegex) || []
    : text.split("\n").filter((line) => line.trim());
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function readSettingsFromLocalStorage() {
  const settingsString = localStorage.getItem("settings");
  if (settingsString) {
    return JSON.parse(settingsString);
  } else {
    const defaultSettings = {
      smartPast: false,
      formatCopy: false,
      formatText: "",
    };
    writeSettingsToLocalStorage(defaultSettings);
    return defaultSettings;
  }
}
