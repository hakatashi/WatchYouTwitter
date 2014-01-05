// great contributions of http://blog.tomatomax.net/archives/2696 is noted.

var sendToThief;

function parseQuery(parameter) {
	var obj = new Object;
	var params = parameter.split('&');
	for (var i = 0; i < params.length; i++) {
		var param = params[i].split('=');
		obj[param[0]] = param[1];
	}
	return obj;
}

function getRequestToken() {
	var accessor = {
		consumerSecret: secretKey.consumerSecret,
		tokenSecret: ''
	}

	var message = {
		method: "POST",
		action: "https://api.twitter.com/oauth/request_token",
		parameters: {	
			oauth_signature_method: "HMAC-SHA1",
			oauth_consumer_key: secretKey.consumerKey
		}
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var target = OAuth.addToURL(message.action, message.parameters);
	
	var options = {
		datatype: 'json',
		type: message.method,
		url: target,
		success: function(data, textStatus) {
			oauthTokens = parseQuery(data);
			secretKey.oauthToken = oauthTokens.oauth_token;
			secretKey.oauthTokenSecret = oauthTokens.oauth_token_secret;
			getPIN();
		},
		error: function(jqXHR, textStatus) {
			console.log('getRequestToken error: ' + textStatus);
		},
		timeout: 10000
	}

	$.ajax(options);
}

function getPIN() {
	chrome.tabs.create({
		url: "https://api.twitter.com/oauth/authenticate?oauth_token=" + secretKey.oauthToken,
		active: true
	}, chrome.tabs.onUpdated.addListener(stealPIN));
}

function stealPIN(tabId, changeInfo, tab) {
	if (tab.url === 'https://api.twitter.com/oauth/authorize') {
		chrome.tabs.executeScript(tabId, {
			file: "third/jquery.js"
		}, function() {
			chrome.tabs.executeScript(tabId, {
				file: "thief.js"
			});
		});
		chrome.tabs.onUpdated.removeListener(stealPIN);
		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
			if (typeof message.PIN != 'undefined') {
				secretKey.PIN = message.PIN;
				console.log(message.PIN);
				getAccessToken();
				sendResponse({status: true});
			}
		});
	}
}

function getAccessToken() {
	var accessor = {
		consumerSecret: secretKey.consumerSecret,
		tokenSecret: secretKey.oauthTokenSecret
	};

	var message = {
		method: "GET",
		action: "https://api.twitter.com/oauth/access_token",
		parameters: {
			oauth_signature_method: "HMAC-SHA1",
			oauth_consumer_key: secretKey.consumerKey,
			oauth_token: secretKey.oauthToken,
			oauth_verifier: secretKey.PIN
		}
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var target = OAuth.addToURL(message.action, message.parameters);
	var options = {
		type: message.method,
		url: target,
		success: function(data, textStatus) {
			accessTokens = parseQuery(data);
			console.log(accessTokens);
			secretKey.accessToken = accessTokens.oauth_token;
			secretKey.accessTokenSecret = accessTokens.oauth_token_secret;
			chrome.storage.sync.set({
				"accessToken": secretKey.accessToken,
				"accessTokenSecret": secretKey.accessTokenSecret
			});
			console.log(secretKey);
		},
		error: function(jqXHR, textStatus) {
			console.log('getAccessToken error: ' + textStatus);
		},
		timeout: 10000
	}

	$.ajax(options);
}
