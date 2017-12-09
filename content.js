console.log("Chrome Extension ready to go?");

chrome.runtime.onMessage.addListener(postData);

function postData(request, sender, sendResponse) {
  console.log(request);
  let titleElement = document.getElementById('title');
  let urlElement = document.getElementById('link');
  console.log("function postData ran!");

  titleElement.value = request.title;
  urlElement.value = request.url;
  const event = new Event('input', { bubbles: true});
  titleElement.dispatchEvent(event);
  urlElement.dispatchEvent(event);
};
