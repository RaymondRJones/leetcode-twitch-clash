document.addEventListener('click', function(event) {
  // Check if the clicked element is the submit button
  if (event.target.closest('button[data-e2e-locator="console-submit-button"]')) {
    console.log('Submit button clicked');

    // Wait 5 seconds to check the result
    setTimeout(() => {
      // Select the element containing the submission result
      const resultElement = document.querySelector('span[data-e2e-locator="submission-result"]');

      // Check if the result is "Accepted"
      if (resultElement && resultElement.textContent.includes("Accepted")) {
        console.log('Submission Accepted');

        // Send a message to the background script or directly to the server
        // This example sends to the background script
        chrome.runtime.sendMessage({type: "SUBMISSION_ACCEPTED"});
      } else {
        console.log('Submission result not yet available or not accepted');
      }
    }, 5000);
  }
});
