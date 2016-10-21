/*global angular*/
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
                if (callback && (typeof (callback) === "function")) {
                    callback();
                }
            } else if (http.status === 400) {
                response = JSON.parse(http.responseText);
                window.alert(response.error_description);
                window.location.href = "./login.html";
            } else {
                window.console.log('Failed to refresh access token');
                window.location.href = "./login.html";
            }
        }
    };
    http.send(data);
    window.setTimeout(refreshAccessToken, TokenRefreshTime);
}
function checkMobileVerificationStatus () {
    var http = new XMLHttpRequest();
    http.open("GET", window.authServiceBase + 'api/accounts/status', true);
    http.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('access_token'));
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            var response = '';
            if (http.status === 200) {
                response = JSON.parse(http.responseText);
                localStorage.setItem('isMobileVerified', response.mobileNumberConfirmed);
                localStorage.setItem('isEmailVerified', response.emailConfirmed);
                localStorage.setItem('isStatusActive', response.isActive);
                if (response.mobileNumberConfirmed) {
                    initiateAngularApp();
                    locationPath = "home.html#dashboard";
                } else {
                    locationPath = "./verifyCode.html";
                }
            } else {
                window.console.log('Failed to verify mobile. Please try again');
                locationPath = "./login.html";
            }
            window.location.href = locationPath;
        }
    };
    http.send();
}
function redirectIfMobileVerified () {
    isMobileVerified = localStorage.getItem("isMobileVerified");
    if (isMobileVerified === 'true') {
        initiateAngularApp();
        window.location.href = "home.html#dashboard";
    } else {
        checkMobileVerificationStatus();
    }
}
var push, orderWindowTimer = {}, tagAlongApp;
(function onInit() {
    'use strict';
    var locationPath, isAuth = localStorage.getItem("isAuth"), isMobileVerified, tokenExpiry, remainingTokenValidity;
    if (typeof isAuth === "undefined") {
        window.location.href = "./signup.html";
    } else if (isAuth === "true") {
        tagAlongApp = angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'vsGoogleAutocomplete']);
        tokenExpiry = localStorage.getItem('token_expires');
        remainingTokenValidity = new Number(tokenExpiry) - new Date().getTime() - 10000; // 10 sec taken for compensation
        if (remainingTokenValidity < 0) {
            refreshAccessToken(redirectIfMobileVerified);
        } else {
            window.setTimeout(refreshAccessToken, remainingTokenValidity);
            redirectIfMobileVerified();
        }
    } else {
        window.location.href = "./login.html";
    }
}());
function initiateAngularApp () {
    tagAlongApp.constant('AUTH_SERVICE_BASE', 'https://tagalongidm.azurewebsites.net/')
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
        $http.get(API_SERVICE_BASE + 'api/v1/users/user', {}, {}).then(function (response) {
            $rootScope.user = response.data;
            $window.localStorage.setItem('driver-id', $rootScope.user.userInfo[0].value);
        }, function (response) {
            window.alert('Failed to get Driver Data');
        });
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
        function orderActionCompleted(orderId, response) {
            $interval.cancel(orderWindowTimer[orderId]);
            orderWindowTimer[orderId] = undefined;
            delete orderWindowTimer[orderId];
            delete $rootScope.notifyData[orderId];
            var alertMessage='';        
            switch (response) {
                case 'Accepted':
                    alertMessage = 'Order acceptance has been notified';
                    break;
                case 'Rejected':
                    alertMessage = 'Order rejection has been notified';
                    break;
                case 'Expired':
                    alertMessage = 'Order expired due to timeout';
                    break;
                case 'Failed':
                    alertMessage = 'Order response notification failed';
                    break;
            }
            $window.alert(alertMessage);
            var awaitingOrders = Object.keys($rootScope.notifyData).length;
            if (awaitingOrders === 0) {
                $rootScope.notifyClose();
            }
        }
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
            $rootScope.notifyData = {};
            if ($window.PushNotification) {
                pushNotificationService.init();
                $ionicModal.fromTemplateUrl('templates/notificationModal.html', {
                    scope: $rootScope
                }).then(function (modal) {
                    $rootScope.notificationModal = modal;
                });
                $rootScope.$on('gcm-registered', function (event, args) {
                    var regId = $window.localStorage.getItem('gcm-register-id');
                    if (regId && (regId === args.registrationId)) {
                        // do nothing
                        $window.console.log('Same GCM Reg ID');
                    } else {
                        pushNotificationService.attachToServer(args);
                    }
                });
                $rootScope.notifyAccept = function (args) {
                    var rootScope = this,
                        driverId = $window.localStorage.getItem('driver-id'),
                        orderId = args.additionalData.orderId,
                        temp = new Date(),
                        responseData = {
                            "orderId": orderId,
                            "response": "Accepted",
                            "estPickupTime": (new Date(temp.setHours(temp.getHours() + 1))).toISOString()
                        };
                    $http.post(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/response', responseData, {}).then(function (response) {
                        orderActionCompleted(orderId, 'Accepted');
                    }, function (error) {
                        orderActionCompleted(orderId, 'Failed');
                    });
                };
                $rootScope.notifyDecline = function (args) {
                    var rootScope = this,
                        driverId = $window.localStorage.getItem('driver-id'),
                        orderId = args.additionalData.orderId,
                        temp = new Date(),
                        responseData = {
                            "orderId": orderId,
                            "response": "Rejected",
                            "estPickupTime": (new Date(temp.setHours(temp.getHours() + 1))).toISOString()
                        };
                    $http.post(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/response', responseData, {}).then(function (response) {
                        orderActionCompleted(orderId, 'Rejected');
                    }, function (error) {
                        orderActionCompleted(orderId, 'Failed');
                    });
                };
                $rootScope.notifyClose = function () {
                    $rootScope.notificationModal.hide();
                    $window.map.setClickable(true);
                };
                $rootScope.$on('new-push-notification', function (event, args) {
                    var orderId = args.additionalData.orderId;
                    $rootScope.notifyData[orderId] = args;
                    orderWindowTimer[orderId] = $interval(function () {
                        $rootScope.notifyData[orderId].additionalData.responseWindow -= 1;
                        if ($rootScope.notifyData[orderId].additionalData.responseWindow === 0) {
                            orderActionCompleted(orderId, 'Expired');
                        }
                    }, 1000, 0, true, orderId);
                    $window.map.setClickable(false);
                    $rootScope.notificationModal.show();
                });
                $rootScope.$on('push-notification-error', function (event, args) {
                    $window.console.log(args);
                });
            }
        });
    });
}