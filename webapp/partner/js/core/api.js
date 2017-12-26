(function () {
    angular
        .module('app.core')
        .factory('Api', ['$http', '$q', 'Notification', 'Foundation', Api]);
    function Api($http, $q, Notification, Const, Foundation) {

        var apiList = {
            package: {
                getPlanList: '/b/packet/relate_packet_item.do',              //获取列表
            },
        };

        var api = {
            upload: '/upload/upload_file.do',
            uploadImg: '/upload/upload_image.do'
        };

        for (var moduleKey in apiList) {
            var moduleApiList = apiList[moduleKey];
            api[moduleKey] = {};
            for (var functionName in moduleApiList) {
                var config = moduleApiList[functionName];
                api[moduleKey][functionName] = (function (config) {
                    return function () {
                        var action = config;
                        return post(action, arguments[0]);
                    };
                })(config);
            }
        }

        return {
            NormalApi: api,
            post: post,
            get: get,
            apiList: apiList
        };

        function transformObjectToUrlencodedData(obj) {
            var p = [];
            for (var key in obj) {

                if (obj.hasOwnProperty(key)) {//obj.hasOwnProperty(key),检测key是否obj自有属性,若果不是自有属性(例如继承的属性,或不存在的属性),返回值false

                    p.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));//编码中文
                }
            }
            return p.join('&');//
        }

        function post(api, data) { //调用api,http请求
            var url = api;
            var dataHeader = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'};
            return $http({
                method: 'POST',
                url: url,
                data: transformObjectToUrlencodedData(data),
                headers: dataHeader
            }).then(function (response) {
                response = response.data;
                if (response.code == 'SUCCESS') {
                    return response;
                }
                Notification.error(response.message || '系统错误');
                $('loading').find('.spinner').addClass('ng-hide');
                return $q.reject(response);
            }, function (response) {
                $('loading').find('.spinner').addClass('ng-hide');
                Notification.error(response.message || '系统错误');
                return $q.reject(response);
            });
        }

        function get(url, data) {
            return $http({
                dataType: "json",
                method: "GET",
                params: data,
                url: url
            }).then(function (response) {
                    response = response.data;
                    if (response.code == 'SUCCESS') {
                        return response;
                    }
                    return $q.reject();
                },
                function (result) {
                    Notification.error(result.data.message || '系统错误');
                    return $q.reject(result);
                }
            );
        }
    }
})();