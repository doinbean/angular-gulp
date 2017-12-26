(function () {
    angular.module('app.core').factory('Core', ['$rootScope', '$window', '$document', '$timeout', '$q', '$state',
        'Foundation','Api',  '$uibModal','Upload', 'Notification', Core]);

    function Core($rootScope, $window, $document, $timeout, $q, $state, Foundation,Api, $uibModal,Upload, Notification) {
        var Core = {
            on: Foundation.on,
            publish: Foundation.publish,
            go: Foundation.go,
            goHome: Foundation.goHome,
            replaceSpecialSymbol: Foundation.replaceSpecialSymbol,
            checkChineseOrEnglish: Foundation.checkChineseOrEnglish,
            $rootScope: $rootScope,
            $window: $window,
            $document: $document,
            $timeout: $timeout,
            $q: $q,
            $state: $state,
            Api: Api,
           // Const: Const,
            $uibModal: $uibModal,
            Upload: Upload,
            Notify: Notification,
            Foundation: Foundation,
            clone: Foundation.clone,
            checkIdCard: Foundation.checkIdCard
        };
        return Core;
    }
})();