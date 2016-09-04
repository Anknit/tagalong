function watchCodeSMS(){
    document.addEventListener("deviceready", function(){
    if(SMS){
        SMS.startWatch(function(){
           document.addEventListener('onSMSArrive',function(e){
               document.getElementById('code-input').value = e.data[0]['body'];
/*
               SMS.stopWatch(function(){
                   document.removeEventListener('onSMSArrive');
               },function(){});
*/
           });
        },function(){

        });
    }
    },true);
}

function resendCodeRequest(){
    var mobileNumber = localStorage.getItem("mobilenum");
    var userName = localStorage.getItem("username");
	var data = {CodeType:"PhoneCode",MobileNumber:mobileNumber,UserName:userName}; 

	var data1 = JSON.stringify(data);
	var http = new XMLHttpRequest();
	http.open("POST",authServiceBase+'api/accounts/sendcode',true);
	http.setRequestHeader("Content-Type","application/json");
	http.onreadystatechange=function(){
		if(http.readyState == 4){
            if(http.status==200){
               document.getElementById('code-input').value = '';
            }
            else{
                alert("Error in sending request for resend code");
            }
        }
	}
	http.send(data1);
}

function onActivationCode() {
    var verifyCode = document.getElementById('code-input').value;
    var mobileNumber = localStorage.getItem("mobilenum");
    var userName = localStorage.getItem("username");
    if(verifyCode == null || verifyCode == "" || verifyCode.length != 4) {
        alert("Please enter 4 digit code");
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
                window.location.href = "./verificationSuccess.html"
            }
            else{
                alert("Invalid Code");
            }
        }
	}
	http.send(data1);
}