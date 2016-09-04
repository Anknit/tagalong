var paypalAccountCtrl = function ($scope, $window) {
    'use strict';
    $scope.addPaypalAccount = function () {
        localStorage.setItem("paypalAccountEmail", $scope.paypalAccountEmail);
        localStorage.setItem("paypalAccountNum", $scope.paypalAccountNum);
        $window.alert('paypal account added successfully');
        $window.location.href = "#profile/directPayment";
    };
};