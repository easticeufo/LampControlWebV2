/**
 * Created by madongfang on 2016/8/25.
 */

//var testServerAddr = "http://192.168.31.163"; // 调试时指定的设备地址 "http://120.26.121.45"
var testServerAddr = ""; // 发布时使用空字符串

var lampControlWebApp = angular.module("lampControlWebApp",
    [
        "userLogin", "lampControlWebCtrls", "lampControlWebDirectives",
        "angular-md5" , "ui.router", "ui.bootstrap", "ui.bootstrap.datetimepicker", "ngFileUpload",
        "ngTable", "uiSwitch", "ngSanitize", "ui.select"
    ]);

lampControlWebApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state("login", {
            url: "/login",
            template: "<user-login do-login='doLogin(username, password)'></user-login>",
            controller: "LoginController"
        })
        .state("main", {
            url: "/main",
            templateUrl: "templates/main.html",
            controller: "MainController"
        })
        .state("main.lamp", {
            url: "/lamp",
            templateUrl: "templates/lamp.html",
            controller: "LampController"
        })
        .state("main.scene", {
            url: "/scene",
            templateUrl: "templates/scene.html",
            controller: "SceneController"
        })
        .state("main.sceneConfig", {
            url: "/scene/{index:int}",
            templateUrl: "templates/scene-config.html",
            controller: "SceneConfigController"
        })
        .state("main.key", {
            url: "/key",
            templateUrl: "templates/key.html",
            controller: "KeyController"
        })
        .state("main.keyConfig", {
            url: "/key/{index:int}",
            templateUrl: "templates/key-config.html",
            controller: "KeyConfigController"
        })
        .state("main.config", {
            url: "/config",
            templateUrl: "templates/config.html",
            controller: "ConfigController"
        })
        .state("main.config.system", {
            url: "/system",
            templateUrl: "templates/system.html",
            controller: "ConfigSystemController"
        })
        .state("main.config.time", {
            url: "/time",
            templateUrl: "templates/time.html",
            controller: "ConfigTimeController"
        })
        .state("main.config.user", {
            url: "/user",
            templateUrl: "templates/user.html"
        })
        .state("main.config.userConfig", {
            url: "/userConfig/{index:int}",
            templateUrl: "templates/user-config.html",
            controller: "UserConfigController"
        })
        .state("main.config.upgrade", {
            url: "/upgrade",
            templateUrl: "templates/upgrade.html",
            controller: "ConfigUpgradeController"
        });
});
