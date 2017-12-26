(function () {
    angular
        .module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider', configRoute])
        .config(['$locationProvider', '$qProvider', 'NotificationProvider', configSce])
        .run(['$rootScope', '$state', '$ocLazyLoad', runCore]);

    function configRoute($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/package/planList');
        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });
        var apps = ['package'];
        var dictionary = [];
        var v = '?v=1.0.0';
        angular.forEach(apps, function (data) {
            var item = {};
            item.name = data;
            item.serie = true;
            item.files = [];
            var cssString = data + '.css';
            item.files.push('/css/dist/' + cssString);
            var jsString = data + '.js';
            item.files.push(('/js/dist/' + jsString));
            dictionary.push(item);
        });

        $ocLazyLoadProvider.config({
            modules: dictionary
        });

        (function initUiRouterState() {
            $stateProvider
                .state('package', {
                    abstract: true,
                    url: '/package',
                    templateUrl: '/views/holder/nav.html',
                    resolve: {
                        loadApp: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('package');
                        }]
                    }
                })
                .state('package.planList', {
                    url: '/planList',
                    templateUrl: '/views/app/package/planList.html',
                    controller: 'package.PlanListController'
                })
                .state('package.other', {
                    url: '/other',
                    templateUrl: '/views/app/package/other.html',
                    controller: 'package.OtherController'
                })
        })();

    }

    function configSce($locationProvider, $qProvider, NotificationProvider) {
        $locationProvider.hashPrefix('');
        // $qProvider.errorOnUnhandledRejections(false);
        NotificationProvider.setOptions({
            delay: 5000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
        //$locationProvider.html5Mode(true);
    }

    function runCore($rootScope, $state) {
        $rootScope.$state = $state;
    }
})();
// (function() {
//     angular
//         .module('app')
//         .config(['$stateProvider', '$urlRouterProvider',config]);
//
//     function config ($stateProvider, $urlRouterProvider) {
//         $urlRouterProvider.otherwise('/package/planList');
//         $stateProvider
//             .state('package', {
//                 abstract: true,
//                 url: '/package',
//                 templateUrl: '/views/holder/nav.html',
//                 resolve: {
//                     loadApp: ['$ocLazyLoad', function ($ocLazyLoad) {
//                         return $ocLazyLoad.load('package');
//                     }]
//                 }
//             })
//             .state('package.planList', {
//                 url: "/planList",
//                 templateUrl: "/views/app/package/planList.html",
//                 controller: 'package.PlanListController'
//             })
//     }
// })();