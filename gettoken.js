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
			console.log(data);
		},
		error: function(jqXHR, textStatus) {
			console.log(textStatus);
		},
		timeout: 30000
	}

	$.ajax(options);
}
