/**
 * 设置icon状态
 * @param {*} tabId 
 */
function setIconStatus(tabId) {

  var badgeText = "";
  var badgeColor = [255, 255, 255, 255];
  var iconPath = {
    '48': 'icon/icon48b.png',
    '128': 'icon/icon128b.png'
  };
  if (GLOBAL.blockTabs[tabId] &&
    GLOBAL.blockTabs[tabId].length !== 0) {
    badgeText = GLOBAL.blockTabs[tabId].length.toString();
    badgeColor = [255, 0, 0, 255];
    iconPath = {
      '48': 'icon/icon48.png',
      '128': 'icon/icon128.png'
    };
  }
  chrome.tabs.get(tabId, function(tab) {
    if (typeof tab !== 'undefined') {
      chrome.browserAction.setBadgeText({
        text: badgeText,
        tabId: tabId
      });
      chrome.browserAction.setBadgeBackgroundColor({
        color: badgeColor,
        tabId: tabId
      });
      chrome.browserAction.setIcon({
        'path': iconPath,
        tabId: tabId
      });
    }
  });
}

/**
 * 标签激活
 * @param {*} activeInfo 
 */
function tabActived(activeInfo) {
  setIconStatus(activeInfo.tabId);
}

/**
 * 标签关闭
 * @param {*} tabId 
 * @param {*} removeInfo 
 */
function tabRemoved(tabId, removeInfo) {
  if (GLOBAL.blockTabs[tabId]) {
    delete GLOBAL.blockTabs.tabId;
  }
  if (GLOBAL.fingerPrints[tabId]) {
    delete GLOBAL.fingerPrints[tabId];
  }
}

/**
 * 标签重载
 * @param {*} details 
 */
function beforeNavigate(details) {
  if (details.frameId == 0) {
    if (GLOBAL.blockTabs[details.tabId]) {
      delete GLOBAL.blockTabs[details.tabId];
    }
    if (GLOBAL.fingerPrints[details.tabId]) {
      delete GLOBAL.fingerPrints[details.tabId];
    }
  }
  setIconStatus(details.tabId);
}

chrome.tabs.onRemoved.addListener(tabRemoved);
chrome.tabs.onActivated.addListener(tabActived);
chrome.webNavigation.onBeforeNavigate.addListener(beforeNavigate);