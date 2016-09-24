/*global angular*/
function refreshAccessToken() {
    'use strict';
    var authRefreshToken = localStorage.getItem('refresh_token'),
        TokenRefreshTime = 30 * 60 * 1000,
        data = "grant_type=refresh_token&refresh_token=" + authRefreshToken + "&client_id=" + window.clientId,
        http = new XMLHttpRequest();
    if (localStorage.getItem('expires_in')) {
        TokenRefreshTime = parseInt(localStorage.getItem('expires_in'), 10) * 60 * 1000;
    }
    http.open("POST", window.authServiceBase + 'token', true);
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
            } else if (http.status === 400) {
                response = JSON.parse(http.responseText);
                window.alert(response.error_description);
                window.location.href = "./login.html";
            } else {
                window.console.log('Failed to refresh access token');
            }
        }
    };
    http.send(data);
    window.setTimeout(refreshAccessToken, TokenRefreshTime);
}
(function onInit() {
    'use strict';
    var locationPath, isAuth = localStorage.getItem("isAuth");
    if (typeof isAuth === "undefined") {
        locationPath = "./signup.html";
    } else if (isAuth === "true") {
        refreshAccessToken();
        locationPath = "home.html#dashboard";
    } else {
        locationPath = "./login.html";
    }
    window.location.href = locationPath;
}());
var push;
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'vsGoogleAutocomplete'])
    .constant('AUTH_SERVICE_BASE', 'https://tagalongidm.azurewebsites.net/')
    .constant('API_SERVICE_BASE', 'https://tagalongapi.azurewebsites.net/')
    .constant('UPLOAD_URI', 'https://tagalongdocs.azurewebsites.net/api/documents/')
    .constant('CLIENT_ID', 'c49c92a9dfbe4374ba82fdbcadc70569')
    .constant('PUSH_SENDER_ID', '406789023201')
    .constant('USER_ROLE', 1)
    .constant('APP_VERSION', 'v1')
    .config(function ($httpProvider) {
        'use strict';
        $httpProvider.interceptors.push('authInterceptorService');
    })
    .run(function ($ionicPlatform, $rootScope, $ionicSideMenuDelegate, $window, USER_ROLE, $http, API_SERVICE_BASE, $interval, pushNotificationService, $ionicModal) {
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
                pushNotificationService.init();
                $ionicModal.fromTemplateUrl('templates/notificationModal.html', {
                    scope: $rootScope
                }).then(function (modal) {
                    $rootScope.notificationModal = modal;
                });
                $rootScope.$on('gcm-registered', function (event, args) {
                    pushNotificationService.attachToServer(args);
                });
                $rootScope.notifyAccept = function () {
                    $window.alert('Notification Accepted');
                    $rootScope.notifyClose();
                };
                $rootScope.notifyClose = function () {
                    $window.map.setClickable(true);
                    $rootScope.notificationModal.hide();
                };
                $rootScope.$on('new-push-notification', function (event, args) {
                    $window.console.log(args);
                    $rootScope.notifyData = args;
                    $window.map.setClickable(false);
                    $rootScope.notificationModal.show();
                });
                $rootScope.$on('push-notification-error', function (event, args) {
                    $window.console.log(args);
                });
            }
        });
    });