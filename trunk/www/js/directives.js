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

    .directive('mobileVerification', ['verificationService', function (verificationService) {
        'use strict';
        return {
            templateUrl: 'templates/mobileVerification.html',
            restrict: 'EA',
            link: function (scope, element, attr) {
                scope.mobilenumber = '';
                if (typeof (window.localStorage.getItem('mobilenum')) !== "undefined") {
                    scope.mobilenumber = window.localStorage.getItem('mobilenum');
                }
                scope.getActivationCode = function () {
                    verificationService.requestMobileCode(scope.mobilenumber).then(function (response) {
                        localStorage.setItem('mobilenum', scope.mobilenumber);
                        scope.codevalue = '';
                        scope.codeRequested = true;
                    });
                scope.onActivationCode = function () {
                    verificationService.verifyMobileCode(scope.codevalue, scope.mobilenumber).then(function (response) {
                    });
                    var verifyCode = document.getElementById('code-input').value;
                    var mobileNumber = localStorage.getItem("mobilenum");
                    var userName = localStorage.getItem("username");
                    if(verifyCode == null || verifyCode == "" || verifyCode.length != 6) {
                        alert("Please enter 6 digit code");
                        return false;
                    }
                    var data = {Code:"",MobileNumber:mobileNumber,UserName:userName}; 
                    data.Code = verifyCode;

                    var data1 = JSON.stringify(data);
                    var http = new XMLHttpRequest();
                    http.open("POST",authServiceBase+'api/accounts/verifycode',true);
                    http.setRequestHeader("Content-Type","application/json");
                    http.onreadystatechange=function(){
                        if(http.readyState == 4){
                            if(http.status==200){
                                localStorage.setItem('isMobileVerified', "true");
                                window.location.href = "./home.html"
                            }
                            else{
                                alert("Invalid Code");
                            }
                        }
                    }
                    http.send(data1);
                }
            }
        };
    }]);

