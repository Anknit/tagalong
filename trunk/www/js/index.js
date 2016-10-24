function onInit() {
    'use strict';
    debugger;
    var tokenExpiry,
        remainingTokenValidity,
        isAuth = localStorage.getItem("isAuth");
    if (typeof isAuth === "undefined") {
        window.location.href = "./signup.html";
        return true;
    } else if (isAuth === "true") {
        window.refreshAccessToken(window.redirectToHome);
    } else {
        window.location.href = "./login.html";
    }
}