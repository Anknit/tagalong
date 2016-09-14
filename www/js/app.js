/*global angular*/
(function onInit() {
    'use strict';
    var locationPath, isAuth = localStorage.getItem("isAuth");
    if (typeof isAuth === "undefined") {
        locationPath = "./signup.html";
    } else if (isAuth === "true") {
        locationPath = "home.html#dashboard";
    } else {
        locationPath = "./login.html";
    }
    window.location.href = locationPath;
}());
function formatLocalDate() {
    'use strict';
    var now = new Date(),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return now.getFullYear()
        + '-' + pad(now.getMonth() + 1)
        + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours())
        + ':' + pad(now.getMinutes())
        + ':' + pad(now.getSeconds())
        + dif + pad(tzo / 60)
        + ':' + pad(tzo % 60);
}
var push;
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
    .constant('AUTH_SERVICE_BASE', 'https://tagalongidm.azurewebsites.net/')
    .constant('API_SERVICE_BASE', 'https://tagalongapi.azurewebsites.net/')
    .constant('UPLOAD_URI', 'https://tagalongdocs.azurewebsites.net/api/documents/')
    .constant('CLIENT_ID', 'c49c92a9dfbe4374ba82fdbcadc70569')
    .constant('USER_ROLE', 1)
    .run(function ($ionicPlatform, $rootScope, $ionicSideMenuDelegate, $window, USER_ROLE, $http, API_SERVICE_BASE) {
        'use strict';
        $rootScope.side_menu = document.getElementsByTagName("ion-side-menu")[0];
        $rootScope.userData = {
            name: localStorage.getItem('name'),
            userName: localStorage.getItem('username')
        };
        $rootScope.authData = {
            token: localStorage.getItem('access_token')
        };
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromParams) {
            if (toState.roles !== 3 && toState.roles !== USER_ROLE) {
                event.preventDefault();
                return false;
            }
        });
        $rootScope.USER_ROLE = USER_ROLE;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromParams) {
            if (toState.name !== 'dashboard') {
                $rootScope.side_menu.style.display = "block";
            }
        });
        $rootScope.$watch(function () {
            return $ionicSideMenuDelegate.getOpenRatio();
        }, function (ratio) {
            if (ratio > 0.3) {
                $rootScope.side_menu.style.display = "block";
            } else {
                $rootScope.side_menu.style.display = "none";
            }
        });

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
                $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                $window.cordova.plugins.Keyboard.disableScroll(true);
            }
            if ($window.StatusBar) {
                // org.apache.cordova.statusbar required
                $window.StatusBar.styleDefault();
            }
            if ($window.PushNotification) {
                push = $window.PushNotification.init({
                    "android": {
                        "senderID": "406789023201"
                    },
                    "ios": {
                        "alert": "true",
                        "badge": "true",
                        "sound": "true"
                    },
                    "$windows": {}
                });

                push.on('registration', function (data) {
                    var registrationBody = {
                        "registration_id": data.registrationId,
                        "provider": "GCM",
                        "userName": $rootScope.userData.userName,
                        "appVersion": "v1",
                        "dateAdded": formatLocalDate(),
                        "deviceInfo": [
                            {
                                "key": "MobileOS",
                                "value": "Android"
                            }
                        ]
                    };

                    $http.post(API_SERVICE_BASE + 'api/v1/drivers', registrationBody,
                               {headers: { 'Authorization': 'Bearer ' + $rootScope.authData.token }}).then(function (response) {
                        $rootScope.driverData = response.data;
                        $http.post(API_SERVICE_BASE + 'api/v1/devices/' + $rootScope.driverData.id + '/devices', registrationBody,
                                   {headers: { 'Authorization': 'Bearer ' + $rootScope.authData.token }}).then(function (response) {
                            window.alert('Device Registered successfully');
                        }, function () {
                            window.alert('Device registration failed');
                        });
                    }, function (response) {
                        window.alert('Failed to get Driver Data');
                    });
                });

                push.on('notification', function (data) {
                    $window.alert(data.message);
                    // data.message,
                    // data.title,
                    // data.count,
                    // data.sound,
                    // data.image,
                    // data.additionalData
                });

                push.on('error', function (e) {
                    $window.alert(e.message);
                });
            }
        });
    });