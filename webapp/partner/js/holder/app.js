;(function () {
    var app = angular.module('app', [
        'ui.router',
        'oc.lazyLoad',
        'app.core',
        'ngFileUpload',
        'ui.bootstrap'
    ]);
    app.controller('MainController', ['$scope', '$rootScope', 'Core', MainController]);

    function MainController($scope, $rootScope, Core) {
        console.log('1111')
        $rootScope.prefix = "#";
    }
})();
