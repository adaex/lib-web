(function (window) {
    'use strict';

    function page_push(url, type) {
        if (url == location.href) return;
        if (type == 'hash') {
            setTimeout(function () {
                location.href = url;
            }, 0);
            return;
        }

        if (web.methods.page_start) web.methods.page_start();
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (ret) {
                history_operate(ret, url, type == 'replace');
            },
            error: function (e) {
                if (web.methods.page_error) web.methods.page_error(e);
                if (web.methods.page_end) web.methods.page_end();
            }
        });
    }

    function history_operate(state, url, replace) {
        if (replace && replace == true)
            window.history.replaceState(state, '', url);
        else
            window.history.pushState(state, '', url);
        page_show(state);
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

    window.onpopstate = function (event) {
        page_show(event.state);
    };

    $(document).delegate('a', 'click', function (event) {
        var url = $(this).attr('href') + '';
        var type = $(this).attr('data-type') + '';
        if (url.indexOf('.html') > 0) {
            page_push(url, type);
            event.preventDefault();
        }
    });

    web.go = page_push;
    web.methods.page_start = false;
    web.methods.page_error = false;
    web.methods.page_end = false;

})(this);