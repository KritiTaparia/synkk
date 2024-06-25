function getAllTabUrls(callback) {
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    const urls = tabs.map(tab => tab.url);
    callback(urls);
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'getAllTabUrls') {
    getAllTabUrls(function(urls) {
      sendResponse({ urls: urls });
    });
    return true; // Indicates asynchronous response
  }
});
