chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SUBMISSION_ACCEPTED") {
    // Send request to server to update status
    // This could be done in a background script or directly from a React component if preferred
    console.log("SENDING TO SERVER");
  }
});


