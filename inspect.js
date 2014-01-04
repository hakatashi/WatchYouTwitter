function getToken(key) {
	chrome.storage.sync.get(key, function(items){
		if (typeof items.accessToken == 'undefined' || typeof items.accessTokenSecret == 'undefined') {
			getRequestToken();
		}
	});
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (changeInfo.status === 'complete' && tab.url != undefined) {
		var url = $.url(tab.url);
		if (url.attr('host') === "www.google.co.jp") {
			getToken("accessToken", "accessTokenSecret");
		}
	}
});

