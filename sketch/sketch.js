//locally saved and updated data that is used to update chrome.storage.sync
var savedData = [];

//setup on running the extension
function setup() {
  noCanvas();

  function getUserInfo() {
    chrome.storage.sync.get('myKey', function (obj) {
      savedData = obj.myKey;
      for (var i = 0; i < savedData.length; i++) {
        var parse = JSON.parse(savedData[i]);
        addParagraph(parse.title, parse.url, i);
      } //forloop
    }); //storage.sync.get
  } //getUserInfo
  getUserInfo();
}; //setup

//format and ship the new bookmark p tag
function addParagraph(title, url, i) {
  //create all elements
  var paraHolder = document.createElement('div');
  var loadParagraph = document.createElement('p');
  var hiddenURL = document.createElement('input');
  var hiddenTitle = document.createElement('input');
  var titleHolder = document.createElement('div');
  var loadTitle = document.createTextNode(title);
  var paraBreak = document.createElement('br');
  var removeButton = document.createElement('button');
  var linkButton = document.createElement('button');

  //create unique ID's for necessary elements
  var titleID = "title" + i;
  var paraID = "paragraph" + i;
  var createDeleteID = "delete" + i;
  var createLinkID = "link" + i;

  //set attributes of elements created above
    //titleHolder
  titleHolder.setAttribute("class", titleID);
  titleHolder.setAttribute("value", loadTitle);
    //hiddenURL
  hiddenURL.setAttribute("value", url);
  hiddenURL.setAttribute("class", "input");
  hiddenURL.setAttribute("type", "hidden");
    //hiddenTitle
  hiddenTitle.setAttribute("value", title);
  hiddenTitle.setAttribute("class", "title");
  hiddenTitle.setAttribute("type", "hidden");
    //paraHolder
  paraHolder.setAttribute("id", paraID);
  paraHolder.setAttribute("class", "para-container")
    //removeButton
  removeButton.setAttribute("data-array", i);
  removeButton.setAttribute("class", "removeButton");
  removeButton.setAttribute("id", createDeleteID);
    //linkButton
  linkButton.setAttribute("class", "linkButton");
  linkButton.setAttribute("id", createLinkID);

  //creating the organized p tag through appendChild chains
  titleHolder.appendChild(loadTitle);
  loadParagraph.appendChild(titleHolder);
  loadParagraph.appendChild(removeButton);
  loadParagraph.appendChild(linkButton);
  loadParagraph.appendChild(hiddenURL);
  loadParagraph.appendChild(hiddenTitle);
  paraHolder.appendChild(loadParagraph);

  //append the final p tag to the body
  document.body.appendChild(paraHolder);
  document.body.appendChild(paraBreak);

  //delete a p tag
  document.getElementById(createDeleteID).addEventListener('click', function() {
    savedData.splice(this.dataset.array, 1);
    var key = "myKey";
    var jsonfile = {};
    jsonfile[key] = savedData;
    chrome.storage.sync.set(jsonfile, function () {
    }); //chrome.storage.sync.set
    chrome.runtime.reload();
  }); //addEventListener click function on createDeleteID

  //post data from a p tag to the add bookmark modal
  document.getElementById(createLinkID).addEventListener('click', function(e) {
    var urlInput = e.target.nextSibling;
    var titleInput = urlInput.nextSibling;
    var urlData = urlInput.value;
    var titleData = titleInput.value;
    let sendData = {
      title: urlData,
      url: titleData
    };

    chrome.tabs.query({
      active:true,windowType:"normal", currentWindow: true},
      function(d, currentTab){
        var currentTab = (d[0].id);
        chrome.tabs.sendMessage(currentTab, sendData);
    });

    savedData.splice(this.dataset.array, 1);
    var key = "myKey";
    var jsonfile = {};
    jsonfile[key] = savedData;
    chrome.storage.sync.set(jsonfile, function () {

    }); //chrome.storage.sync.set

    setImmediate(() => chrome.runtime.reload());
  }); //addEventListener click function on createLinkID
}; //addParagraph

//post a new p tag/store a new bookmark
document.getElementById("get-url").addEventListener("click", function update(){
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    var tabTitle = tab.title;
    var tabURL = tab.url;

    addParagraph(tabTitle, tabURL, savedData.length);

    function storeTabInfo() {
      var key = "myKey",
      tabInfo = JSON.stringify({
        'url': tabURL,
        'title': tabTitle
      }); //stringify
      savedData.push(tabInfo);

      var jsonfile = {};
      jsonfile[key] = savedData;
      chrome.storage.sync.set(jsonfile, function (err) {
        if (err) {
          console.error(err);
        }; //if (err)
      }); //chrome.storage.sync.set
    } //storeTabInfo
    storeTabInfo();
  }); //chrome.tabs.query
}); //addEventListener (click)
