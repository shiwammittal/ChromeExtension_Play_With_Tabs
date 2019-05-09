var storeTabsInActiveWindow =[];
var storedTabs = [];

var currentWindowOpen;

chrome.browserAction.onClicked.addListener(function(tab) { 
     
    if(storedTabs.length == 0){

        chrome.tabs.query({active: true,lastFocusedWindow: true}, function(activeTab) {
            currentWindowOpen = activeTab;
        });


        chrome.windows.getAll({populate:true},function(windows){
     
            var currentTab = [];
            var tabsInCurrentWindow =[];
            var currentWindow = false;
    
        Object.keys(windows).forEach(function(windowId){
            var window = windows[windowId];
            var currentWindowTabs = window.tabs;

            if(window.id == currentWindowOpen[0].windowId){
                storeTabsInActiveWindow = currentWindowTabs;
            }
        });
          
        var tabIdsToRemove =[];

        Object.keys(storeTabsInActiveWindow).forEach(function(id){
            var tab = storeTabsInActiveWindow[id];
            storedTabs.push(tab);
            tabIdsToRemove.push(tab.id);
        });
        
        chrome.storage.local.set({list:storedTabs}, function() {
        });

        chrome.tabs.create({ url: "https://www.google.com/" });
        chrome.browserAction.setBadgeBackgroundColor({ color: [122, 186, 122, 255] });
    
        Object.keys(tabIdsToRemove).forEach(function(id){
            var tabId = tabIdsToRemove[id];
            chrome.tabs.remove(tabId);
        });
    });
    }
    else{
        chrome.storage.local.get(null, function (callback) {
            storedTabs = callback.list;
            Object.keys(storedTabs).forEach(function(id){  
            var tab = storedTabs[id];
            chrome.tabs.create({ url: tab.url });
        });
            storedTabs = [];
        });  
    }
});
