$pin = $("#oauth_pin code");
if ($pin.length > 0) {
	chrome.runtime.sendMessage({PIN: $pin.text()}, function(responce) {
		console.log("get responce");
		if (responce.status == true) {
			$("#oauth_pin code").text('-------');
			$("#code-desc").text("Authentication has successfully completed. You don't have to enter PIN code!");
		}
	});
}
