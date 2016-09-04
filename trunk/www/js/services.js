angular.module('app.services', [])

.factory('userprofileService', ['$http', function ($http) {

    var serviceBase =  apiServiceBase;
    var userprofileServiceFactory = {};

    var _getUserProfile = function () {

        return $http.get(serviceBase + 'api/v1/users/user/?rnd='+new Date().getTime()).then(function (results) {
            return results;
        });
    };

    var _setUserProfile = function (registration) {

        return $http.post(serviceBase + 'api/v1/users', registration).then(function (results) {
            return results;
        });
    };
    var _updateUserProfile = function (userData) {

        return $http.put(serviceBase + 'api/v1/users/', userData).then(function (results) {

            return results;
        });
    };
    var _addCreditCard = function (creditCard) {

        return $http.post(serviceBase + 'api/v1/users/user/creditcards', creditCard).then(function (results) {
            return results;
        });
    };
    var _deleteCreditCard = function (index) {

        return $http.delete(serviceBase + 'api/v1/users/user/creditcards/' + index).then(function (results) {

            return results;
        });
    };
    var _addLocation = function (userLocations) {

        return $http.post(serviceBase + 'api/v1/users/user/locations', userLocations).then(function (results) {
            return results;
        });
    };
    var _deleteLocation = function (index) {

        return $http.delete(serviceBase + 'api/v1/users/user/locations/' + index).then(function (results) {

            return results;
        });
    };
    var _addUserAddress = function (userAddresses) {

        return $http.post(serviceBase + 'api/v1/users/user/addresses', userAddresses).then(function (results) {
            return results;
        });
    };
    var _deleteUserAddress = function (index) {

        return $http.delete(serviceBase + 'api/v1/users/user/addresses/' + index).then(function (results) {

            return results;
        });
    };

    userprofileServiceFactory.getUserProfile = _getUserProfile;
    userprofileServiceFactory.setUserProfile = _setUserProfile;
    userprofileServiceFactory.updateUserProfile = _updateUserProfile;
    userprofileServiceFactory.addCreditCard = _addCreditCard;
    userprofileServiceFactory.deleteCreditCard = _deleteCreditCard;
    userprofileServiceFactory.addLocation = _addLocation;
    userprofileServiceFactory.deleteLocation = _deleteLocation;
    userprofileServiceFactory.addUserAddress = _addUserAddress;
    userprofileServiceFactory.deleteUserAddress = _deleteUserAddress;

    return userprofileServiceFactory;

}])

.service('se_locationService', [function () {
    var str_serviceBase =  apiServiceBase, ob_locationService = {}, ob_options = {
        maximumAge: 3600000,
        enableHighAccuracy: true
    }, fn_getPosition =  function (fn_successCallback, fn_errorCallback) {
        ob_options.timeout = 10000;
        navigator.geolocation.getCurrentPosition(fn_successCallback, fn_errorCallback, ob_options);
    }, fn_watchPosition = function (fn_successCallback, fn_errorCallback) {
        ob_options.timeout = 3000;
        navigator.geolocation.watchPosition(fn_successCallback, fn_errorCallback, ob_options);
    }, fn_setOptions = function (ob_configObj) {
        var key;
        for (key in ob_configObj) {
            if (ob_configObj.hasOwnProperty(key)) {
                ob_options[key] = ob_configObj[key];
            }
        }
    };
    ob_locationService.getPosition = fn_getPosition;
    ob_locationService.watchPosition = fn_watchPosition;
    ob_locationService.setOption = fn_setOptions;
    return ob_locationService;
}]);

