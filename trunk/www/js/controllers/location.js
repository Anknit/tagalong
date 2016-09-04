var locationCtrl = function ($scope) {
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
};