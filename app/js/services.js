/**
 * Created by madongfang on 2016/8/25.
 */

var restfulApiService = angular.module("restfulApiService", ["ngResource"]);

restfulApiService.config(["$resourceProvider",
    function ($resourceProvider) {
        $resourceProvider.defaults.actions = {
            get: {method: 'GET', withCredentials: true},
            create: {method: 'POST', withCredentials: true},
            exec: {method: 'POST', withCredentials: true},
            query: {method: 'GET', isArray: true, withCredentials: true},
            update: {method: 'PUT', withCredentials: true},
            remove: {method: 'DELETE', withCredentials: true},
            delete: {method: 'DELETE', withCredentials: true}
        };
    }
]);

restfulApiService.factory("Lamp", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/lights/:id", {id: "@id"},
            {
                "on":{method:"POST", url:(testServerAddr + "/api/lights/on"), withCredentials: true},
                "off":{method:"POST", url:(testServerAddr + "/api/lights/off"), withCredentials: true}
            }
        );
    }
]);

restfulApiService.factory("Scene", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/scenes/:id", {id: "@id"},
            {
                "trigger":{method:"POST", url:(testServerAddr + "/api/scenes/:id/trigger"), withCredentials: true}
            });
    }
]);

restfulApiService.factory("Key", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/keys/:id", {id: "@id"});
    }
]);

restfulApiService.factory("SystemInfo", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/config/system");
    }
]);

restfulApiService.factory("SystemTime", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/config/time");
    }
]);

restfulApiService.factory("Reboot", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/reboot", null, {do:{method: 'POST', withCredentials: true}});
    }
]);

restfulApiService.factory("User", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/config/users/:id", {id: "@id"});
    }
]);

restfulApiService.factory("ApiLogin", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/login");
    }
]);

restfulApiService.factory("ApiLogout", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "/api/logout");
    }
]);