/*global angular, dashboardCtrl, aboutCtrl, locationCtrl, contactCtrl, creditDebitCardCtrl, checkingAccountCtrl, paypalAccountCtrl, directAccountCtrl, uploadDocCtrl, settingsCtrl*/
var map;
(function (angular) {
    'use strict';
    var modCtrl = angular.module('app.controllers', []);
    modCtrl.controller('dashboardCtrl', ['$scope', '$rootScope', '$ionicSideMenuDelegate', 'se_locationService', '$window', '$http', 'API_SERVICE_BASE', 'userprofileService', function ($scope, $rootScope, $ionicSideMenuDelegate, se_locationService, $window, $http, API_SERVICE_BASE, userprofileService) {
        function checkDriverStatus() {
            var driverId,
                userinfo = $rootScope.user.userInfo,
                driverStatus = $window.localStorage.getItem('driver-status'),
                isDriver = $window.localStorage.getItem('isDriver');
            if (isDriver === "true") {
                $rootScope.isDriverUser = true;
                driverId  = $window.localStorage.getItem('driver-id');
            } else if (isDriver === "false") {
                $rootScope.isDriverUser = false;
            } else {
                if (typeof userinfo === "object" && userinfo.length > 0 && userinfo[0].value) {
                    driverId = userinfo[0].value;
                    $rootScope.isDriverUser = true;
                    $window.localStorage.setItem('driver-id', driverId);
                } else {
                    $rootScope.isDriverUser = false;
                }
            }
            $window.localStorage.setItem('isDriver', $rootScope.isDriverUser);
            if ($rootScope.isDriverUser) {
                if (driverStatus === "true" || driverStatus === "false") {
                    $scope.driverStatus = (driverStatus === "true");
                    $window.localStorage.setItem('driver-status', $scope.driverStatus);
                } else {
                    $window.document.getElementsByClassName('loading-blocker')[0].style.display = 'block';
                    $http.get(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/status', {}).then(function (response) {
                        $scope.driverStatus = response.status;
                        $window.localStorage.setItem('driver-status', $scope.driverStatus);
                        $window.document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
                    }, function (error) {
                        $window.console.log(error);
                        $scope.driverStatus = true;
                        $window.localStorage.setItem('driver-status', $scope.driverStatus);
                        $window.document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
                    });
                }
            }
        }
        if ($rootScope.user && typeof $rootScope.user === "object") {
            checkDriverStatus();
        } else {
            userprofileService.getUserProfile().then(function (response) {
                $rootScope.user = response.data;
                checkDriverStatus();
            }, function (response) {
                
            });
        }
        $rootScope.side_menu.style.display = "none";
        $rootScope.authSuccess = true;
        $rootScope.hideSplash = true;
        $scope.locationObject = {
            coords: {
                latitude: 0,
                longitude: 0
            }
        };
        $scope.changeDriverStatus = function () {
            var driverId = $window.localStorage.getItem('driver-id'),
                temp,
                statusData = {
                    status: 'Unavailable',
                    untill: ''
                };
            $window.localStorage.setItem('driver-status', $scope.driverStatus);
            if ($scope.driverStatus) {
                statusData.status = 'Available';
                $window.localStorage.removeItem('Driver-Unavailable-till');
                if ($rootScope.statusChangeTimeout) {
                    $window.clearTimeout($rootScope.statusChangeTimeout);
                }
            } else {
                temp = new Date();
                statusData.untill = new Date(temp.setHours(temp.getHours() + 1));
            }
            $http.post(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/status', statusData, {}).then(function (reponse) {
                $rootScope.driverStatus = statusData;
                if (statusData.status === 'Unavailable') {
                    $window.localStorage.setItem('Driver-Unavailable-till', statusData.untill.getTime());
                    $rootScope.statusChangeTimeout = $window.setTimeout(function () {
                        if ($rootScope.driverStatus.status === 'Unavailable') {
                            $rootScope.driverStatus.status = 'Available';
                            $rootScope.driverStatus.untill = '';
                            statusData = $rootScope.driverStatus;
                            $http.post(API_SERVICE_BASE + 'api/v1/drivers/' + driverId + '/status', statusData, {}).then(function (reponse) {
                                $scope.driverStatus = true;
                            }, function (error) {
                                $window.console.log(error);
                            });
                        }
                    }, (statusData.untill.getTime() - (new Date()).getTime()));
                }
            }, function (error) {
                $window.console.log(error);
            });
        };
        document.addEventListener("deviceready", function () {
            var mapDiv = document.getElementById("map_canvas");
            map = $window.plugin.google.maps.Map.getMap(mapDiv, {
                'mapType': $window.plugin.google.maps.MapTypeId.ROADMAP,
                'controls': {
                    'myLocationButton': true,
                    'zoom': true
                },
                'gestures': {
                    'rotate': true,
                    'zoom': true
                }
            });
            map.setBackgroundColor('white');
            map.addEventListener($window.plugin.google.maps.event.MAP_READY, function () {
                se_locationService.getPosition(function (response) {
                    var currentLocation = new $window.plugin.google.maps.LatLng(response.coords.latitude, response.coords.longitude);
                    map.setZoom(15);
                    map.setCenter(currentLocation);
                }, function (error) {});
            });
        });
    }]);
    modCtrl.controller('aboutCtrl', ['$scope', '$rootScope', 'userprofileService', function ($scope, $rootScope, userprofileService) {
        $scope.editMode = false;
        $scope.saveProfileAbout = function () {
            $scope.editMode = false;
            localStorage.setItem("profileDOB", $scope.profileDOB.getTime());
            localStorage.setItem("profileName", $scope.profileName);
            localStorage.setItem("profileGender", $scope.profileGender);
            localStorage.setItem("commEnabled", $scope.commEnabled);
            localStorage.setItem("commEmail", $scope.commEmail);
            localStorage.setItem("commSMS", $scope.commSMS);
        };
        (function fetchProfileAbout() {
            $scope.profileDOB = new Date(parseInt(localStorage.getItem("profileDOB"), 10));
            $scope.profileName = localStorage.getItem("profileName");
            $scope.profileGender = localStorage.getItem("profileGender");
            $scope.commEnabled = (localStorage.getItem("commEnabled") === "true");
            $scope.commEmail = (localStorage.getItem("commEmail") === "true");
            $scope.commSMS = (localStorage.getItem("commSMS") === "true");
        }());
    }]);
    modCtrl.controller('locationCtrl', ['$scope', function ($scope) {
        $scope.editMode = false;
        $scope.saveProfileLocation = function () {
            $scope.editMode = false;
            localStorage.setItem("homeStreetLoc", $scope.homeStreet);
            localStorage.setItem("homeStateLoc", $scope.homeState);
            localStorage.setItem("homeZipLoc", $scope.homeZip);
            localStorage.setItem("sameBillingLoc", $scope.sameBilling);
            if ($scope.sameBilling) {
                $scope.billStreet = $scope.homeStreet;
                $scope.billState = $scope.homeState;
                $scope.billZip = $scope.homeZip;
            }
            localStorage.setItem("billStreetLoc", $scope.billStreet);
            localStorage.setItem("billStateLoc", $scope.billState);
            localStorage.setItem("billZipLoc", $scope.billZip);
        };
        (function fetchProfileLocation() {
            $scope.homeStreet = localStorage.getItem("homeStreetLoc");
            $scope.homeState = localStorage.getItem("homeStateLoc");
            $scope.homeZip = localStorage.getItem("homeZipLoc");
            $scope.billStreet = localStorage.getItem("billStreetLoc");
            $scope.billState = localStorage.getItem("billStateLoc");
            $scope.billZip = localStorage.getItem("billZipLoc");
            $scope.sameBilling = (localStorage.getItem("sameBillingLoc") === "true");
        }());
    }]);
    modCtrl.controller('contactCtrl', ['$scope', function ($scope) {
        $scope.editMode = false;
        $scope.saveProfileContact = function () {
            $scope.editMode = false;
            localStorage.setItem("contactEmail", $scope.contactEmail);
            localStorage.setItem("contactMobile", $scope.contactMobile);
            localStorage.setItem("contactHome", $scope.contactHome);
        };
        (function fetchProfileContact() {
            //http request
            $scope.contactEmail = localStorage.getItem("contactEmail");
            $scope.contactMobile = localStorage.getItem("contactMobile");
            $scope.contactHome = localStorage.getItem("contactHome");
        }());
    }]);
    modCtrl.controller('creditDebitCardCtrl', ['$scope', '$window', function ($scope, $window) {
        $scope.addCardDetails = function (scope) {
            localStorage.setItem("cardNumber", $scope.cardNumber);
            localStorage.setItem("cardExpiry", $scope.cardExpiry.getTime());
            localStorage.setItem("cardholderName", $scope.cardholderName);
            localStorage.setItem("cardBillingAddress", $scope.cardBillingAddress);
            $window.alert('Card details added successfully');
            $window.location.href = "#directDeposit";
        };
    }]);
    modCtrl.controller('checkingAccountCtrl', ['$scope', '$window', function ($scope, $window) {
        $scope.addCheckingAccount = function () {
            if ($scope.checkingAccountNum === $scope.checkingAccountNumConfirm) {
                localStorage.setItem("checkingAccountName", $scope.checkingAccountName);
                localStorage.setItem("checkingAccountRoutingNum", $scope.checkingAccountRoutingNum);
                localStorage.setItem("checkingAccountNum", $scope.checkingAccountNum);
                $window.alert('checking account added successfully');
                $window.location.href = "#directPayment";
            } else {
                $window.alert('Account Number mismatch');
            }
        };
    }]);
    modCtrl.controller('paypalAccountCtrl', ['$scope', '$window', function ($scope, $window) {
        $scope.addPaypalAccount = function () {
            localStorage.setItem("paypalAccountEmail", $scope.paypalAccountEmail);
            localStorage.setItem("paypalAccountNum", $scope.paypalAccountNum);
            $window.alert('paypal account added successfully');
            $window.location.href = "#directPayment";
        };
    }]);
    modCtrl.controller('directAccountCtrl', ['$scope', '$window', function ($scope, $window) {
        $scope.directPaymentOpt = "paypal";
        $scope.addDirectPayment = function () {
            if ($scope.directPaymentOpt === "paypal") {
                window.location.href = '#paypalAccount';
            } else {
                window.location.href = '#checkingAccount';
            }
        };
    }]);
    modCtrl.controller('uploadDocumentsCtrl', ['$scope', 'docMgrService', '$http', 'API_SERVICE_BASE', '$ionicHistory', '$state', '$rootScope', function ($scope, docMgrService, $http, API_SERVICE_BASE, $ionicHistory, $state, $rootScope) {
        var additionalData = {}, docItem, i;
        $scope.uploadedDocsStatus = {license: false, registration: false, insurance: false};
        function updateDocStatus(docType) {
            switch (docType) {
            case '1':
                $scope.uploadedDocsStatus.license = true;
                break;
            case '2':
                $scope.uploadedDocsStatus.registration = true;
                break;
            case '3':
                $scope.uploadedDocsStatus.insurance = true;
                break;
            default:
                break;
            }
        }
        docMgrService.fetchDocument().then(function (response) {
            $scope.documents = response.data.collection.items || [];
            for (i = 0; i < $scope.documents.length; i = i + 1) {
                docItem = $scope.documents[i].data;
                updateDocStatus(docItem[5].value);
            }
        });
        $scope.showUploadOption = false;
        $scope.uploadDocType = 0;
        $scope.documents = [];
        $scope.license = {
            expiry: '',
            number: '',
            state: ''
        };
        $scope.registration = {
            expiry: '',
            vin: '',
            state: '',
            carmake: '',
            carmodel: '',
            caryear: ''
        };
        $scope.insurance = {
            expiry: ''
        };

        function loadDocument(docType) {
            docMgrService.loadDocImage(function (imgUri) {
                $scope.imgData = imgUri;
                var imgName = imgUri.substr(imgUri.lastIndexOf('/') + 1);
                $scope.licenseImgName = '';
                $scope.insuranceImgName = '';
                $scope.registrationImgName = '';
                $scope.licenseLoaded = false;
                $scope.insuranceLoaded = false;
                $scope.registrationLoaded = false;
                $scope.uploadDocType = docType;
                switch (docType) {
                case 1:
                    $scope.licenseLoaded = true;
                    $scope.licenseImgName = imgName;
                    additionalData = $scope.license;
                    break;
                case 2:
                    $scope.registrationLoaded = true;
                    $scope.registrationImgName = imgName;
                    additionalData = $scope.registration;
                    break;
                case 3:
                    $scope.insuranceLoaded = true;
                    $scope.insuranceImgName = imgName;
                    additionalData = $scope.insurance;
                    break;
                default:
                    break;
                }
                additionalData.docType = docType;
                $scope.$digest();
            });
        }
        function uploadDocument() {
            window.document.getElementsByClassName('loading-blocker')[0].style.display = 'block';
            docMgrService.uploadDocument($scope.imgData, additionalData, function (response) {
                window.document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
                $scope.documents.push(response.collection.items);
                updateDocStatus($scope.uploadDocType.toString());
                $scope.uploadDocType = 0;
                $scope.$digest();
                window.alert('Document uploaded successfully');
            }, function (error) {
                window.console.log(error);
                window.document.getElementsByClassName('loading-blocker')[0].style.display = 'none';
            });
        }
        $scope.getDriverLicense = function () {
            loadDocument(1);
        };
        $scope.getVehicleRegistration = function () {
            loadDocument(2);
        };
        $scope.getVehicleInsurance = function () {
            loadDocument(3);
        };
        $scope.uploadCurrentDocument = function () {
            if ($scope.uploadDocType) {
                uploadDocument();
            }
        };
        $scope.cancelUpload = function () {
            $scope.uploadDocType = 0;
            $scope.licenseImgName = '';
            $scope.insuranceImgName = '';
            $scope.registrationImgName = '';
            $scope.licenseLoaded = false;
            $scope.insuranceLoaded = false;
            $scope.registrationLoaded = false;
        };
        $scope.showLoadedImage = function () {
            $scope.showUploadOption = true;
        };
        $scope.closePreview = function () {
            $scope.showUploadOption = false;
        };
        $scope.becomeDriver = function () {
            var legalName = window.localStorage.getItem('legal-name');
            $http.post(API_SERVICE_BASE + 'api/v1/drivers', {legalname: legalName}, {}).then(function (response) {
                $rootScope.isDriverUser = true;
                window.localStorage.setItem('isDriver', true);
                window.localStorage.setItem('driver-id', response.data.id);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('dashboard');
            }, function (error) {
                window.console.log(error);
                window.alert('Failed to create driver');
            });
        };
        $scope.cancelBecomeDriver = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('dashboard');
        };
    }]);
    modCtrl.controller('settingsCtrl', ['$scope', function ($scope) {
        $scope.logout = function () {
            window.resetStorageData();
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
    }]);
    modCtrl.controller('directDepositCtrl', function ($scope) {});
    modCtrl.controller('yourDetailsCtrl', ['$scope', 'verificationService', '$location', '$state', '$ionicHistory', function ($scope, verificationService, $location, $state, $ionicHistory) {
        verificationService.isMobileVerified().then(function (status) {
            if (status) {
                $scope.isMobileVerified = true;
            } else {
                $scope.isMobileVerified = false;
            }
        }, function (error) {
            $scope.error = error;
        });
        $scope.driverLegalname = window.localStorage.getItem('legal-name') || '';
        $scope.$on('mobile-code-verified', function () {
            $scope.isMobileVerified = true;
        });
        $scope.confirmDriverAgreement = function () {
            if ($scope.driverLegalname && $scope.driverLegalname !== '') {
                window.localStorage.setItem('legal-name', $scope.driverLegalname);
                $state.go('uploadDocuments');
            } else {
                window.alert('Please provide a legal name');
            }
        };
        $scope.declineDriverAgreement = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('dashboard');
        };
    }]);
    modCtrl.controller('driverRoutesCtrl', ['$scope', 'driverRouteService', '$window', function ($scope, driverRouteService, $window) {        
        $scope.weekdays = [
            {
                name: 'Mon',
                selected: false
            },
            {
                name: 'Tue',
                selected: false
            },
            {
                name: 'Wed',
                selected: false
            },
            {
                name: 'Thu',
                selected: false
            },
            {
                name: 'Fri',
                selected: false
            },
            {
                name: 'Sat',
                selected: false
            },
            {
                name: 'Sun',
                selected: false
            }
        ];

        function resetScopeData() {
            $scope.routeDateTime = '';
            $scope.routeName = '';
            $scope.routeEditMode = false;
            $scope.fromaddress = {
                name: '',
                streetNumber: '',
                street: '',
                city: '',
                state: '',
                countryCode: '',
                country: '',
                postCode: '',
                district: '',
                location: {
                    lat: '',
                    long: ''
                }

            };
            $scope.destaddress = {
                name: '',
                streetNumber: '',
                street: '',
                city: '',
                state: '',
                countryCode: '',
                country: '',
                postCode: '',
                district: '',
                location: {
                    lat: '',
                    long: ''
                }

            };
            $scope.newroute = {
                startaddress: {},
                startDate: '',
                startTime: '',
                timeZone: '',
                destaddress: {},
                routeName: '',
                recurrence: {
                    "daysOfMonth": [0],
                    "daysOfWeek": [0],
                    "recurrenceType": "daysOfWeek"
                }

            };
            $scope.weekdays = [
                {
                    name: 'Mon',
                    selected: false
                },
                {
                    name: 'Tue',
                    selected: false
                },
                {
                    name: 'Wed',
                    selected: false
                },
                {
                    name: 'Thu',
                    selected: false
                },
                {
                    name: 'Fri',
                    selected: false
                },
                {
                    name: 'Sat',
                    selected: false
                },
                {
                    name: 'Sun',
                    selected: false
                }
            ];
        }
        $scope.driverRoutes = [];
        var driverId = $window.localStorage.getItem('driver-id');
        resetScopeData();
        driverRouteService.getRoutes(driverId).then(function (response) {
            $scope.driverRoutes = response;
        }, function () {

        });
        $scope.routeFormVisible = false;
        $scope.routeEditMode = false;
        $scope.showRouteForm = function () {
            $scope.routeFormVisible = true;
        };
        $scope.hideRouteForm = function () {
            $scope.routeFormVisible = false;
            resetScopeData();
        };
        $scope.editRouteDetails = function (route) {
            if (angular.isDefined(route.routeName)) {
                $scope.routeDateTime = route.startDate;
                $scope.routeName = route.routeName;
                $scope.fromaddress.name = route.startAddress.formattedAddress;
                $scope.destaddress.name = route.destAddress.formattedAddress;
                $scope.routeEditMode = true;
                $scope.showRouteForm();
            }
        };
        $scope.deleteRoute = function (route) {
            if (angular.isDefined(route.routeName)) {
                driverRouteService.deleteRoute(route.routeName, driverId).then(function (response) {
                    driverRouteService.getRoutes(driverId).then(function (response) {
                        $scope.driverRoutes = response;
                    }, function (error) {
                        $window.console.log(error);
                    });
                }, function (error) {
                    $window.console.log(error);
                });
            }
        };

        $scope.submitNewRoute = function () {
            var i;
            if (angular.isDefined($scope.fromaddress.components.placeId)) {
                $scope.newroute.startaddress.formattedAddress = $scope.fromaddress.name;
                $scope.newroute.startaddress.address1 = $scope.fromaddress.components.streetNumber + ' ' + $scope.fromaddress.components.street;
                $scope.newroute.startaddress.city = $scope.fromaddress.components.city;
                $scope.newroute.startaddress.state = $scope.fromaddress.components.state;
                $scope.newroute.startaddress.postalCode = $scope.fromaddress.components.postCode;
                $scope.newroute.startaddress.countryCode = $scope.fromaddress.components.countryCode;
            } else {
                $window.alert("Starting Address in not valid");
                return;
            }
            if (angular.isDefined($scope.destaddress.components.placeId)) {
                $scope.newroute.destaddress.formattedAddress = $scope.destaddress.name;
                $scope.newroute.destaddress.address1 = $scope.destaddress.components.streetNumber + ' ' + $scope.destaddress.components.street;
                $scope.newroute.destaddress.city = $scope.destaddress.components.city;
                $scope.newroute.destaddress.state = $scope.destaddress.components.state;
                $scope.newroute.destaddress.postalCode = $scope.destaddress.components.postCode;
                $scope.newroute.destaddress.countryCode = $scope.destaddress.components.countryCode;
            } else {
                $window.alert("Destination Address in not valid");
                return;
            }
            $scope.newroute.startDate = $scope.routeDateTime;
            $scope.newroute.startTime = $scope.routeDateTime.getHours() + ':' + $scope.routeDateTime.getMinutes();
            $scope.newroute.timeZone = $scope.routeDateTime.getTimezoneOffset();
            $scope.newroute.routeName = $scope.routeName;
            if ($scope.recurrenceShow) {
                $scope.newroute.recurrence.daysOfWeek = [];
                for (i = 0; i < $scope.weekdays.length; i = i + 1) {
                    if ($scope.weekdays[i].selected) {
                        $scope.newroute.recurrence.daysOfWeek.push({
                            'day': $scope.weekdays[i].name
                        });
                    }
                }
            }
            if ($scope.routeEditMode) {
                driverRouteService.editRoute($scope.newroute, driverId).then(function (response) {
                    $scope.hideRouteForm();
                    resetScopeData();
                    driverRouteService.getRoutes(driverId).then(function (response) {
                        $scope.driverRoutes = response;
                    }, function () {

                    });
                }, function () {});
            } else {
                driverRouteService.addRoute($scope.newroute, driverId).then(function (response) {
                    $scope.hideRouteForm();
                    resetScopeData();
                    driverRouteService.getRoutes(driverId).then(function (response) {
                        $scope.driverRoutes = response;
                    }, function () {

                    });
                }, function () {});
            }
        };
    }]);
    modCtrl.controller('trackingHomeCtrl', function ($scope) {});
    modCtrl.controller('driverOptionsCtrl', function ($scope) {});
    modCtrl.controller('trackingCtrl', function ($scope) {});
    modCtrl.controller('delieveryStatusCtrl', function ($scope) {});
    modCtrl.controller('orderHomeCtrl', ['$scope', 'ordersService', '$window', '$location', function ($scope, ordersService, $window, $location) {
        $scope.pickupWindow = [
            {
                name: 'Morning',
                slotValue: 1,
                value: 'AM'
            },
            {
                name: 'Afternoon',
                slotValue: 2,
                value: 'PM'
            },
            {
                name: 'Evening',
                slotValue: 3,
                value: 'EV'
            }
        ];
        $scope.parcelSizes = [
            {
                name: 'Small',
                value: 'SM'
            },
            {
                name: 'Medium',
                value: 'MD'
            },
            {
                name: 'Large',
                value: 'LG'
            },
            {
                name: 'Extra Large',
                value: 'XL'
            }
        ];
        function resetOrderData() {
            $scope.newParcelInfo = {
                pickupAddress: {},
                deliveryAddress: {},
                parcelSize: $scope.parcelSizes[0].value,
                sKUCode: "S-2016",
                productAttributeId: 6,
                pickupWindow: $scope.pickupWindow[1].value,
                pickupDate: "",
                deliveryDate: "",
                delivContactEmail: "",
                delivContactNum: "",
                delivName: "",
                pickupContactEmail: "",
                pickupContactNum: "",
                pickupName: ""
            };
            $scope.order = {
                pickupInfo: {
                    name: '',
                    streetNumber: '',
                    street: '',
                    city: '',
                    state: '',
                    countryCode: '',
                    country: '',
                    postCode: '',
                    district: '',
                    location: {
                        lat: '',
                        long: ''
                    }
                },
                deliveryInfo: {
                    name: '',
                    streetNumber: '',
                    street: '',
                    city: '',
                    state: '',
                    countryCode: '',
                    country: '',
                    postCode: '',
                    district: '',
                    location: {
                        lat: '',
                        long: ''
                    }
                }
            };
        }
        resetOrderData();
        $scope.getOrderPrice = function () {
            if (angular.isDefined($scope.order.pickupInfo.address.components.placeId)) {
                $scope.newParcelInfo.pickupAddress.formattedAddress = $scope.order.pickupInfo.address.name;
                $scope.newParcelInfo.pickupAddress.address1 = $scope.order.pickupInfo.address.components.streetNumber + ' ' + $scope.order.pickupInfo.address.components.street;
                $scope.newParcelInfo.pickupAddress.city = $scope.order.pickupInfo.address.components.city;
                $scope.newParcelInfo.pickupAddress.state = $scope.order.pickupInfo.address.components.state;
                $scope.newParcelInfo.pickupAddress.postalCode = $scope.order.pickupInfo.address.components.postCode;
                $scope.newParcelInfo.pickupAddress.countryCode = $scope.order.pickupInfo.address.components.countryCode;
            } else {
                $window.alert('Please enter a valid pick up address');
                return false;
            }
            if (angular.isDefined($scope.order.deliveryInfo.address.components.placeId)) {
                $scope.newParcelInfo.deliveryAddress.formattedAddress = $scope.order.deliveryInfo.address.name;
                $scope.newParcelInfo.deliveryAddress.address1 = $scope.order.deliveryInfo.address.components.streetNumber + ' ' + $scope.order.deliveryInfo.address.components.street;
                $scope.newParcelInfo.deliveryAddress.city = $scope.order.deliveryInfo.address.components.city;
                $scope.newParcelInfo.deliveryAddress.state = $scope.order.deliveryInfo.address.components.state;
                $scope.newParcelInfo.deliveryAddress.postalCode = $scope.order.deliveryInfo.address.components.postCode;
                $scope.newParcelInfo.deliveryAddress.countryCode = $scope.order.deliveryInfo.address.components.countryCode;
            } else {
                $window.alert('Please enter a valid delivery address');
                return false;
            }
            ordersService.priceOrder($scope.newParcelInfo).then(function (response) {
                if (response.data) {
                    $location.path('orderDetails');
                } else {
                    $window.alert('Failed to add product to cart');
                }
            }, function (error) {
                $window.console.log('error');
            });
        };
    }]);
    modCtrl.controller('orderDetailsCtrl', ['$scope', 'ordersService', '$window', '$location', function ($scope, ordersService, $window, $location) {
        $scope.orderInfo = ordersService.orderInfo();
    }]);
    modCtrl.controller('paymentMethodCtrl', ['$scope', '$http', 'API_SERVICE_BASE', '$window', 'ordersService', '$rootScope', '$location', function ($scope, $http, API_SERVICE_BASE, $window, ordersService, $rootScope, $location) {
        $scope.paymentOptions = [];
        $scope.selectedPayOption = {};
        $scope.submitOrder = function () {
            var payData;
            if ($rootScope.newCardAdded) {
                payData = {
                    cardInfo: $rootScope.newCardData,
                    paymentMethod: 'NewCard',
                    paymentProfile: $rootScope.newCardData
                };
            } else {
                if ($scope.paymentOptions.length > 0 && ($scope.selectedPayOption.paymentMethodChoosen >= 0)) {
                    payData = {
                        cardInfo: {},
                        paymentProfile: $scope.paymentOptions[$scope.selectedPayOption.paymentMethodChoosen],
                        paymentMethod: 'ProfileCard'
                    };
                } else {
                    $window.alert('Please choose a payment method');
                    return true;
                }
            }
            ordersService.setPaymentMethod(payData);
            ordersService.setUserData($scope.userData);
            ordersService.submitOrder().then(function (response) {
                $location.path('orderConfirmation');
            }, function (error) {
                $window.alert('Failed to submit order');
            });
        };
        if ($rootScope.newCardAdded) {
            $scope.submitOrder();
            $rootScope.newCardAdded = false;
        } else {
            $http.get(API_SERVICE_BASE + 'api/v1/users/user', {}).then(function (response) {
                $scope.paymentOptions = response.data.creditCards;
                $scope.userData = {
                    id: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    mobileNumber: response.data.mobileNumber || '',
                    defaultAddress: response.data.defaultAddress || '',
                    contactPreferences: response.data.contactPreferences,
                    gender: response.data.gender || ''
                };
            }, function (error) {

            });
        }
    }]);
    modCtrl.controller('addPaymentMethodCtrl', ['$scope', '$location', 'paymentService', '$filter', function ($scope, $location, paymentService, $filter) {
        $scope.addCard = {
            cardNumber: '',
            securitycode: '',
            cardExpiry: '',
            cardholderName: '',
            cardBillingAddress: ''
        };
        $scope.addCardDetails = function () {
            var payMethodObject = {
                expireMonth: $filter('date')($scope.addCard.cardExpiry, 'MM'),
                expireYear: $filter('date')($scope.addCard.cardExpiry, 'yyyy'),
                cardHolderName: $scope.addCard.cardholderName,
                securityCode: $scope.addCard.securitycode,
/*
                poNum: "default",
*/
                cardNumber: $scope.addCard.cardNumber,
                cardType: $scope.addCard.cardType,
/*
                isEncrypted: true,
                saveInProfile: true,
*/
                billingAddress: {
                    address1: $scope.addCard.cardBillingAddress.address.components.streetNumber + ' ' + $scope.addCard.cardBillingAddress.address.components.street,
                    city: $scope.addCard.cardBillingAddress.address.components.city,
                    state: $scope.addCard.cardBillingAddress.address.components.state,
                    postalCode: $scope.addCard.cardBillingAddress.address.components.postCode,
                    countryCode: $scope.addCard.cardBillingAddress.address.components.countryCode,
                    formattedAddress: $scope.addCard.cardBillingAddress.address.name
                }
            };
/*
            paymentService.addPayMethod(payMethodObject).then(function (response) {
                $location.path('orderPayment');
            }, function (error) {
                
            });
*/
            paymentService.addPayMethod(payMethodObject);
            $location.path('orderPayment');
        };
        $scope.cancelAddCard = function () {
            $location.path('paymentMethod');
        };
    }]);
    modCtrl.controller('orderConfirmationCtrl', function ($scope) {});
    modCtrl.controller('orderHistoryCtrl', function ($scope) {});
    modCtrl.controller('deliveriesHistoryCtrl', function ($scope) {});
}(angular));