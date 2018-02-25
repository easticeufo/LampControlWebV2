/**
 * Created by madongfang on 2016/8/28.
 */

var lampControlWebDirectives = angular.module("lampControlWebDirectives", ["lampControlWebFilters"]);

/* 单灯模块 */
lampControlWebDirectives.directive("lcLamp", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            lampParam: "=param",
            changeName: "="
        },
        templateUrl: "templates/lc-lamp.html",
        link: function (scope, element, attrs) {
            scope.name = scope.lampParam.name || "未命名";
            scope.lampOn = scope.lampParam.on;

            if (scope.lampOn)
            {
                element.children().eq(0).addClass("lamp-on");
            }
            scope.changeState = function () {
                scope.lampParam.on = !scope.lampOn;
                scope.lampParam.$update(function () {
                    scope.lampOn = !scope.lampOn;
                    if (scope.lampOn)
                    {
                        element.children().eq(0).addClass("lamp-on");
                    }
                    else
                    {
                        element.children().eq(0).removeClass("lamp-on");
                    }
                }, function (response) {
                    alert("错误" + response.status + "：" + response.statusText);
                });
                
            };

            scope.$watch("changeName", function (newValue, oldValue, scope) {
                if (1 == newValue)
                {
                    scope.inputVisible = true;
                    element.children().eq(0).unbind("click");
                }
                else
                {
                    scope.inputVisible = false;
                    element.children().eq(0).bind("click", scope.changeState);
                }

                if (2 == newValue) // 取消
                {
                    scope.name = scope.lampParam.name || "未命名";
                }
                else if (3 == newValue) // 保存
                {
                    if (scope.name != "未命名" && scope.name != scope.lampParam.name)
                    {
                        scope.lampParam.name = scope.name;
                        scope.lampParam.$update();
                    }
                }
                else
                {

                }
            });
        }
    };
});

/* 场景模块 */
lampControlWebDirectives.directive("lcScene", function (Scene) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            sceneParam: "=param",
            config: "&goToConfig",
            deleteScene:"&"
        },
        templateUrl: "templates/lc-scene.html",
        link: function (scope, element, attrs) {
            scope.name = scope.sceneParam.name || "未命名";
            scope.triggerScene = function () {
                Scene.trigger({id:scope.sceneParam.id}, null, function () {
                    alert("trigger scene successfully");
                }, function (response) {
                    alert("错误" + response.status + "：" + response.statusText);
                });
            };
        }
    };
});
