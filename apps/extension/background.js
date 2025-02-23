chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.repo) {
      chrome.tabs.create({ url: `https://www.buildstack.online/home?from=extension&repo=${message.repo}&owner=${message.owner}` });
    }
  });