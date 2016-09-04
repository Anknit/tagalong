var locationService = function () {
    'use strict';
    var ob_locationService = {},
        ob_options = {
            maximumAge: 3600000,
            enableHighAccuracy: true
        },
        fn_getPosition = function (fn_successCallback, fn_errorCallback) {
            ob_options.timeout = 10000;
            navigator.geolocation.getCurrentPosition(fn_successCallback, fn_errorCallback, ob_options);
        },
        fn_watchPosition = function (fn_successCallback, fn_errorCallback) {
            ob_options.timeout = 3000;
            navigator.geolocation.watchPosition(fn_successCallback, fn_errorCallback, ob_options);
        },
        fn_setOptions = function (ob_configObj) {
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
};