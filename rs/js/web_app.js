(function (window) {
    'use strict';

    web.ajax = function (para) {
        if (!web.c) throw new Error("[web error] web have not init yet.");
        var opts = {
            method: "post",
            dataType: "json",
            timeout: 20000,
            data: {}
        };
        $.extend(opts, para);
        opts = web.methods.ajax_opts(opts);

        if (!opts.data.hasOwnProperty('values'))
            opts.data = {values: opts.data};

        api.ajax(opts, function (ret, err) {
            if (ret) {
                web.methods.ajax_result(para.result, ret);
            } else {
                web.methods.ajax_result(para.result, {code: 400, msg: err.msg});
            }
        });
    };

    web.appLoad = function (vue) {

        if (typeof api == 'undefined') {
            window.apiready = function () {
                web.load(vue);
            };
        } else {
            web.load(vue);
        }
    };

})(this);

