/**
 * Created by madongfang on 2016/8/25.
 */

var lampControlWebCtrls = angular.module("lampControlWebCtrls", ["restfulApiService"]);

lampControlWebCtrls.controller("MainController", ["$scope", "Lamp", "Scene", "Key", "$state", "ApiLogout",
        function ($scope, Lamp, Scene, Key, $state, ApiLogout) {
            $scope.state = $state;
            $scope.isCollapsed = true;
            $scope.lampList = Lamp.query(function () {
            });
            $scope.sceneList = Scene.query(function () {
            });
            $scope.keyList = Key.query(function () {
                $scope.hasKey = ($scope.keyList.length > 0);
            });

            var websocketAddr = "";
            if (testServerAddr == "")
            {
                websocketAddr = document.location.host;
            }
            else
            {
                websocketAddr = testServerAddr.substr("http://".length);
            }

            var ws = new WebSocket("ws://" + websocketAddr + "/websocket/statechange");

            ws.onopen = function () {
                console.log("websocket连接成功");
            };

            ws.onmessage = function (event) {
                switch (event.data)
                {
                    case "light":
                        Lamp.query().$promise.then(
                            function (data) {
                                $scope.lampList =  data;
                        });
                        break;
                    default :
                        console.log("unknow message");
                        break;
                }
            };

            ws.onclose = function (event) {
                console.log("websocket连接断开：" + event.reason);
            };

            ws.onerror = function () {
                alert("websocket连接失败");
            };

            $scope.doLogout = function () {
                ApiLogout.exec();
                ws.close();
            };
        }
    ]);

lampControlWebCtrls.controller("LampController", ["$scope", "Lamp",
    function ($scope, Lamp) {
        $scope.changeNameState = 0; // 0-初始状态 1-按下修改 2-按下取消 3-按下保存
        $scope.refresh = function ()
        {
            location.reload();
        };

        $scope.openAll = function ()
        {
            Lamp.on();
        };

        $scope.closeAll = function ()
        {
            Lamp.off();
        };
    }
]);

lampControlWebCtrls.controller("SceneController", ["$scope", "$state", "Scene",
    function ($scope, $state, Scene) {
        $scope.configScene = function (index) {
            $state.go("main.sceneConfig", {index:index});
        };
        $scope.addScene = function () {
            var newScene = Scene.create(function () {
                $scope.sceneList.push(newScene);
            }, function (response) {
                alert("错误" + response.status + "：" + response.statusText);
            });
        };

        $scope.deleteScene = function (index) {
            Scene.delete({id:$scope.sceneList[index].id}, null, function () {
                $scope.sceneList.splice(index, 1);
            }, function (response) {
                alert("错误" + response.status + "：" + response.statusText);
            });
        };
    }
]);

lampControlWebCtrls.controller("SceneConfigController", ["$scope", "$stateParams", "$filter",
    function ($scope, $stateParams, $filter) {
        /* 在场景关联的灯列表中查找并返回对应的灯信息 */
        function findSelectLampById (lampId)
        {
            var i = 0;
            var lamp = null;

            for (i = 0; i < $scope.scene.lights.length; i++)
            {
                if ($scope.scene.lights[i].id == lampId)
                {
                    lamp = $scope.scene.lights[i];
                    break;
                }
            }
            return lamp;
        }

        function getLampModuleList(lampList)
        {
            var lampModuleList = [];
            for (var i = 0; i < lampList.length; i++)
            {
                var moduleId = Math.floor(lampList[i].id / 256) + 1;
                for (var j = 0; j < lampModuleList.length; j++)
                {
                    if (moduleId == lampModuleList[j])
                    {
                        break;
                    }
                }
                if (j >= lampModuleList.length)
                {
                    lampModuleList.push(moduleId);
                }
            }
            return lampModuleList;
        }

        var i = 0;
        var lamp = null;

        $scope.select = {moduleIdList:[],triggerWday:[]};
        $scope.selectAll = false;
        $scope.$watch("selectAll", function (newValue, oldValue, scope) {
            if (newValue == oldValue)
            {
                return;
            }
            for (i = 0; i < $scope.selectLampList.length; i++)
            {
                if (newValue)
                {
                    $scope.selectLampList[i].checked = true;
                }
                else
                {
                    $scope.selectLampList[i].checked = false;
                }
            }
        });

        /* 定时触发相关 */
        $scope.weekNameList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        $scope.weekList = [0, 1, 2, 3, 4, 5, 6];
        $scope.scene = angular.copy($scope.sceneList[$stateParams.index]);
        if ($scope.scene.trigger_time.time != "" && ($scope.scene.trigger_time.wday.length != 0 || $scope.scene.trigger_time.date != ""))
        {
            $scope.timeFlag = true;
            $scope.triggerTime = $scope.scene.trigger_time.time;
            $scope.select.triggerWday = $scope.scene.trigger_time.wday;
            if ($scope.scene.trigger_time.date != "")
            {
                $scope.triggerDate = new Date($scope.scene.trigger_time.date);
            }
            else
            {
                $scope.triggerDate = null;
            }
        }
        else
        {
            $scope.timeFlag = false;
            $scope.triggerTime = "00:00";
            $scope.select.triggerWday = [];
            $scope.triggerDate = null;
        }

        $scope.lampModuleList = getLampModuleList($scope.lampList);

        $scope.$watch("select.moduleIdList", function (newValue, oldValue, scope) {
            var i = 0;
            if ($scope.select.moduleIdList.length == 0)
            {
                $scope.selectLampList = angular.copy($scope.lampList);
            }
            else
            {
                $scope.selectLampList = [];
            }
            for (i = 0; i < $scope.lampList.length; i++)
            {
                for (var j = 0; j < $scope.select.moduleIdList.length; j++)
                {
                    if (Math.floor($scope.lampList[i].id / 256) + 1 == $scope.select.moduleIdList[j])
                    {
                        $scope.selectLampList.push({id:$scope.lampList[i].id});
                        break;
                    }
                }
            }

            for (i = 0; i < $scope.selectLampList.length; i++)
            {
                $scope.selectLampList[i].on = false;
                $scope.selectLampList[i].checked = false;
                lamp = findSelectLampById($scope.selectLampList[i].id);
                if (lamp != null)
                {
                    $scope.selectLampList[i].checked = true;
                    $scope.selectLampList[i].on = lamp.on;
                }
            }
        });

        $scope.saveScene = function () {
            /* 场景定时 */
            if ($scope.timeFlag)
            {
                $scope.scene.trigger_time.time = $scope.triggerTime;
                if ($scope.triggerDate != null)
                {
                    $scope.scene.trigger_time.date = $filter("date")($scope.triggerDate, "yyyy-MM-dd");
                }
                else
                {
                    $scope.scene.trigger_time.date = "";
                }
                $scope.scene.trigger_time.wday = $scope.select.triggerWday;
            }
            else
            {
                $scope.scene.trigger_time.time = "";
                $scope.scene.trigger_time.date = null;
                $scope.scene.trigger_time.wday = [];
            }

            /* 场景关联的灯 */
            $scope.scene.lights = [];
            for (i = 0; i < $scope.selectLampList.length; i++)
            {
                if ($scope.selectLampList[i].checked)
                {
                    $scope.scene.lights.push({id:$scope.selectLampList[i].id, on:$scope.selectLampList[i].on});
                }
            }

            $scope.scene.$update(
                function ()
                {
                    $scope.sceneList[$stateParams.index] = $scope.scene;
                },
                function (response)
                {
                    alert("错误" + response.status + "：" + response.statusText);
                }
            );

        };
    }
]);

lampControlWebCtrls.controller("ConfigSystemController", ["$scope", "SystemInfo",
    function ($scope, SystemInfo) {
        $scope.systemInfo = SystemInfo.get();
    }
]);

lampControlWebCtrls.controller("ConfigTimeController", ["$scope", "SystemTime", "$interval", "dateFilter",
    function ($scope, SystemTime, $interval, dateFilter) {
        var timeNow = SystemTime.get(function () {
            $scope.deviceTimeNow = new Date(timeNow.utcTime);
            var timeoutId = $interval(function () {
                $scope.deviceTimeNow.setTime($scope.deviceTimeNow.getTime() + 1000);
            }, 1000);

            $scope.$on("$destroy", function () {
                $interval.cancel(timeoutId);
            });
        });

        $scope.setTime = new Date();
        $scope.$watch("setTime", function (newValue, oldValue, scope) {
            if ($scope.setTime instanceof Date)
            {
                $scope.setTimeString = dateFilter($scope.setTime, "yyyy-MM-dd HH:mm:ss");
            }
        });

        $scope.setSystemTime = function () {
            var momentSetTime = moment($scope.setTimeString, "YYYY-MM-DD HH:mm:ss");
            SystemTime.update({utcTime:momentSetTime.toISOString()}, function () {
                $scope.deviceTimeNow = new Date(momentSetTime.toISOString());
            }, function (response) {
                alert("错误" + response.status + "：" + response.statusText);
            });
        };
    }
]);

lampControlWebCtrls.controller("ConfigUpgradeController", ["$scope", "Upload", "Reboot",
    function ($scope, Upload, Reboot) {
        $scope.firmware = null;

        $scope.doUpgrade = function () {
            if (!($scope.firmware instanceof File))
            {
                alert("请选择升级文件");
                return;
            }

            Upload.http({
                url: testServerAddr + "/api/upgrade",
                headers : {
                    "Content-Type": $scope.firmware.type
                },
                data: $scope.firmware,
                withCredentials: true
            }).then(function (response) {
                    if (response.data.success) {
                        alert("升级成功，请重启设备");
                    }
                    else {
                        alert("升级失败：" + response.data.msg);
                    }
                }, function (response) {
                    alert("错误" + response.status + "：" + response.statusText);
                }
            );
        };

        $scope.doReboot = function () {
            Reboot.do(null, function () {
                // alert("重启成功");
            }, function (response) {
                alert("错误" + response.status + "：" + response.statusText);
            });
        };
    }
]);

lampControlWebCtrls.controller("ConfigController", ["$scope", "User",
    function ($scope, User) {
        $scope.userList = User.query();
    }
]);

lampControlWebCtrls.controller("UserConfigController", ["$scope", "$stateParams", "md5", "$state",
    function ($scope, $stateParams, md5, $state) {
        $scope.password = "";

        $scope.savePassword = function () {
            var userData = angular.copy($scope.userList[$stateParams.index]);
            userData.password = md5.createHash($scope.password);
            userData.$update(function () {
                $state.go("main.config.user");
            }, function (response) {
                alert("错误" + response.status + "：" + response.statusText);
            });
        }
    }
]);

lampControlWebCtrls.controller("LoginController", ["$scope", "ApiLogin", "md5", "$state",
    function ($scope, ApiLogin, md5, $state) {
        $scope.doLogin = function (username, password) {
            ApiLogin.exec({username: username, password: md5.createHash(password)},
                function (value) {
                    if (value.success) {
                        $state.go("main.lamp");
                    }
                    else {
                        alert("登录失败：" + value.msg);
                    }
                }, function (response) {
                    alert("错误" + response.status + "：" + response.statusText);
                }
            );
        };
    }
]);

lampControlWebCtrls.controller("KeyController", ["$scope", "Key", "$state", "NgTableParams",
        function ($scope, Key, $state, NgTableParams) {
            $scope.tableParams = new NgTableParams({},
                {
                    counts: [],
                    getData: function (params) {
                        return Key.query().$promise.then(function (data) {
                            return data;
                        }, function (response) {
                            alert(response.data.error);
                        });
                    }
                }
            );

            $scope.editKey = function (id) {
                $state.go("main.keyConfig", {index:id});
            };
        }
    ]
);

lampControlWebCtrls.controller("KeyConfigController", ["$scope", "Key", "Lamp", "Scene", "$state", "$stateParams",
        function ($scope, Key, Lamp, Scene, $state, $stateParams) {
            $scope.lampList = Lamp.query();
            $scope.sceneList = Scene.query();

            $scope.key = Key.get({id:$stateParams.index},
                function () {
                },
                function (response) {
                    alert(response.data.error);
                }
            );

            $scope.configKey = function () {
                if ($scope.key.bind.type == "")
                {
                    $scope.key.bind = {};
                }
                $scope.key.$update(function () {
                        $state.go("main.key");
                    },
                    function (response) {
                        alert(response.data.error);
                    }
                );
            };
        }
    ]
);