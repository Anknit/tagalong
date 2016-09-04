var dashboardCtrl = function ($scope, $rootScope, $ionicSideMenuDelegate, se_locationService, $window) {
    'use strict';
    $rootScope.side_menu.style.display = "none";
    $rootScope.authSuccess = true;
    $scope.locationObject = {
        coords: {
            latitude: 0,
            longitude: 0
        }
    };
    document.addEventListener("deviceready", function () {
        var mapDiv = document.getElementById("map_canvas"),
            map = $window.plugin.google.maps.Map.getMap(mapDiv, {
                'mapType': $window.plugin.google.maps.MapTypeId.ROADMAP,
                'controls': {
                    'myLocationButton': true,
                    'zoom': true
                },
                'gestures': {
                    'rotate': true,
                    'zoom': true
                }
            });
        map.setBackgroundColor('white');
        map.addEventListener($window.plugin.google.maps.event.MAP_READY, function () {
            se_locationService.getPosition(function (response) {
                var currentLocation = new $window.plugin.google.maps.LatLng(response.coords.latitude, response.coords.longitude);
                map.setZoom(15);
                map.setCenter(currentLocation);
            }, function (error) {});
        });
    });

};