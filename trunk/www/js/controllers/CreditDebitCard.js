var creditDebitCardCtrl = function ($scope, $window) {
    'use strict';
    $scope.addCardDetails = function (scope) {
        localStorage.setItem("cardNumber", $scope.cardNumber);
        localStorage.setItem("cardExpiry", $scope.cardExpiry.getTime());
        localStorage.setItem("cardholderName", $scope.cardholderName);
        localStorage.setItem("cardBillingAddress", $scope.cardBillingAddress);
        $window.alert('Card details added successfully');
        $window.location.href = "#profile/account";
    };
};