var checkingAccountCtrl = function ($scope, $window) {
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
};