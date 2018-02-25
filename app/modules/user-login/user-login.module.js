/**
 * Created by madongfang on 2016/9/1.
 */

var userLogin = angular.module("userLogin", []);

userLogin.directive("userLogin", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {doLogin: "&"},
            templateUrl: "modules/user-login/user-login.template.html",
            link: function (scope, element, attrs) {
                element.find("input")[0].focus();

                scope.username = "";
                scope.password = "";
                scope.rememberMe = false;
                if (window.localStorage)
                {
                    if (localStorage.getItem("username") && localStorage.getItem("password"))
                    {
                        scope.username = localStorage.getItem("username");
                        scope.password = localStorage.getItem("password");
                        scope.rememberMe = true;
                    }
                }

                scope.login = function () {
                    if (scope.username === "")
                    {
                        alert("请输入用户名");
                        element.find("input")[0].focus();
                        return;
                    }
                    if (scope.password === "")
                    {
                        alert("请输入密码");
                        element.find("input")[1].focus();
                        return;
                    }

                    if (scope.rememberMe)
                    {
                        if (window.localStorage)
                        {
                            localStorage.setItem("username", scope.username);
                            localStorage.setItem("password", scope.password);
                        }
                        else
                        {
                            alert("该浏览器不支持“记住我”的功能，请使用最新版本的浏览器!");
                        }
                    }
                    else
                    {
                        if (window.localStorage)
                        {
                            localStorage.clear();
                        }
                    }

                    scope.doLogin({username:scope.username, password:scope.password});

                    scope.username = "";
                    scope.password = "";
                };
            }
        };
    }
);