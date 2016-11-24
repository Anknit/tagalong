/*global angular*/
var push,
    orderWindowTimer = {};
(function onInit() {
    'use strict';
    var locationPath,
        isAuth = localStorage.getItem("isAuth"),
        isMobileVerified,
        tokenExpiry,
        remainingTokenValidity;
    if (typeof isAuth === "undefined") {
        window.location.href = "./signup.html";
    } else if (isAuth === "true") {
        tokenExpiry = localStorage.getItem('token_expires');
        remainingTokenValidity = parseInt(tokenExpiry, 10) - new Date().getTime() - 10000; // 10 sec taken for compensation
        if (remainingTokenValidity < 0) {
            window.refreshAccessToken(window.redirectToHome);
        } else {
            window.setTimeout(window.refreshAccessToken, remainingTokenValidity);
            window.redirectToHome();
        }
    } else {
        window.location.href = "./login.html";
    }
}());
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'vsGoogleAutocomplete', 'input-ssn'])
    .constant('AUTH_SERVICE_BASE', 'https://tagalongidm.azurewebsites.net/')
    .constant('API_SERVICE_BASE', 'https://tagalongapi.azurewebsites.net/')
    .constant('UPLOAD_URI', 'https://tagalongdocs.azurewebsites.net/api/documents/')
    .constant('CLIENT_ID', 'c49c92a9dfbe4374ba82fdbcadc70569')
    .constant('PUSH_SENDER_ID', '406789023201')
    .constant('USER_ROLE', 1)
    .constant('APP_VERSION', 'v1')
    .config(function ($httpProvider, $ionicConfigProvider) {
        'use strict';
        $httpProvider.interceptors.push('authInterceptorService');
        $ionicConfigProvider.views.maxCache(0);
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
        $rootScope.driverDeliveries = $window.localStorage.getItem('driverDeliveries') ? angular.fromJson($window.localStorage.getItem('driverDeliveries')) : {};
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
        $rootScope.disableTap = function(elem) {
            var container = document.getElementsByClassName('pac-container');
            angular.element(container).attr('data-tap-disabled', 'true');
            var backdrop = document.getElementsByClassName('backdrop');
            angular.element(backdrop).attr('data-tap-disabled', 'true');
            angular.element(container).on("click", function() {
                elem.blur();
            });
        };
        $rootScope.$watch(function () {
            return $ionicSideMenuDelegate.getOpenRatio();
        }, function (ratio) {
            if (ratio > 0.3) {
                $rootScope.side_menu.style.display = "block";
            } else {
                $rootScope.side_menu.style.display = "none";
            }
        });
        function orderActionCompleted(orderId, response, driverId) {
            $interval.cancel(orderWindowTimer[orderId]);
            orderWindowTimer[orderId] = undefined;
            $rootScope.driverDeliveries = $rootScope.driverDeliveries || {};
            $rootScope.driverDeliveries[driverId] = $rootScope.driverDeliveries[driverId]  || [];
            $rootScope.driverDeliveries[driverId].push({orderIdNum: orderId, orderStatus: response, orderData: $rootScope.notifyData[orderId]});
            $window.localStorage.setItem('driverDeliveries', angular.toJson($rootScope.driverDeliveries));
            delete orderWindowTimer[orderId];
            delete $rootScope.notifyData[orderId];
            var alertMessage = '',
                awaitingOrders;
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
            awaitingOrders = Object.keys($rootScope.notifyData).length;
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
                    $rootScope.playNotificationAudio = function () {
                        var audioElement = document.getElementById('notification-audio'),
                            url = audioElement.getAttribute('src');
                        $rootScope.my_media = new window.Media(url, null, null, function (status) {
                            if (status === window.Media.MEDIA_STOPPED && Object.keys($rootScope.notifyData).length > 0) {
                                $rootScope.my_media.seekTo(0);
                                $rootScope.my_media.play();
                            }
                        });
                        $rootScope.my_media.play();
                    };
                    $rootScope.pauseNotificationAudio = function () {
                        $rootScope.my_media.stop();
                    };
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
                        orderActionCompleted(orderId, 'Accepted', driverId);
                    }, function (error) {
                        orderActionCompleted(orderId, 'Failed', driverId);
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
                        orderActionCompleted(orderId, 'Rejected', driverId);
                    }, function (error) {
                        orderActionCompleted(orderId, 'Failed', driverId);
                    });
                };
                $rootScope.notifyClose = function () {
                    if (localStorage.getItem('settingsSound') !== "false") {
                        $rootScope.pauseNotificationAudio();
                    }
                    $rootScope.notificationModal.hide();
                    $window.map.setClickable(true);
                };
                $rootScope.$on('new-push-notification', function (event, args) {
                    var orderId = args.additionalData.orderId,
                        driverId = $window.localStorage.getItem('driver-id');
                    $rootScope.notifyData[orderId] = args;
                    orderWindowTimer[orderId] = $interval(function () {
                        $rootScope.notifyData[orderId].additionalData.responseWindow -= 1;
                        if ($rootScope.notifyData[orderId].additionalData.responseWindow === 0) {
                            orderActionCompleted(orderId, 'Expired', driverId);
                        }
                    }, 1000, 0, true, orderId, driverId);
                    $window.map.setClickable(false);
                    $rootScope.notificationModal.show();
                    if (localStorage.getItem('settingsSound') !== "false") {
                        $rootScope.playNotificationAudio();
                    }
                });
                $rootScope.$on('modal.hidden', function() {
                    $window.map.setClickable(true);
                });
                $rootScope.$on('push-notification-error', function (event, args) {
                    $window.console.log(args);
                });
            }
        });
    });