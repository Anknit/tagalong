/*global angular*/
angular.module('app.services', [])
    .factory('userprofileService', ['$http', 'API_SERVICE_BASE', function ($http, API_SERVICE_BASE) {
        'use strict';
        var serviceBase = API_SERVICE_BASE,
            userprofileServiceFactory = {},
            getUserProfile = function () {
                return $http.get(serviceBase + 'api/v1/users/user/?rnd=' + new Date().getTime()).then(function (results) {
                    return results;
                });
            },
            setUserProfile = function (registration) {
                return $http.post(serviceBase + 'api/v1/users', registration).then(function (results) {
                    return results;
                });
            },
            updateUserProfile = function (userData) {
                return $http.put(serviceBase + 'api/v1/users/', userData).then(function (results) {
                    return results;
                });
            },
            addCreditCard = function (creditCard) {
                return $http.post(serviceBase + 'api/v1/users/user/creditcards', creditCard).then(function (results) {
                    return results;
                });
            },
            deleteCreditCard = function (index) {
                return $http.delete(serviceBase + 'api/v1/users/user/creditcards/' + index).then(function (results) {
                    return results;
                });
            },
            addLocation = function (userLocations) {
                return $http.post(serviceBase + 'api/v1/users/user/locations', userLocations).then(function (results) {
                    return results;
                });
            },
            deleteLocation = function (index) {
                return $http.delete(serviceBase + 'api/v1/users/user/locations/' + index).then(function (results) {
                    return results;
                });
            },
            addUserAddress = function (userAddresses) {
                return $http.post(serviceBase + 'api/v1/users/user/addresses', userAddresses).then(function (results) {
                    return results;
                });
            },
            deleteUserAddress = function (index) {
                return $http.delete(serviceBase + 'api/v1/users/user/addresses/' + index).then(function (results) {
                    return results;
                });
            };

        userprofileServiceFactory.getUserProfile = getUserProfile;
        userprofileServiceFactory.setUserProfile = setUserProfile;
        userprofileServiceFactory.updateUserProfile = updateUserProfile;
        userprofileServiceFactory.addCreditCard = addCreditCard;
        userprofileServiceFactory.deleteCreditCard = deleteCreditCard;
        userprofileServiceFactory.addLocation = addLocation;
        userprofileServiceFactory.deleteLocation = deleteLocation;
        userprofileServiceFactory.addUserAddress = addUserAddress;
        userprofileServiceFactory.deleteUserAddress = deleteUserAddress;

        return userprofileServiceFactory;

    }])

    .service('se_locationService', ['API_SERVICE_BASE', function (API_SERVICE_BASE) {
        'use strict';
        var str_serviceBase = API_SERVICE_BASE,
            ob_locationService = {},
            ob_options = {
                maximumAge: 3600000,
                enableHighAccuracy: true
            },
            fn_getPosition = function (fn_successCallback, fn_errorCallback) {
                ob_options.timeout = 10000;
                navigator.geolocation.getCurrentPosition(fn_successCallback, fn_errorCallback, ob_options);
            },
            fn_watchPosition = function (fn_successCallback, fn_errorCallback) {
                ob_options.timeout = 3000;
                navigator.geolocation.watchPosition(fn_successCallback, fn_errorCallback, ob_options);
            },
            fn_setOptions = function (ob_configObj) {
                var key;
                for (key in ob_configObj) {
                    if (ob_configObj.hasOwnProperty(key)) {
                        ob_options[key] = ob_configObj[key];
                    }
                }
            };
        ob_locationService.getPosition = fn_getPosition;
        ob_locationService.watchPosition = fn_watchPosition;
        ob_locationService.setOption = fn_setOptions;
        return ob_locationService;
    }])

    .service('pushNotificationService', ['$window', 'PUSH_SENDER_ID', '$rootScope', 'APP_VERSION', 'API_SERVICE_BASE', '$http', function ($window, PUSH_SENDER_ID, $rootScope, APP_VERSION, API_SERVICE_BASE, $http) {
        'use strict';

        function formatLocalDate() {
            var now = new Date(),
                tzo = -now.getTimezoneOffset(),
                dif = tzo >= 0 ? '+' : '-',
                pad = function (num) {
                    var norm = Math.abs(Math.floor(num));
                    return (norm < 10 ? '0' : '') + norm;
                };
            return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + dif + pad(tzo / 60) + ':' + pad(tzo % 60);
        }

        var se_pushNotification = {},
            senderId = PUSH_SENDER_ID,
            notificationCount = 0,
            notificationObj = {},
            initPushService = function () {
                notificationObj = $window.PushNotification.init({
                    "android": {
                        "senderID": senderId
                    },
                    "ios": {
                        "alert": "true",
                        "badge": "true",
                        "sound": "true"
                    },
                    "windows": {}
                });
                notificationObj.on('registration', function (data) {
                    $rootScope.$broadcast('gcm-registered', data);
                });
                notificationObj.on('notification', function (data) {
                    $rootScope.$broadcast('new-push-notification', data);
                });
                notificationObj.on('error', function (data) {
                    $rootScope.$broadcast('push-notification-error', data);
                });
            },
            registerDeviceOnServer = function (data, alreadyRegistered, deviceId) {
                var registrationBody = {
                    "registration_id": data.registrationId,
                    "provider": "GCM",
                    "userName": $rootScope.userData.userName,
                    "appVersion": APP_VERSION,
                    "dateAdded": (new Date()).toISOString(),
                    "deviceInfo": [
                        {
                            "key": "MobileOS",
                            "value": "Android"
                        }
                    ]
                };
                if (alreadyRegistered) {
                    $http.put(API_SERVICE_BASE + 'api/v1/devices/' + deviceId, registrationBody, {}).then(function (response) {
                        window.alert('Device registration updated successfully');
                        $window.localStorage.setItem('gcm-register-id', registrationBody.registration_id);
                    }, function () {
                        window.alert('Device registration update failed');
                    });
                } else {
                    $http.post(API_SERVICE_BASE + 'api/v1/devices', registrationBody, {}).then(function (response) {
                        $window.localStorage.setItem('gcm-register-id', registrationBody.registration_id);
                    }, function () {
                        $window.alert('Device registration failed');
                    });
                }
            };
        se_pushNotification.init = initPushService;
        se_pushNotification.attachToServer = registerDeviceOnServer;
        return se_pushNotification;
    }])

    .service('docMgrService', ['$window', 'UPLOAD_URI', '$rootScope', '$http', function ($window, UPLOAD_URI, $rootScope, $http) {
        'use strict';

        function createNewFileEntry(imgUri) {
            window.resolveLocalFileSystemURL($window.cordova.file.cacheDirectory, function success(dirEntry) {
                dirEntry.getFile("tempFile.jpeg", {
                    create: true,
                    exclusive: false
                }, function (fileEntry) {}, function () {
                    $window.alert('Failed Get File');
                });
            }, function () {
                $window.alert('Failed resolve Local File Entry');
            });
        }

        function getFileEntry(imgUri, onSuccess) {
            window.resolveLocalFileSystemURL(imgUri, onSuccess, function () {
                createNewFileEntry(imgUri);
            });
        }

        function upload(fileEntry, addParams, success) {
            var fileURL = fileEntry.toURL(),
                fail = function (error) {
                    $window.alert("An error has occurred: Code = " + error.code);
                },
                options = new $window.FileUploadOptions(),
                params = addParams,
                ft = new $window.FileTransfer();
            options.fileKey = "file";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.headers = {
                'Content-Type': undefined
            };
            params.username = $rootScope.userData.userName;
            options.params = params;
            ft.upload(fileURL, encodeURI(UPLOAD_URI), success, fail, options);
        }

        var docService = {
            loadDocImage: function (successCallback) {
                $window.navigator.camera.getPicture(successCallback, function (error) {
                    $window.console.log(error);
                    $window.alert('Error getting image from device');
                }, {
                    quality: 50,
                    destinationType: $window.Camera.DestinationType.FILE_URI,
                    sourceType: 0
                });
            },
            uploadDocument: function (imgUri, addParams, uploadSuccess) {
                getFileEntry(imgUri, function (fileEntry) {
                    upload(fileEntry, addParams, function (uploadResponse) {
                        if (uploadResponse.responseCode === 200) {
                            uploadSuccess(JSON.parse(uploadResponse.response));
                        } else {
                            window.alert('Failed to upload document');
                        }
                    });
                });
            },
            fetchDocument: function () {
                var username = $window.localStorage.getItem('username');
                return $http.get(UPLOAD_URI + 'user/' + username).then(function (response) {
                    return response;
                }, function (error) {
                    $window.console.log(error);
                });
            }
        };
        return docService;
    }])

    .service('driverRouteService', ['$window', '$http', 'API_SERVICE_BASE', function ($window, $http, API_SERVICE_BASE) {
        'use strict';
        var driverRouteService = {},
            getDefinedRoutes = function (driverId) {
                return $http.get(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/routes', {}).then(function (response) {
                    return response.data;
                }, function (response) {
                    $window.alert('Failed to get routes');
                });
            },
            addDriverRoute = function (routeData, driverId) {
                return $http.post(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/routes', routeData, {}).then(function (response) {
                    return response.data;
                }, function (error) {
                    $window.console.log(error);
                });
            },
            editDriverRoute = function (routeData, driverId) {
                return $http.put(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/routes/' + routeData.routeName, routeData, {}).then(function (response) {
                    return response.data;
                }, function (error) {
                    $window.console.log(error);
                });
            },
            removeDriverRoute = function (routeName, driverId) {
                return $http.delete(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/routes/ ' + routeName, {}).then(function (response) {
                    return response.data;
                }, function (error) {
                    $window.console.log(error);
                });
            };
        driverRouteService.getRoutes = getDefinedRoutes;
        driverRouteService.addRoute = addDriverRoute;
        driverRouteService.editRoute = editDriverRoute;
        driverRouteService.deleteRoute = removeDriverRoute;
        return driverRouteService;
    }])

    .service('ordersService', ['$window', '$http', 'API_SERVICE_BASE', function ($window, $http, API_SERVICE_BASE) {
        'use strict';
        var ordersServiceFactory = {},
            orders = {
                shoppingCart: []
            },
            price = {},
            payMethod = {},
            userData = {},
            getOrders = function () {
                return $http.get(API_SERVICE_BASE + 'api/v1/orders').then(function (results) {
                    return results;
                });
            },
            addToCart = function (orderData) {
                return $http.post(API_SERVICE_BASE + 'api/v1/users/user/cart/', orderData).then(function (results) {
                    return results;
                });
            },
            submitOrder = function () {
                var orderData = {
                    shoppingCart: orders.shoppingCart,
                    paymentDetails: payMethod,
                    deliveryAddress: '',
                    orderId: '',

                    /*
                                        user: userData,
                                        createDate: new Date().toISOString(),
                    */
                    orderStatus: "Added to Cart",
                    recipient: {}
                };
                return $http.post(API_SERVICE_BASE + 'api/v1/orders', orderData).then(function (results) {
                    return results;
                }, function (error) {
                    $window.console.log(error);
                });
            },
            orderInfo = function () {
                return {
                    orderInfo: orders,
                    priceInfo: price
                };
            },
            setPaymentMethod = function (paymethodData) {
                payMethod = paymethodData;
                return true;
            },
            setUserData = function (data) {
                userData = data;
                return true;
            },
            priceOrder = function (orderData) {
                orders.shoppingCart.push({
                    /*
                                        itemType: "Parcel",
                                        quantity: 1,
                    */
                    product: {
                        pickupAddress: orderData.pickupAddress,
                        deliveryAddress: orderData.deliveryAddress,
                        /*
                                                parcelType: "Parcel",
                        */
                        productAttributeId: orderData.productAttributeId,
                        parcelSize: orderData.parcelSize,
                        sKUCode: orderData.sKUCode,
                        pickupDate: orderData.pickupDate,
                        pickupWindow: 'PM',
                        deliveryDate: orderData.deliveryDate,
                        delivContactEmail: orderData.delivContactEmail,
                        delivContactNum: orderData.delivContactNum,
                        delivName: orderData.delivName,
                        pickupContactEmail: orderData.pickupContactEmail,
                        pickupContactNum: orderData.pickupContactNum,
                        pickupName: orderData.pickupName
                    }
                    /*
                                        deliveryOptions: {
                                            pickupTimeSlot: orderData.pickupWindow
                                        }
                    */
                });
                return $http.post(API_SERVICE_BASE + 'api/v1/prices/orderprice', orders).then(function (results) {
                    price = results.data;
                    return results;
                }, function (error) {
                    $window.console.log(error);
                });
            };
        ordersServiceFactory.getOrders = getOrders;
        ordersServiceFactory.addToCart = addToCart;
        ordersServiceFactory.submitOrder = submitOrder;
        ordersServiceFactory.priceOrder = priceOrder;
        ordersServiceFactory.orderInfo = orderInfo;
        ordersServiceFactory.setPaymentMethod = setPaymentMethod;
        ordersServiceFactory.setUserData = setUserData;

        return ordersServiceFactory;
    }])

    .service('paymentService', ['$window', '$http', 'API_SERVICE_BASE', '$rootScope', function ($window, $http, API_SERVICE_BASE, $rootScope) {
        'use strict';
        var paymentService = {},
            addPaymentMethod = function (payData) {
                return $http.post(API_SERVICE_BASE + 'api/v1/users/user/creditcards', payData, {}).then(function (response) {
                    return response;
                }, function (error) {
                    $window.console.log(error);
                });
            },
            addPaymentDummy = function (payData) {
                $rootScope.newCardData = payData;
                $rootScope.newCardAdded = true;
            };
        /*  Dummy Till Fixed from server
                paymentService.addPayMethod = addPaymentMethod;
        */
        paymentService.addPayMethod = addPaymentDummy;
        return paymentService;
    }])

    .service('authInterceptorService', ['$q', '$location', '$rootScope', '$window', function ($q, $location, $rootScope, $window) {
        'use strict';
        var authInterceptorServiceFactory = {},
            responseError = function (rejection) {
                if (rejection.status === 401) {
                    $window.resetStorageData();
                    $window.location.href = "./index.html";
                }
                return $q.reject(rejection);
            },
            request = function (config) {
                config.headers = config.headers || {};
                var authData = $window.localStorage.getItem('access_token');

                //set authorization header
                if (authData) {
                    config.headers.Authorization = 'Bearer ' + authData;
                }
                return config;
            };
        authInterceptorServiceFactory.request = request;
        authInterceptorServiceFactory.responseError = responseError;
        return authInterceptorServiceFactory;
    }])

    .service('verificationService', ['$http', '$window', 'AUTH_SERVICE_BASE', '$q', function ($http, $window, AUTH_SERVICE_BASE, $q) {
        'use strict';
        var serviceObj = {};

        function getMobileCode(mobileNum) {
            var username = $window.localStorage.getItem('username');
            return $http.post(AUTH_SERVICE_BASE + 'api/accounts/getcode', {
                CodeType: "PhoneCode",
                MobileNumber: mobileNum,
                UserName: username
            }, {}).then(function (response) {
                return response;
            }, function (error) {
                $window.console.log(error);
            });
        }

        function verifyMobileCode(verifyCode, mobileNum) {
            var username = $window.localStorage.getItem('username');
            return $http.post(AUTH_SERVICE_BASE + 'api/accounts/verifycode', {
                Code: verifyCode,
                MobileNumber: mobileNum,
                UserName: username
            }, {}).then(function (response) {
                return response;
            }, function (error) {
                $window.console.log(error);
            });
        }

        function checkMobileVerificationStatus() {
            var mobileStatus = $window.localStorage.getItem('isMobileVerified'),
                statusDeffered = $q.defer();
            if (mobileStatus && typeof (mobileStatus) !== "undefined") {
                mobileStatus = (mobileStatus === "true");
                statusDeffered.resolve(mobileStatus);
            } else {
                $http.get(AUTH_SERVICE_BASE + 'api/accounts/status', {}).then(function (response) {
                    $window.localStorage.setItem('isMobileVerified', response.data.mobileNumberConfirmed);
                    statusDeffered.resolve(response.data.mobileNumberConfirmed);
                }, function (error) {
                    statusDeffered.reject(error);
                });
            }
            return statusDeffered.promise;
        }
        serviceObj.requestMobileCode = getMobileCode;
        serviceObj.verifyMobileCode = verifyMobileCode;
        serviceObj.isMobileVerified = checkMobileVerificationStatus;
        return serviceObj;
    }]);


    /*

    {"shoppingCart":[
        {
            "product": {
                "pickupAddress":{
                    "formattedAddress":"Sector 39A, Sector 32, Sector 39, Noida, Uttar Pradesh 201303, India",
                    "address1":"undefined undefined",
                    "city":"Noida",
                    "state":"UP",
                    "postalCode":"201303",
                    "countryCode":"IN"
                },
                "deliveryAddress":{
                    "formattedAddress":"Bhagawan Mahavir Marg, Varun Kunj, Rithala, Rohini, New Delhi, Delhi 110085, India",
                    "address1":"undefined Bhagawan Mahavir Marg",
                    "city":"New Delhi",
                    "state":"DL",
                    "postalCode":"110085",
                    "countryCode":"IN"
                },
                "parcelSize":"SM",
                "sKUCode":"S-2016",
                "productAttributeId":6,
                "pickupWindow":"PM",
                "pickupDate":"",
                "deliveryDate":"",
                "pickupName":"Ankit",
                "pickupContactNum":9457192833,
                "pickupContactEmail":"ankitakkii24@gmail.com",
                "delivContactNum":7042206861,
                "delivName":"Karishma",
                "delivContactEmail":"abhishek@gmail.com"
            }
        }],
        "deliveryAddress":"",
        "paymentDetails":{
            "cardInfo":{
                "billingAddress":{
                    "formattedAddress":"Sector 39A, Sector 32, Sector 39, Noida, Uttar Pradesh 201303, India",
                    "address1":"undefined undefined",
                    "city":"Noida",
                    "state":"UP",
                    "postalCode":"201303",
                    "countryCode":"IN"
                },
                "cardType":"VISA",
                "cardNumber":"4111111111111111",
                "securityCode":"999",
                "expireMonth":"03",
                "expireYear":"2019",
                "cardHolderName":"Ankit Agarwal"
            },
            "paymentMethod":"NewCard",
            "paymentProfile":{
                "billingAddress":{
                    "formattedAddress":"Sector 39A, Sector 32, Sector 39, Noida, Uttar Pradesh 201303, India",
                    "address1":"undefined undefined",
                    "city":"Noida",
                    "state":"UP",
                    "postalCode":"201303",
                    "countryCode":"IN"
                },
                "cardType":"VISA",
                "cardNumber":"4111111111111111",
                "securityCode":"999",
                "expireMonth":"03",
                "expireYear":"2019",
                "cardHolderName":"Ankit Agarwal"
            }
        },
        "recipient":{},
        "orderId":"",
        "orderStatus":"Added to Cart"
    }

    */