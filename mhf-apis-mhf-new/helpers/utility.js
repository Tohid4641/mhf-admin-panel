exports.randomNumber = function (length) {
	var text = "";
	var possible = "123456789";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup == i ? "0" : possible.charAt(sup);
	}
	return Number(text);
};

exports.otpLink = function (mobileNo, otp) {
	var apikey = '';
	var url = 'http://api.leoraadigital.com/SMS_API/sendsms.php?apikey='+apikey+'&mobile='+mobileNo+'&message=Dezen Tech welcomes you ... Ur One time password is '+otp+' - Dezen Tech&sendername=DEZENT&routetype=1';
	return url;
};

