document.getElementById("copy-all-tabs").addEventListener("click", () => {
  console.log("Copy All Tabs button clicked"); // Debugging
  browser.runtime
    .sendMessage({ action: "copy-all-tabs" })
    .then((response) => {
      console.log("Message sent successfully", response); // Debugging
    })
    .catch((error) => {
      console.error("Error sending message:", error); // Debugging
    });
});

document.getElementById("paste-urls").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "paste-urls" });
});

document.getElementById("reverse-paste-urls").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "reverse-paste-urls" });
});

document.getElementById("random-single-url").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "random-single-url" });
});

document.getElementById("random-all-urls").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "random-all-urls" });
});
