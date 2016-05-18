/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../lib/RongIMLib.d.ts"/>
module RongWebIMWidget {

    export class RongIMSDKServer {

        static $inject: string[] = ["$q"];

        constructor(private $q: ng.IQService) {

        }

        init(appkey: string) {
            RongIMLib.RongIMClient.init(appkey);
        }

        connect(token: string) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.connect(token, {
                onSuccess: function(data) {
                    defer.resolve(data);
                },
                onTokenIncorrect: function() {
                    defer.reject({ tokenError: true });
                },
                onError: function(errorCode) {
                    defer.reject({ errorCode: errorCode });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '连接超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION:
                            info = '不可接受的协议版本';
                            break;
                        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                            info = 'appkey不正确';
                            break;
                        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                            info = '服务器不可用';
                            break;
                        case RongIMLib.ConnectionState.NOT_AUTHORIZED:
                            info = '未认证';
                            break;
                        case RongIMLib.ConnectionState.REDIRECT:
                            info = '重新获取导航';
                            break;
                        case RongIMLib.ConnectionState.APP_BLOCK_OR_DELETE:
                            info = '应用已被封禁或已被删除';
                            break;
                        case RongIMLib.ConnectionState.BLOCK:
                            info = '用户被封禁';
                            break;
                    }
                    console.log("失败:" + info);
                }
            });

            return defer.promise;
        }

        setOnReceiveMessageListener(option: any) {
            RongIMLib.RongIMClient.setOnReceiveMessageListener(option);
        }

        setConnectionStatusListener(option: any) {
            RongIMLib.RongIMClient.setConnectionStatusListener(option);
        }

        sendReadReceiptMessage(targetId: string, type: number) {
            RongIMLib.RongIMClient.getInstance()
                .getConversation(Number(type), targetId, {
                    onSuccess: function(data) {
                        if (data) {
                            var read = RongIMLib.ReadReceiptMessage
                                .obtain(data.latestMessage.messageUId,
                                data.latestMessage.sentTime, "1");

                            this.sendMessage(type, targetId, read);
                        }
                    },
                    onError: function() {

                    }
                })
        }

        sendMessage(conver: number, targetId: string, content: any) {
            var defer = this.$q.defer();

            RongIMLib.RongIMClient.getInstance().sendMessage(+conver, targetId, content, {
                onSuccess: function(data) {
                    defer.resolve(data);
                },
                onError: function(errorCode, message) {
                    defer.reject({ errorCode: errorCode, message: message });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = "";
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            });

            return defer.promise;
        }


        reconnect(callback: any) {
            RongIMLib.RongIMClient.reconnect(callback);
        }

        disconnect() {
            RongIMLib.RongIMClient.getInstance().disconnect();
        }

        logout() {
            if (RongIMLib && RongIMLib.RongIMClient) {
                RongIMLib.RongIMClient.getInstance().logout();
            }
        }

        clearUnreadCount(type: number, targetid: string) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .clearUnreadCount(type, targetid, {
                    onSuccess: function(data) {
                        defer.resolve(data);
                    },
                    onError: function(error) {
                        defer.reject(error);
                    }
                });
            return defer.promise;
        }

        getTotalUnreadCount() {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getTotalUnreadCount({
                    onSuccess: function(num) {
                        defer.resolve(num);
                    },
                    onError: function() {
                        defer.reject();
                    }
                });
            return defer.promise;
        }

        getConversationList() {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getConversationList({
                    onSuccess: function(data) {
                        defer.resolve(data);
                    },
                    onError: function(error) {
                        defer.reject(error);
                    }
                }, null);
            return defer.promise;
        }

        getConversation: (type: number, targetId: string) => ng.IPromise<RongIMLib.Conversation>
        = (type: number, targetId: string) => {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().getConversation(Number(type), targetId, {
                onSuccess: function(data) {
                    defer.resolve(data);
                },
                onError: function() {
                    defer.reject();
                }
            });
            return defer.promise;
        }

        removeConversation(type: number, targetId: string) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .removeConversation(type, targetId, {
                    onSuccess: function(data) {
                        defer.resolve(data);
                    },
                    onError: function(error) {
                        defer.reject(error);
                    }
                });
            return defer.promise;
        }

        getHistoryMessages(type: number, targetId: string, num: number) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getHistoryMessages(type, targetId, null, num, {
                    onSuccess: function(data, has) {
                        defer.resolve({
                            data: data,
                            has: has
                        });
                    },
                    onError: function(error) {
                        defer.reject(error);
                    }
                })
            return defer.promise;
        }


        getDraft(type: number, targetId: string) {
            return RongIMLib.RongIMClient.getInstance()
                .getTextMessageDraft(type, targetId) || "";
        }

        setDraft(type: number, targetId: string, value: string) {
            return RongIMLib.RongIMClient.getInstance()
                .saveTextMessageDraft(type, targetId, value);
        }

        clearDraft(type: number, targetId: string) {
            return RongIMLib.RongIMClient.getInstance()
                .clearTextMessageDraft(type, targetId);
        }
    }

    angular.module("RongWebIMWidget")
        .service("RongIMSDKServer", RongIMSDKServer);
}
