angular.module('verifySuccess', ['ionic'])
.controller('verificationSuccessCtrl', function($scope) {
    $scope.driverPref = true;
    localStorage.setItem('driverPref',true);
    $scope.changeDriverPreference = function(){
        localStorage.setItem('driverPref',$scope.driverPref);
    }
})
