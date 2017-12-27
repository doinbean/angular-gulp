/**
 * 广播方法封装
 */
(function () {
    angular
        .module('app.core')
        .factory('Foundation', ['$rootScope', '$state', Foundation]);

    function Foundation($rootScope, $state) {
        return {
            on: on,
            publish: publish,
            go: go,
            clone: clone,
            goLogin: goLogin,
            replaceSpecialSymbol: replaceSpecialSymbol,
            isObject: isObject,
        };

        function isObject(myobj) {
            var is = {
                types: ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"]
            };

            for (var i = 0, c; c = is.types[i++];) {
                is[c] = (function (type) {
                    return function (obj) {
                        return Object.prototype.toString.call(obj) == "[object " + type + "]";
                    };
                })(c)
            }
            return is.Object(myobj);
        }

        function clone(obj) {
            var o;
            if (typeof obj == "object") {
                if (obj === null) {
                    o = null;
                } else {
                    if (obj instanceof Array) {
                        o = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            o.push(clone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (var j in obj) {
                            o[j] = clone(obj[j]);
                        }
                    }
                }
            } else {
                o = obj;
            }
            return o;
        }

        function on(eventName, callback) {
            return $rootScope.$on(eventName, callback);
        }

        function publish(eventName, data) {
            return $rootScope.$broadcast(eventName, data);
        }

        function go(state, data) {
            var datas = data ? data : '';

            $state.go(state, {data: datas});
        }


        function goLogin() {

        }

        function replaceSpecialSymbol(obj) {
            var value = obj.replace(/[\r\n\t]/g, '');
            return value;
        }

    }
})();