function onLogout() {
	localStorage.setItem("isAuth","false");
	localStorage.removeItem("username");
	localStorage.removeItem("passwd");
	window.location.href = "./index.html"
}
