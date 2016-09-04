var aboutCtrl = function ($scope, $rootScope, userprofileService) {
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
};