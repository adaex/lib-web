(function (window) {
    'use strict';

    var web = {
        c: {auth: true, init: 0},
        v: {},
        m: {},
        methods: {
            $200: false,
            $400: false,
            $401: false,
            config_check: false
        }
    };

    window.web = web;
    window.$$ = web;

    web.log = function (info) {
        web.c.debug && console.log(info);
    };
    web.debug = function (info) {
        web.c.debug && console.debug(info);
    };

    web.loadCss = function (url) {
        var node = document.createElement('link');
        node.type = 'text/css';
        node.rel = 'stylesheet';
        node.href = url;
        document.getElementsByTagName('head')[0].appendChild(node);
    };

    web.loadJs = function (url, callback) {
        var node = document.createElement('script');
        node.type = 'text/javascript';
        node.src = url;
        if (callback) node.onload = callback;
        document.body.appendChild(node);
    };

    web.setConfig = function (config) {
        if (typeof config === "string") {
            try {
                config = JSON.parse(config);
            } catch (e) {
                throw new Error("web: config must be a json object");
            }
        }
        $.extend(web.c, config);
    };

    web.initConfig = function () {
        if (web.c.init < 1 || web.c.token === '') {
            if (web.c.auth) {
                var lc = web.localConfig();
                if (!lc || lc.access === '' || lc.token === '')
                    return false;
                $.extend(web.c, lc);
                if (web.methods.config_check && !web.methods.config_check())
                    return false;
            }
            if (!web.c.host) web.c.host = '';
            if (!web.c.res) web.c.res = '';
            if (!web.c.debug) web.c.debug = false;
            if (!web.c.access) web.c.access = '';
            if (!web.c.token) web.c.token = '';
            web.c.init = 1;
        } else
            web.c.init++;

        var url_query = {}, query_params = location.search.substr(1).split("&");
        for (var i = 0; i < query_params.length; i++) {
            var query_param = query_params[i].split("=");
            url_query[query_param[0]] = query_param[1];
        }
        web.c.path = location.pathname.substr(1).replace('.html', '').split('/');
        web.c.hash = location.hash.substr(1).split('/');
        web.c.query = url_query;
        return true;
    };

    web.initDebugConfig = function () {
        var is_dev = !!web.c.debug;
        Vue.config.silent = !is_dev;
        Vue.config.devtools = is_dev;
        if (!is_dev) {
            web.log = web.debug = function () {
            }
        }
    };

    web.localStore = function (key, value) {
        if (!key) return false;
        return value ? localStorage.setItem(key, JSON.stringify(value)) : JSON.parse(localStorage.getItem(key));

    };

    web.sessionStore = function (key, value) {
        if (!key) return false;
        return value ? sessionStorage.setItem(key, JSON.stringify(value)) : JSON.parse(sessionStorage.getItem(key));
    };

    web.localConfig = function (value) {
        return web.localStore('localConfig', value);
    };

    web.methods.ajax_opts = function (opts) {

        opts.result = {};

        if (web.c.auth && web.c.token !== '') {
            var auth = {Token: web.c.token, Access: web.c.access};
            web.c.auth === 'body' ? ($.extend(opts.data, auth)) : (opts.headers = auth);
        }
        opts.url.indexOf("http://") < 0 && (opts.url = web.c.host + opts.url);
        opts.url.indexOf(".json") < 0 && (opts.url += '.json');
        return opts;
    };

    web.methods.ajax_result = function (methods, data) {
        data = data || {code: 400, msg: "网络连接错误，请重试"};
        var code_name = '$' + data.code;
        if (methods[code_name]) methods[code_name](data);
        else if (web.methods[code_name]) web.methods[code_name](data);
        else throw new Error("code methods " + code_name + "() not exist");
        methods['$end'] && methods['$end']();
    };

    web.ajax = function (para, result) {

        if (!web.c) throw new Error("[web error] web have not init yet.");

        result = result || para.result || {};

        var opts = {
            type: "post",
            dataType: "json",
            timeout: 15000,
            data: {},
            success: function (data) {
                web.methods.ajax_result(result, data);
            },
            error: function () {
                web.methods.ajax_result(result);
            }
        };
        $.extend(opts, para);
        opts = web.methods.ajax_opts(opts);
        $.ajax(opts);
    };

    web.load = function (vue) {

        //初始化config
        if (!web.initConfig()) {
            web.methods.$401();
            return false;
        }
        web.initDebugConfig();

        //初始化数据
        if (web.c.init > 1) {
            web.v.$destroy();
            delete web.v;
            delete web.m;
        }

        //初始化vue数据
        vue.loaded();
        vue.data = web.m || {};

        //初始化hash_change事件
        web.onHashed = vue.hashed || false;
        web.onHashed && web.onHashed();

        //初始化Dom
        $("#app").remove();
        $('body').off().prepend("<div id='app'><div id='content'></div></div>");

        //初始化并挂载vue
        web.v = new Vue(vue);
        web.v.$mount('#content');

        return true;
    };

    window.onhashchange = function () {
        web.initConfig();
        web.onHashed && web.onHashed();
    };

})(this);