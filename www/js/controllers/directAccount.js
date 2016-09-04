var directAccountCtrl = function ($scope, $window) {
    'use strict';
    $scope.directPaymentOpt = "paypal";
    $scope.addDirectPayment = function () {
        if ($scope.directPaymentOpt === "paypal") {
            window.location.href = '#profile/directPayment/paypalAccount';
        } else {
            window.location.href = '#profile/directPayment/checkingAccount';
        }
    };
};