function onSignUp() {
    'use strict';
    var data1, http, loginData,
        firstname = document.forms.signupForm["sign-fname"].value.trim(),
        lastname = document.forms.signupForm["sign-lname"].value.trim(),
        username = document.forms.signupForm["sign-uname"].value.trim(),
        passwd = document.forms.signupForm["sign-pswd"].value.trim(),
        mobilenum = document.forms.signupForm["sign-num"].value.trim(),
        data = {ClientId: window.clientId};
    if (firstname === null || firstname === "") {
        window.alert("First name cannot be blank");
        return false;
    }
    if (username === null || username === "") {
        window.alert("Username cannot be blank");
        return false;
    }
    if (passwd === null || passwd === "") {
        window.alert("Password cannot be blank");
        return false;
    }
    if (passwd.length < 8) {
        window.alert("Password must contain at least 8 characters");
        return false;
    }
	if (passwd.length > 20) {
        window.alert("Password length cannot exceed 20 characters");
        return false;
	}
    document.getElementsByClassName('loading-blocker')[0].style.display = 'block';
	data.FirstName = firstname;
	data.LastName = lastname;
	data.UserName = username;
	data.Password = passwd;
	data.Email = username;
	data.MobileNumber = '+91' + mobilenum;

	data1 = JSON.stringify(data);
	http = new XMLHttpRequest();
	http.open("POST", window.authServiceBase + 'api/accounts/create', true);
	http.setRequestHeader("Content-Type", "application/json");
	http.onreadystatechange = function () {
		if (http.readyState === 4) {
            if (http.status === 201) {
                localStorage.setItem("username", username);
                localStorage.setItem("passwd", passwd);
                localStorage.setItem("mobilenum", data.MobileNumber);
                loginData = "grant_type=password&username=" + username + "&password=" + passwd + "&client_id=" + window.clientId;
                http = new XMLHttpRequest();
                http.open("POST", window.authServiceBase + 'oauth/token', true);
                http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                http.onreadystatechange = function () {
                    var response;
                    if (http.readyState === 4) {
                        document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
                        if (http.status === 200) {
                            response = JSON.parse(http.responseText);
                            localStorage.setItem('access_token', response.access_token);
                            localStorage.setItem('name', response.name);
                            localStorage.setItem('token_type', response.token_type);
                            localStorage.setItem('refresh_token', response.refresh_token);
                            localStorage.setItem('expires_in', response.expires_in);
                            localStorage.setItem('token_expires', new Date(response['.expires']).getTime());
                            localStorage.setItem("isAuth", true);
                            localStorage.setItem("isRemember", true);
                            window.location.href = "./verifyCode.html";
                        } else if (http.status === 400) {
                            response = JSON.parse(http.responseText);
                            window.alert(response.error_description);
                        } else {
                            window.alert('Please check your network connection');
                        }
                    }
                };
                http.send(loginData);
                window.location.href = "./verifyCode.html";
            } else if (http.status === 400) {
                document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
                var response = JSON.parse(http.responseText);
                window.alert(response.modelState[""][0]);
            } else {
                document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
                window.alert('Please check your network connection');
            }
		}
	};
	http.send(data1);
}

function togglePasswordVisiblity() {
    'use strict';
    var unHideCheckbox = document.getElementById('unhide-pswd'),
        passwordField = document.getElementById('sign-pswd');
    if (unHideCheckbox.checked) {
        passwordField.setAttribute('type', 'text');
    } else {
        passwordField.setAttribute('type', 'password');
    }
}
function onInit() {
    'use strict';
    var isAuth = localStorage.getItem("isAuth");
    if (isAuth === "true") {
        window.location.href = "./home.html";
    }
}
