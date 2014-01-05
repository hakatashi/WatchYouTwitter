function getToken() {
	chrome.storage.sync.get(["accessToken", "accessTokenSecret"], function(items){
		if (typeof items.accessToken == 'undefined' || typeof items.accessTokenSecret == 'undefined') {
			getRequestToken();
		} else {
			secretKey.accessToken = items.accessToken;
			secretKey.accessTokenSecret = items.accessTokenSecret;
		}
		console.log(secretKey);
	});
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (changeInfo.status === 'complete' && tab.url != undefined) {
		var url = $.url(tab.url);
		if (url.attr('host') === "www.google.co.jp") {
			postAPI("statuses/update", {
				status: "test",
			}, function(data, textStatus, jqXHR) {
				console.log(jqXHR);
			});
		}
	}
});

/*
chrome.runtime.onStartup.addListener(function() {
	getToken();
	console.log(secretKeys);
});
*/

getToken();
