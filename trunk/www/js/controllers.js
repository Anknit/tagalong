/*global angular, dashboardCtrl, aboutCtrl, locationCtrl, contactCtrl, creditDebitCardCtrl, checkingAccountCtrl, paypalAccountCtrl, directAccountCtrl, uploadDocCtrl, settingsCtrl*/
var map;
(function (angular) {
    'use strict';
    var modCtrl = angular.module('app.controllers', []);
    modCtrl.controller('dashboardCtrl', ['$scope', '$rootScope', '$ionicSideMenuDelegate', 'se_locationService', '$window', function ($scope, $rootScope, $ionicSideMenuDelegate, se_locationService, $window) {
        $rootScope.side_menu.style.display = "none";
        $rootScope.authSuccess = true;
        $rootScope.hideSplash = true;
        $scope.locationObject = {
            coords: {
                latitude: 0,
                longitude: 0
            }
        };
        $scope.options = {
            types: ['(cities)']
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
            $window.location.href = "#profile/account";
        };
    }]);
    modCtrl.controller('checkingAccountCtrl', ['$scope', '$window', function ($scope, $window) {
        $scope.addCheckingAccount = function () {
            if ($scope.checkingAccountNum === $scope.checkingAccountNumConfirm) {
                localStorage.setItem("checkingAccountName", $scope.checkingAccountName);
                localStorage.setItem("checkingAccountRoutingNum", $scope.checkingAccountRoutingNum);
                localStorage.setItem("checkingAccountNum", $scope.checkingAccountNum);
                $window.alert('checking account added successfully');
                $window.location.href = "#profile/directPayment";
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
            $window.location.href = "#profile/directPayment";
        };
    }]);
    modCtrl.controller('directAccountCtrl', ['$scope', '$window', function ($scope, $window) {
        $scope.directPaymentOpt = "paypal";
        $scope.addDirectPayment = function () {
            if ($scope.directPaymentOpt === "paypal") {
                window.location.href = '#profile/directPayment/paypalAccount';
            } else {
                window.location.href = '#profile/directPayment/checkingAccount';
            }
        };
    }]);
    modCtrl.controller('uploadDocumentsCtrl', ['$scope', 'docMgrService', function ($scope, docMgrService) {
        var additionalData = {};
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
            docMgrService.uploadDocument($scope.imgData, additionalData, function (response) {
                $scope.documents = response.collection.items;
                $scope.uploadDocType = 0;
                window.alert('Document uploaded successfully');
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
    }]);
    modCtrl.controller('settingsCtrl', ['$scope', function ($scope) {
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
    }]);
    modCtrl.controller('accountCtrl', function ($scope) {});
    modCtrl.controller('yourDetailsCtrl', function ($scope) {});
    modCtrl.controller('favoritesCtrl', ['$scope', 'driverRouteService', '$window', function ($scope, driverRouteService, $window) {
        $scope.weekdays = [
          { name: 'Mon', selected: false},
          { name: 'Tue', selected: false},
          { name: 'Wed', selected: false},
          { name: 'Thu', selected: false},
          { name: 'Fri', selected: false},
          { name: 'Sat', selected: false},
          { name: 'Sun', selected: false}
        ];
        // selected weekdays
        $scope.selection = [];
        $scope.recurrence = [$scope.weekdays[0]];
        $scope.driverRoutes = [];
        var driverId = $window.localStorage.getItem('driver-id');
        $scope.driverRoutes = driverRouteService.getRoutes(driverId);
        $scope.routeFormVisible = false;
        $scope.showRouteForm = function () {
            $scope.routeFormVisible = true;
        };
        $scope.hideRouteForm = function () {
            $scope.routeFormVisible = false;
        };
    }]);
    modCtrl.controller('trackingHomeCtrl', function ($scope) {});
    modCtrl.controller('trackingCtrl', function ($scope) {});
    modCtrl.controller('delieveryStatusCtrl', function ($scope) {});
    modCtrl.controller('orderHomeCtrl', function ($scope) {});
    modCtrl.controller('orderDetailsCtrl', function ($scope) {});
    modCtrl.controller('paymentMethodCtrl', function ($scope) {});
    modCtrl.controller('orderConfirmationCtrl', function ($scope) {});
    modCtrl.controller('orderHistoryCtrl', function ($scope) {});
    modCtrl.controller('deliveriesHistoryCtrl', function ($scope) {});
}(angular));