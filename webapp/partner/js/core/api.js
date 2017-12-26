(function () {
    angular
        .module('app.core')
        .factory('Api', ['$http', '$q', 'Notification', 'Foundation', Api]);
    function Api($http, $q, Notification, Const, Foundation) {

        var apiList = {
            package: {
                relateItem: '/b/packet/relate_packet_item.do',              //关联包裹内件
                outList: '/b/packet/packet_out_list.do',                    //获取出库包裹列表
                delDeclareItem: '/b/packet/delete_packet_declare_items.do', //删除包裹预报内件
                updCheckInItem: '/packet/update_packet_item.do',            //B端更新包裹入库内件
                updDeclareItem: '/b/packet/update_packet_declare_item.do',  //B端更新包裹预报内件
                addDeclare: '/b/packet/add_declare_packet.do',              //添加预报包裹
                outDetail: '/b/packet/get_packet_out_detail.do',            //获取 出库详情 || 欠费详情
                outFeeDetail: '/packet/get_packet_out_fee_detail.do',       //获取出库包裹费用详情
                list: '/b/packet/packet_list.do',                           //获取包裹列表
                detail: '/b/packet/get_packet_detail.do',                   //获取 预报详情 || 退货详情
                // discard: '/packet/discard/discard_packet_list.do',       //查询弃件包裹列表
                returnList: '/returns/return_list.do',                      //退件列表
                category: '/category/category_list.do',                   //类别列表
                confirmItem: '/packet/confirm_packet_items.do',             //审核确认包裹内件
                returnGoods: '/returns/return_goods.do',                       //包裹退件
                discardGoods: '/packet/discard/add_discard_packet_item.do',                              //包裹弃件
                unrelateItem: '/b/packet/unrelate_packet_item.do',           //解除关联包裹内件
                updateChannel: '/packet/update_packet_out_channel.do',               //更新出库包裹渠道
                addOutWidthItems: '/packet/add_packet_out_with_items.do',       //添加出库包裹_选择商品
                pay: '/pay/pay_order.do',                       //订单支付
                couponList:'/coupon/get_coupons_by_order.do'    //根据订单号获取可用的优惠券列表
            },
            user: {
                logout: '/login/logout.do',                              //登出
                info: '/partner/get_partner_info.do',
                edit: '/partner/update_partner.do',                                          //编辑账户信息
                updPassword: '/partner/update_password.do',
                payType: '/user/update_pay_type.do'
            },
            myGoods: {
                goodsList: '/item/partner_upc_item_list.do'        //我的商品库-商品列表
            },
            statement: {
                costList: '/packet/packet_out_fee_list.do',        //包裹费用列表
                getAutoPayStatus: '',                              //获取自动付款状态
                setAutoPayStatus: '',                              //设置自动付款状态
                getPay: '',                                        //支付宝支付
                tradeList: '/order/order_list.do',                 //交易明细列表
                packageCostInfo: ''                                //包裹费用详情(目前用的package里的出库费用详情)
            },
            qa: {
                add: '/qa/add_question.do',                          //添加问题
                categoryList: '/qa/qa_category_list.do',                //问题类型列表，用于select下拉框
                detail: '/qa/get_question.do',                       //问题详情
                statusList: '/qa/qa_status_list.do',                 //问题状态列表，用于select下拉框
                addAnswer: '/qa/add_answer.do',                      //添加回答/qa/get_question_by_bind_id.dose
                list: '/qa/question_list.do',                        //问题列表
                getPackageQuestion: '/qa/get_question_by_bind_id.do',        //根据绑定ID查询问题及回复
                recallQuestion: '/qa/recall_question.do'               //撤消问题

            },
            currency: {
                list: '/currency/currency_list.do'          //获取货币符号列表
            },
            address: {
                list: '/address/address_list.do',
                add: '/address/add_address.do',
                detail: '/address/get_address_detail.do',
                edit: '/address/update_address.do',
                delAddress: '/address/delete_address.do'
            },
            channel: {
                list: '/channel/channel_list.do'         //渠道列表
            },
            category: {
                list: '/category/category_list.do',       //类目列表
                allList: '/category/all_category_list.do',//所有类目
            },
            warehouse: {
                list: '/warehouse/country_warehouse_list.do', //仓库列表
                myList: '/warehouse/my_warehouse_address.do'     //我的海外仓地址
            },
            server: {
                list: '/service/service_list.do',    //服务列表
                typeList: '/service/service_type_list.do',       //服务类型列表
            }
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