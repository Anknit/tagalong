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
    }]);

