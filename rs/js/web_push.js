(function (window) {
    'use strict';

    var stateUrl = '';
    web.go = page_push;
    web.methods.page_start = false;
    web.methods.page_error = false;
    web.methods.page_end = false;

    function state_url(url) {
        if (url) return url.split('#')[0] === stateUrl;
        stateUrl = location.href.split('#')[0];
    }

    function get_state(url, callback) {
        var short_url = url.split('#')[0].replace(location.protocol + '//' + location.host, '');
        var state = web.sessionStore(short_url);
        if (state) {
            callback(state);
        } else {
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (ret) {
                    web.sessionStore(short_url, ret);
                    callback(ret);
                },
                error: function (e) {
                    if (web.methods.page_error) web.methods.page_error(e);
                    if (web.methods.page_end) web.methods.page_end();
                }
            });
        }
    }

    function page_push(url, type) {
        if (url === location.href) return;

        if (type === 'hash') {
            history_operate(url, type);
            return;
        }

        if (web.methods.page_start) web.methods.page_start();

        get_state(url, function (state) {
            history_operate(url, type);
            page_show(state);
        })
    }

    function history_operate(url, type) {
        switch (type) {
            case 'replace':
                window.history.replaceState(type, '', url);
                state_url();
                break;
            case 'hash':
                setTimeout(function () {
                    location.href = url;
                    state_url();
                }, 0);
                break;
            default:
                window.history.pushState(type, '', url);
                state_url();
        }
    }

    function page_show(state) {

        if (!(state && state.css && state.js)) return;

        var res_map_js = '', res_map_css = '', js_count = 0, divide = ',';

        function exec_script() {
            if (js_count > 0) return;
            state.script.forEach(function (s) {
                $('body').append(s);
            });
            document.title = state.title;
            if (web.methods.page_end) web.methods.page_end(state);
        }

        $('script:not([src])').remove();
        $('link[href]').each(function () {
            res_map_css += $(this).attr('href') + divide;
        });
        $('script[src]').each(function () {
            res_map_js += $(this).attr('src') + divide;
        });
        state.css.forEach(function (s) {
            if (res_map_css.indexOf(s + divide) < 0)
                web.loadCss(s);
        });
        state.js.forEach(function (s) {
            if (res_map_js.indexOf(s + divide) < 0) {
                js_count++;
                web.loadJs(s, function () {
                    js_count--;
                    exec_script();
                })
            }
        });

        exec_script();
    }

    window.onpopstate = function () {
        var url = location.href;
        if (!state_url(url)) {
            get_state(url, function (state) {
                page_show(state);
            });
        }
        state_url();
    };

    $(document).delegate('a', 'click', function (event) {
        var url = $(this).attr('href') + '';
        var type = $(this).attr('data-type') + '';
        if (url.indexOf('.html') > -1) {
            page_push(url, type);
            event.preventDefault();
        }
    });


})(this);