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
    .constant('AUTH_SERVICE_BASE', 'http://devserver1.tisaaw.com:12102/')
    .constant('API_SERVICE_BASE', 'http://devserver1.tisaaw.com:12101/')
    .constant('CLIENT_ID', 'c49c92a9dfbe4374ba82fdbcadc70569')
    .constant('UPLOAD_URI', 'http://tagalongdocs.azurewebsites.net/api/documents/')
    .constant('DEVICE_URI', 'http://tagalongdocs.azurewebsites.net/api/v1/devices/')
    .constant('USER_ROLE', 1)
    .run(function ($ionicPlatform, $rootScope, $ionicSideMenuDelegate, $window, USER_ROLE, $http, DEVICE_URI) {
        'use strict';
        $rootScope.side_menu = document.getElementsByTagName("ion-side-menu")[0];
        $rootScope.userData = {
            name: localStorage.getItem('name'),
            userName: localStorage.getItem('username')
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
                        "appVersion": "version1.0",
                        "dateAdded": formatLocalDate(),
                        "deviceInfo": [
                            {
                                "key": "MobileOS",
                                "value": "Android"
                            }
                        ]
                    };


                    $http.post(DEVICE_URI, registrationBody, {}).then(function (response) {
                        $window.alert(response);
                        $window.console.log(response);
                    }, function () {
                        
                    });
//                    $window.alert(data.registrationId);
                    // data.registrationId
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