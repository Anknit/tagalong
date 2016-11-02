/*global angular*/
angular.module('app.routes', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                abstract: true,
                roles: 3
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardCtrl',
                roles: 3
            })
            .state('profile.about', {
                url: '/about',
                views: {
                    'tab4': {
                        templateUrl: 'templates/about.html',
                        controller: 'aboutCtrl'
                    }
                },
                roles: 3
            })
            .state('profile.location', {
                url: '/location',
                views: {
                    'tab5': {
                        templateUrl: 'templates/location.html',
                        controller: 'locationCtrl'
                    }
                },
                roles: 3
            })
            .state('profile.contact', {
                url: '/contact',
                views: {
                    'tab6': {
                        templateUrl: 'templates/contact.html',
                        controller: 'contactCtrl'
                    }
                },
                roles: 3
            })
            .state('directDeposit', {
                url: '/directDeposit',
                templateUrl: 'templates/directDeposit.html',
                controller: 'directDepositCtrl',
                roles: 3
            })
            .state('creditDebitCard', {
                url: '/creditPayment',
                templateUrl: 'templates/creditDebitCard.html',
                controller: 'creditDebitCardCtrl',
                roles: 3
            })
            .state('directAccount', {
                url: '/directPayment',
                templateUrl: 'templates/directAccount.html',
                controller: 'directAccountCtrl',
                roles: 3
            })
            .state('checkingaccount', {
                url: '/checkingAccount',
                templateUrl: 'templates/checkingaccount.html',
                controller: 'checkingAccountCtrl',
                roles: 3
            })
            .state('paypalaccount', {
                url: '/paypalAccount',
                templateUrl: 'templates/paypalaccount.html',
                controller: 'paypalAccountCtrl',
                roles: 3
            })
            .state('yourDetails', {
                url: '/driverDetails',
                templateUrl: 'templates/yourDetails.html',
                controller: 'yourDetailsCtrl',
                roles: 3
            })
            .state('uploadDocuments', {
                url: '/driverDocuments',
                templateUrl: 'templates/uploadDocuments.html',
                controller: 'uploadDocumentsCtrl',
                roles: 1
            })
            .state('driverRoutes', {
                url: '/driverRoutes',
                templateUrl: 'templates/driverRoutes.html',
                controller: 'driverRoutesCtrl',
                roles: 3
            })
            .state('driverOptions', {
                url: '/driverOptions',
                templateUrl: 'templates/driverOptions.html',
                controller: 'driverOptionsCtrl',
                roles: 3
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'settingsCtrl',
                roles: 3
            })
            .state('trackingHome', {
                url: '/trackinghome',
                templateUrl: 'templates/trackingHome.html',
                controller: 'trackingHomeCtrl',
                roles: 3
            })
            .state('tracking', {
                url: '/delieveryStatusHome',
                templateUrl: 'templates/tracking.html',
                controller: 'trackingCtrl',
                roles: 3
            })
            .state('delieveryStatus', {
                url: '/deliveryStatusList',
                templateUrl: 'templates/delieveryStatus.html',
                controller: 'delieveryStatusCtrl',
                roles: 3
            })
            .state('orderHome', {
                url: '/orderHome',
                templateUrl: 'templates/orderHome.html',
                controller: 'orderHomeCtrl',
                roles: 3
            })
            .state('orderDetails', {
                url: '/orderDetails',
                templateUrl: 'templates/orderDetails.html',
                controller: 'orderDetailsCtrl',
                roles: 3
            })
            .state('paymentMethod', {
                url: '/orderPayment',
                templateUrl: 'templates/paymentMethod.html',
                controller: 'paymentMethodCtrl',
                roles: 3
            })
            .state('addOrderPayment', {
                url: '/addOrderPayment',
                templateUrl: 'templates/addPaymentMethod.html',
                controller: 'addPaymentMethodCtrl',
                roles: 3
            })
            .state('orderConfirmation', {
                url: '/orderConfirmation',
                templateUrl: 'templates/orderConfirmation.html',
                controller: 'orderConfirmationCtrl',
                roles: 3
            })
            .state('orderHistory', {
                url: '/orderHistory',
                templateUrl: 'templates/orderHistory.html',
                controller: 'orderHistoryCtrl',
                roles: 3
            })
            .state('deliveriesHistory', {
                url: '/deliveryHistory',
                templateUrl: 'templates/deliveriesHistory.html',
                controller: 'deliveriesHistoryCtrl',
                roles: 3
            });
        $urlRouterProvider.otherwise('/dashboard');
    });