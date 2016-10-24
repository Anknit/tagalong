/*global angular*/
angular.module('app.directives', [])

    .directive('paymentAddCard', [function () {
        'use strict';
        return {
            templateUrl: 'templates/addCard.html',
            restrict: 'EA',
            link: function (scope, element, attr) {
                scope.cardTypes = [
                    {
                        name: 'Visa',
                        value: 'VISA'
                    },
                    {
                        name: 'Master Card',
                        value: 'MASTERCARD'
                    },
                    {
                        name: 'Discover',
                        value: 'DISCOVER'
                    },
                    {
                        name: 'American Express',
                        value: 'AMEX'
                    }
                ];
                scope.addCard = scope.addCard || {};
                scope.addCard.cardType = scope.cardTypes[0].value;
            }
        };
    }])

    .directive('mobileVerification', ['verificationService', '$rootScope', '$state', '$ionicHistory', function (verificationService, $rootScope, $state, $ionicHistory) {
        'use strict';
        return {
            templateUrl: 'templates/mobileVerification.html',
            restrict: 'EA',
            link: function (scope, element, attr) {
                scope.mobilenumber = '';
                if (window.localStorage.getItem('mobilenum') && typeof (window.localStorage.getItem('mobilenum')) !== "undefined") {
                    scope.mobilenumber = window.localStorage.getItem('mobilenum');
                }
                scope.getActivationCode = function () {
                    verificationService.requestMobileCode(scope.mobilenumber).then(function (response) {
                        window.localStorage.setItem('mobilenum', scope.mobilenumber);
                        scope.codevalue = '';
                        scope.codeRequested = true;
                        $rootScope.$broadcast('mobile-code-requested');
                    });
                };
                scope.onActivationCode = function () {
                    verificationService.verifyMobileCode(scope.codevalue, scope.mobilenumber).then(function (response) {
                        window.localStorage.setItem('isMobileVerified', "true");
                        scope.codeVerified = true;
                        $rootScope.$broadcast('mobile-code-verified');
                    });
                };
                scope.cancelMobileVerification = function () {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('dashboard');
                };
            }
        };
    }]);