function postAPI(dest, parameters, callback) {
	var accessor = {
		consumerSecret: secretKey.consumerSecret,
		tokenSecret: secretKey.accessTokenSecret
	};

	var message = {
		method: "POST",
		action: APIBase + dest + '.json',
		parameters: {
			oauth_signature_method: "HMAC-SHA1",
			oauth_consumer_key: secretKey.consumerKey,
			oauth_token: secretKey.accessToken
		}
	};

	for (var key in parameters) {
		message.parameters[key] = parameters[key];
	}
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var options = {
		type: message.method,
		url: message.action,
		data: message.parameters,
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			callback(data, textStatus, jqXHR);
		},
		error: function(jqXHR) {
			console.log(jqXHR);
			onError();
		}
	};

	console.log(message);
	$.ajax(options);
}

function getAPI(dest, parameters, callback) {
	var accessor = {
		consumerSecret: secretKey.consumerSecret,
		tokenSecret: secretKey.accessTokenSecret
	};

	var message = {
		method: "GET",
		action: APIBase + dest + '.json',
		parameters: {
			oauth_signature_method: "HMAC-SHA1",
			oauth_consumer_key: secretKey.consumerKey,
			oauth_token: secretKey.accessToken,
			oauth_version: "1.0"
		}
	};

	for (var key in parameters) {
		message.parameters[key] = parameters[key];
	}
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var target = OAuth.addToURL(message.action, message.parameters);
	var options = {
		type: message.method,
		url: target,
		dataType: 'json',
		success: function(data, textStatus) {
			callback(data, textStatus);
		}
	};

	$.ajax(options);
}

function onError() {
	// chrome.storage.sync.remove(["accessToken", "accessTokenSecret"]);
}
