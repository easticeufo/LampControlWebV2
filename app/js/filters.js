/**
 * Created by madongfang on 2016/8/28.
 */

lampControlWebFilters = angular.module("lampControlWebFilters", []);

lampControlWebFilters.filter("lampId", function () {
    return function (input) {
        var out = "（No.";
        if (typeof(input) == "number")
        {
            out += Math.floor(input / 256);
            out += "-";
            out += input % 256 + 1;
            out += ")";
            return out;
        }
        else
        {
            return input;
        }
    };
});

lampControlWebFilters.filter("keyId", function () {
    return function (input) {
        var out = "";
        if (typeof(input) == "number")
        {
            out += Math.floor(input / 256);
            out += "-";
            out += input % 256 + 1;
            return out;
        }
        else
        {
            return input;
        }
    };
});