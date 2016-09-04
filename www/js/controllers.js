/*global angular, dashboardCtrl, aboutCtrl, locationCtrl, contactCtrl, creditDebitCardCtrl, checkingAccountCtrl, paypalAccountCtrl, directAccountCtrl, uploadDocCtrl, settingsCtrl*/
(function (angular) {
    'use strict';
    var modCtrl = angular.module('app.controllers', []);
    modCtrl.controller('dashboardCtrl', ['$scope', '$rootScope', '$ionicSideMenuDelegate', 'se_locationService', '$window', function ($scope, $rootScope, $ionicSideMenuDelegate, se_locationService, $window) {
        'use strict';
        $rootScope.side_menu.style.display = "none";
        $rootScope.authSuccess = true;
        $rootScope.hideSplash = true;
        $scope.locationObject = {
            coords: {
                latitude: 0,
                longitude: 0
            }
        };
        document.addEventListener("deviceready", function () {
            var mapDiv = document.getElementById("map_canvas"),
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
        'use strict';
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
        'use strict';
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
        'use strict';
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
    modCtrl.controller('creditDebitCardCtrl', ['$scope','$window', function ($scope, $window) {
        'use strict';
        $scope.addCardDetails = function (scope) {
            localStorage.setItem("cardNumber", $scope.cardNumber);
            localStorage.setItem("cardExpiry", $scope.cardExpiry.getTime());
            localStorage.setItem("cardholderName", $scope.cardholderName);
            localStorage.setItem("cardBillingAddress", $scope.cardBillingAddress);
            $window.alert('Card details added successfully');
            $window.location.href = "#profile/account";
        };
    }]);
    modCtrl.controller('checkingAccountCtrl', ['$scope','$window', function ($scope, $window) {
        'use strict';
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
    modCtrl.controller('paypalAccountCtrl', ['$scope','$window', function ($scope, $window) {
        'use strict';
        $scope.addPaypalAccount = function () {
            localStorage.setItem("paypalAccountEmail", $scope.paypalAccountEmail);
            localStorage.setItem("paypalAccountNum", $scope.paypalAccountNum);
            $window.alert('paypal account added successfully');
            $window.location.href = "#profile/directPayment";
        };
    }]);
    modCtrl.controller('directAccountCtrl', ['$scope','$window', function ($scope, $window) {
        'use strict';
        $scope.directPaymentOpt = "paypal";
        $scope.addDirectPayment = function () {
            if ($scope.directPaymentOpt === "paypal") {
                window.location.href = '#profile/directPayment/paypalAccount';
            } else {
                window.location.href = '#profile/directPayment/checkingAccount';
            }
        };
    }]);
    modCtrl.controller('uploadDocumentsCtrl', ['$scope','$window', function ($scope, $window) {
        'use strict';
        $scope.serverUploadPath = '';

        function getImageFromDevice(onSuccess) {
            function onFail(message) {
                $window.alert('Failed because: ' + message);
            }
            $window.navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: $window.Camera.DestinationType.FILE_URI,
                sourceType: 0
            });

            /*
                    function onSuccess(imageURI) {
                        var image = document.getElementById('myImage');
                        image.src = imageURI;
                    }
            */

        }

        function createNewFileEntry(imgUri) {
            window.resolveLocalFileSystemURL($window.cordova.file.cacheDirectory, function success(dirEntry) {

                // JPEG file
                dirEntry.getFile("tempFile.jpeg", {
                    create: true,
                    exclusive: false
                }, function (fileEntry) {

                    // Do something with it, like write to it, upload it, etc.
                    // writeFile(fileEntry, imgUri);
                    // displayFileData(fileEntry.fullPath, "File copied to");

                }, function () {
                    $window.alert('Failed Get File');
                });
            }, function () {
                $window.alert('Failed resolve Local File Entry');
            });
        }

        function getFileEntry(imgUri, onSuccess) {
            window.resolveLocalFileSystemURL(imgUri, onSuccess, function () {
                // If don't get the FileEntry (which may happen when testing
                // on some emulators), copy to a new FileEntry.
                createNewFileEntry(imgUri);
            });
        }

        function upload(fileEntry, success) {
            // !! Assumes variable fileURL contains a valid URL to a text file on the device,

            /*
                    var success = function (r) {
                        console.log("Successful upload...");
                        console.log("Code = " + r.responseCode);
                        displayFileData(fileEntry.fullPath + " (content uploaded to server)");
                    }
            */

            var fileURL = fileEntry.toURL(),
                fail = function (error) {
                    $window.alert("An error has occurred: Code = " + error.code);
                },
                SERVER = 'https://www.wisdomtalkies.com/wisdom-talkies/php/appdata.php',
                options = new $window.FileUploadOptions(),
                params = {},
                ft = new $window.FileTransfer();
            options.fileKey = "file";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "text/plain";

            params.value1 = "test";
            params.value2 = "param";

            options.params = params;

            // SERVER must be a URL that can handle the request, like
            // http://some.server.com/upload.php
            ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
        }
        var successFileUpload = function (response) {},
            successFileEntry = function (fileEntry) {
                if ($scope.serverUploadPath === '') {
                    $window.alert('No path to upload');
                    return false;
                }
                upload(fileEntry, successFileUpload, $scope.serverUploadPath);
            },
            successFetch = function (imageURI) {
                getFileEntry(imageURI, successFileEntry);
            };
        $scope.getDriverLicense = function () {
            $scope.serverUploadPath = 'https://wisdomtalkies.com/wisdom-talkies/';
            getImageFromDevice(successFetch);
        };
        $scope.getVehicleRegistration = function () {
            $scope.serverUploadPath = 'https://wisdomtalkies.com/wisdom-talkies/';
            getImageFromDevice(successFetch);
        };
        $scope.getVehicleInsurance = function () {
            $scope.serverUploadPath = 'https://wisdomtalkies.com/wisdom-talkies/';
            getImageFromDevice(successFetch);
        };

    }]);
    modCtrl.controller('settingsCtrl', ['$scope', function ($scope) {
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
    }]);
    modCtrl.controller('accountCtrl', function ($scope) {});
    modCtrl.controller('yourDetailsCtrl', function ($scope) {});
    modCtrl.controller('favoritesCtrl', function ($scope) {});
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