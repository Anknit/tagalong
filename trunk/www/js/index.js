function onInit(){
    var isAuth = localStorage.getItem("isAuth");
    if(typeof isAuth == "undefined"){
        window.location.href = "./signup.html"
        return true;
    }
    if(isAuth == "true"){
        window.location.href = "./home.html"
    }
    else {
        window.location.href = "./login.html"
    }
}