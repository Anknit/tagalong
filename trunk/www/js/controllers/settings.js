var settingsCtrl = function ($scope) {
    'use strict';
    $scope.logout = function () {
        localStorage.setItem("isAuth", "false");
        localStorage.setItem("isRemember", "false");
        localStorage.removeItem("username");
        localStorage.removeItem("passwd");
        window.location.href = "./index.html";
    };
    $scope.settingsPushNotification = (localStorage.getItem('settingsPN') !== "false");
    $scope.settingsAppNotification = (localStorage.getItem('settingsAN') !== "false");
    $scope.settingsSound = (localStorage.getItem('settingsSound') !== "false");
    $scope.settingsVibrate = (localStorage.getItem('settingsVibrate') !== "false");
    $scope.settingsLocationAccess = (localStorage.getItem('settingsLocation') !== "false");
    $scope.settingsCameraAccess = (localStorage.getItem('settingsCamera') !== "false");
    $scope.settingsProfilePicture = (localStorage.getItem('settingsProfilePicture') !== "false");
    $scope.toggleSetting = function (index) {
        switch (index) {
        case 1:
            localStorage.setItem("settingsPN", $scope.settingsPushNotification);
            break;
        case 2:
            localStorage.setItem("settingsAN", $scope.settingsAppNotification);
            break;
        case 3:
            localStorage.setItem("settingsSound", $scope.settingsSound);
            break;
        case 4:
            localStorage.setItem("settingsVibrate", $scope.settingsVibrate);
            break;
        case 5:
            localStorage.setItem("settingsLocation", $scope.settingsLocationAccess);
            break;
        case 6:
            localStorage.setItem("settingsCamera", $scope.settingsCameraAccess);
            break;
        case 7:
            localStorage.setItem("settingsProfilePicture", $scope.settingsProfilePicture);
            break;
        }
    };
};