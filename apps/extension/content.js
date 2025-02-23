
(function () {
    function addButton() {
      // Check if already added
      if (document.getElementById("redirectButton")) return;
  
      // Find GitHub's repository action buttons container
      const actionBar = document.querySelector("ul.pagehead-actions");
      if (!actionBar) return; // Ensure the action bar exists
  
      // Create the button
      const button = document.createElement("button");
      button.id = "redirectButton";
     // button.innerText = "Go to External Site";
     // Inject Google Font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=K2D:wght@100;200;300;400;500;600;700;800&display=swap";
document.head.appendChild(fontLink);

button.style.cssText = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-left: 8px;
  padding: 5px 10px;
  background: linear-gradient(135deg, #6e5494, #2b3137);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  font-family: 'K2D', sans-serif;
  box-shadow: 4px 4px 0px #444f5a, 5px 5px 5px rgba(0, 0, 0, 0.5);
  transform: translate(0, 0);
  transition: all 0.1s ease-in-out;
  outline: none;
  border: 1px solid #3d4450;
  text-transform: none;
  letter-spacing: 1px;
  min-width: 170px;
  max-height: 52px;
  position: relative;
  overflow: hidden;
`;

// Add hover effect
button.addEventListener("mouseenter", () => {
  button.style.boxShadow = "2px 2px 0px #444f5a, 3px 3px 5px rgba(0, 0, 0, 0.5)";
  button.style.transform = "translate(2px, 2px)";
});

button.addEventListener("mouseleave", () => {
  button.style.boxShadow = "4px 4px 0px #444f5a, 5px 5px 5px rgba(0, 0, 0, 0.5)";
  button.style.transform = "translate(0, 0)";
});


// Create the image (logo)
const img = document.createElement("img");
img.src = chrome.runtime.getURL("mayflower-ship.png");
img.style.cssText = `
 
  width: 16px;
  height: 16px;
  object-fit: contain;
  filter: brightness(90%);
`;

// Create the text
const text = document.createElement("span");
text.innerText = "Open in BuildStack";
text.style.cssText = `
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
`;

     
     // Append logo + text to button
     button.appendChild(img);
     button.appendChild(text);
    // Get the repo name from GitHub URL
function getRepoName() {
  const pathParts = window.location.pathname.split("/");
  return pathParts.length >= 3 ? `${pathParts[2]}` : null;
}
function getRepoOwner() {
  const pathParts = window.location.pathname.split("/");
  return pathParts.length >= 3 ? `${pathParts[1]}` : null;
}
      // Button Click Event
button.addEventListener("click", () => {
  const repoName = getRepoName();
  const repoOwner=getRepoOwner();
  if (repoName) {
    const encodedRepo = encodeURIComponent(repoName);
    const encodedRepoOwner = encodeURIComponent(repoOwner);
    chrome.runtime.sendMessage({ repo: encodedRepo, owner:repoOwner });
  }
});
  
      // Append button next to "Star" button
      actionBar.appendChild(button);
    }
  
    function waitForElement(selector, callback) {
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          callback(element);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Call addButton only when actionBar exists
    waitForElement("ul.pagehead-actions", addButton);
  
    // Re-add after GitHub navigation changes (PJAX support)
    document.addEventListener("pjax:end", addButton);
    window.addEventListener("popstate", addButton);
  })();
  