function resetStorageData() {
    'use strict';
    localStorage.setItem("isAuth", "false");
    localStorage.setItem("isRemember", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("passwd");
    localStorage.removeItem("driver-id");
    localStorage.removeItem("driver-status");
    localStorage.removeItem("isDriver");
    localStorage.removeItem("access_token");
    localStorage.removeItem("isEmailVerified");
    localStorage.removeItem("isMobileVerified");
    localStorage.removeItem("isStatusActive");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires");
    localStorage.removeItem("name");
    localStorage.removeItem("token_type");
    localStorage.removeItem("mobilenum");
    localStorage.removeItem("expires_in");
    if (window.map) {
        window.map.remove();
    }
}
function refreshAccessToken(callback) {
    'use strict';
    var authRefreshToken = localStorage.getItem('refresh_token'),
        TokenRefreshTime = 1798 * 1000,
        data = "grant_type=refresh_token&refresh_token=" + authRefreshToken + "&client_id=" + window.clientId,
        http = new XMLHttpRequest();
    if (localStorage.getItem('expires_in')) {
        TokenRefreshTime = (parseInt(localStorage.getItem('expires_in'), 10) - 1) * 1000;
    }
    http.open("POST", window.authServiceBase + 'oauth/token', true);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            var response = '';
            if (http.status === 200) {
                response = JSON.parse(http.responseText);
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('name', response.name);
                localStorage.setItem('refresh_token', response.refresh_token);
                localStorage.setItem("username", response.userName);
            	localStorage.setItem('expires_in',response.expires_in);
            	localStorage.setItem('token_expires',new Date(response['.expires']).getTime());
                if (callback && (typeof (callback) === "function")) {
                    callback();
                }
            } else {
                resetStorageData();
                window.location.href = "./login.html";
            }
        }
    };
    http.send(data);
    window.setTimeout(refreshAccessToken, TokenRefreshTime);
}
function redirectToHome () {
    window.location.href = "home.html#dashboard";
}
