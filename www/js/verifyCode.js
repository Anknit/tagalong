(function onInit() {
    var mobileNum = localStorage.getItem("mobilenum");
    if (mobileNum && typeof mobileNum !== "undefined") {
        document.getElementById('mobile-num').value = mobileNum;
    }
}());

function getActivationCode(){
    var mobileNumber = document.getElementById('mobile-num').value;
    localStorage.setItem('mobilenum', mobileNumber);
    var userName = localStorage.getItem("username");
	var data = {CodeType:"PhoneCode",MobileNumber:mobileNumber,UserName:userName}; 
	var data1 = JSON.stringify(data);
	var http = new XMLHttpRequest();
	http.open("POST",authServiceBase+'api/accounts/getcode',true);
	http.setRequestHeader("Content-Type","application/json");
	http.onreadystatechange=function(){
		if(http.readyState == 4){
            if(http.status==200){
                document.getElementById('code-input').value = '';
                document.getElementById('verify-code-container').style.display = 'block';
            }
            else{
                alert("Error in getting verification code");
            }
        }
	}
	http.send(data1);
}

function onActivationCode() {
    var verifyCode = document.getElementById('code-input').value;
    var mobileNumber = localStorage.getItem("mobilenum");
    var userName = localStorage.getItem("username");
    if(verifyCode == null || verifyCode == "" || verifyCode.length != 6) {
        alert("Please enter 6 digit code");
        return false;
    }
	var data = {Code:"",MobileNumber:mobileNumber,UserName:userName}; 
	data.Code = verifyCode;

	var data1 = JSON.stringify(data);
	var http = new XMLHttpRequest();
	http.open("POST",authServiceBase+'api/accounts/verifycode',true);
	http.setRequestHeader("Content-Type","application/json");
	http.onreadystatechange=function(){
		if(http.readyState == 4){
            if(http.status==200){
                localStorage.setItem('isMobileVerified', "true");
                window.location.href = "./home.html"
            }
            else{
                alert("Invalid Code");
            }
        }
	}
	http.send(data1);
}