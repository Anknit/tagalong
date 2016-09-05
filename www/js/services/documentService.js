/*global angular*/
angular.module('app.services').service('docMgrService', ['$window', 'UPLOAD_URI', '$rootScope', function ($window, UPLOAD_URI, $rootScope) {
    'use strict';
    function createNewFileEntry(imgUri) {
        window.resolveLocalFileSystemURL($window.cordova.file.cacheDirectory, function success(dirEntry) {
            dirEntry.getFile("tempFile.jpeg", {
                create: true,
                exclusive: false
            }, function (fileEntry) {
            }, function () {
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
        options.headers = {'Content-Type': undefined};
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
            
        }
    };
    return docService;
}]);