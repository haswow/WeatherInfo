'use strict';

/* Services module*/

angular.module('app.services', []).
factory('weatherService', ['$http',  function($http) {
    var weather = {};

    weather.byCords = byCords;
    weather.byCity = byCity;
    weather.byPostcode = byPostcode;

    return weather;

    function byCords(lat,lon, callback) {

        $http.get('http://api.openweathermap.org/data/2.5/weather?appid=24794ebf032e6e9d69acfefe4db1f418&units=metric&lat=' + lat + '&lon=' + lon)
            .success(function(response) {
                callback(response)
            });
    }

    function byCity(city, callback) {

        $http.get('http://api.openweathermap.org/data/2.5/weather?appid=24794ebf032e6e9d69acfefe4db1f418&units=metric&q=' + city)
            .success(function(response) {
                callback(response)
            });
    }

    function byPostcode(postcode,country, callback) {

        $http.get('http://api.openweathermap.org/data/2.5/weather?appid=24794ebf032e6e9d69acfefe4db1f418&units=metric&q=' + country + ',' + postcode)
            .success(function(response) {
                callback(response)
            });
    }

}])