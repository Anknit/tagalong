function onLogin() {
    var username = document.forms["loginForm"]["username"].value.trim();
    if (username == null || username == ""){
        alert("Username cannot be blank");
        return false;
    }
	var passwd = document.forms["loginForm"]["passwd"].value.trim();
    if( passwd == null || passwd == ""){
        alert("Password cannot be blank");
        return false;
    }
    document.getElementsByClassName('loading-blocker')[0].style.display = 'block';
	var data = "grant_type=password&username=" + username + "&password=" + passwd + "&client_id=" + clientId;
	var http = new XMLHttpRequest(); 
	http.open("POST",authServiceBase+'oauth/token',true);
	http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	http.onreadystatechange=function(){
		if(http.readyState == 4){
            if(http.status==200){
            	var response = JSON.parse(http.responseText);
            	localStorage.setItem('access_token',response.access_token);
            	localStorage.setItem('name',response.name);
            	localStorage.setItem('token_type',response.token_type);
            	localStorage.setItem('refresh_token',response.refresh_token);
            	localStorage.setItem('expires_in',response.expires_in);
            	localStorage.setItem('token_expires',new Date(response['.expires']).getTime());
                localStorage.setItem("username",response.userName);
                localStorage.setItem("passwd",passwd);
                localStorage.setItem("isAuth", true);
                localStorage.setItem("isRemember", true);
                document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
                window.location.href = "./home.html";
            }
            else if(http.status == 400){
            	var response = JSON.parse(http.responseText);
                document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
            	alert(response.error_description);
            }
            else{
                document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
            	alert('Please check your network connection');
            }
		}
	}
	http.send(data);
}
function onInit(){
    var isAuth = localStorage.getItem("isAuth");
    var locationPath = '';
    if(typeof isAuth == "undefined"){
        locationPath = "./signup.html";
    }
    else if(isAuth == "true"){
        locationPath = "./home.html";
    }
    if(locationPath != ''){
        window.location.href = locationPath;
    }
}