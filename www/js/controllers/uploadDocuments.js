var uploadDocCtrl = function ($scope, $window) {
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

};