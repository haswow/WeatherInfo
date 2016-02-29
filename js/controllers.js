'use strict';

/* Controllers */

angular.module('app.controllers', ['cgNotify']).
controller('HomeController', function($scope, notify, weatherService) {

        $scope.askedLocationCounter = 0;
        $scope.manual = false
        $scope.loaded = false
        $scope.loadError = false
        $scope.geoLoading = false
        $scope.weatherLoading = false

        $scope.getLocation = function() {
                if (navigator.geolocation) {
                        $scope.getCords()

                } else {
                        $scope.getManually()
                        $scope.manual = true
                }
        }

        $scope.getCords = function() {
                var geoOptions = {
                        timeout: 30 * 1000
                }
                $scope.geoLoading = true
                navigator.geolocation.getCurrentPosition($scope.handlePosition, $scope.handleError, geoOptions);
                $scope.askedLocationCounter++;
        }

        $scope.handleError = function(error) {
                $scope.geoLoading = false
                switch (error.code) {
                        case error.PERMISSION_DENIED:
                                notify({
                                        message: 'Permission denied to access geo location service'
                                });
                                $scope.getManually();
                                break;
                        case error.POSITION_UNAVAILABLE:
                                notify({
                                        message: 'Location information is unavailable'
                                });
                                $scope.getManually()
                                break;
                        case error.TIMEOUT:
                                notify({
                                        message: 'The request to get user location timed out'
                                });
                                if ($scope.askedLocationCounter < 2)
                                        $scope.getCords()
                                else
                                        $scope.getManually()
                                break;
                        case error.UNKNOWN_ERROR:
                        default:
                                notify({
                                        message: 'An unknown error occurred'
                                });
                                if ($scope.askedLocationCounter < 2)
                                        $scope.getCords()
                                else
                                        $scope.getManually()
                }
        }

        $scope.handlePosition = function(pos) {
                
                $scope.$apply(function() {
                        $scope.geoLoading = false
                $scope.weatherLoading = true
                })
                weatherService.byCords(pos.coords.latitude, pos.coords.longitude, $scope.showWeather)
        }

        $scope.getManually = function() {
                $scope.$apply(function() {
                        $scope.manual = true
                })
        }

        $scope.showWeather = function(data) {
            $scope.weatherLoading = false
                        $scope.data = data
                        if(data.cod=="200")
                        $scope.loaded = true
                    else
                        $scope.loadError = true
            
        }

        $scope.getCity = function() {
                $scope.reset()
                weatherService.byCity($scope.city, $scope.showWeather)
        }

        $scope.getPostcode = function() {
                $scope.reset()
                weatherService.byPostcode($scope.postcode,$scope.country, $scope.showWeather)
        }

        $scope.reset = function()
        {
            $scope.data = {}
            $scope.loadError = false
            $scope.loaded = false
            $scope.weatherLoading = true
        }


        $scope.getLocation()

})