(function onInit() {
    var isAuth = localStorage.getItem("isAuth");
    var locationPath;
    if (typeof isAuth === "undefined") {
        locationPath = "./signup.html";
    } else if (isAuth === "true") {
        locationPath = "home.html#dashboard";
    } else {
        locationPath = "./login.html";
    }
    window.location.href = locationPath;
}());
var push;
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
    .constant('AUTH_SERVICE_BASE', 'http://devserver1.tisaaw.com:12102/')
    .constant('API_SERVICE_BASE', 'http://devserver1.tisaaw.com:12101/')
    .constant('CLIENT_ID', 'c49c92a9dfbe4374ba82fdbcadc70569')
    .constant('USER_ROLE', 1)
    .run(function ($ionicPlatform, $rootScope, $ionicSideMenuDelegate, $window, USER_ROLE) {
        'use strict';
        $rootScope.side_menu = document.getElementsByTagName("ion-side-menu")[0];
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

/*
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
                $window.alert(data.registrationId);
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
*/

        });
    });