(function () {
    var app = angular.module('app');
    app.controller('navController', ['$scope', '$rootScope', navController]);
    function navController($scope, $rootScope) {
        console.log('nav...')
    }
})();