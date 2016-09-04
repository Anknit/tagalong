var contactCtrl = function ($scope) {
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
};