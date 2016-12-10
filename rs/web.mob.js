function $EE() {
    window.require = function () {
    };
    window.module = {};
    window.exports = {};
}
/*support*/
__inline('./js/support.js');

/*zepto*/
__inline('./lib/zepto_1.2.0.js');

/*vue*/
__inline('./lib/vue_2.1.4.js');

/*web*/
__inline('./js/web.js');

/*web.push*/
__inline('./js/web.push.js');

/*require*/
__inline('./lib/require_2.3.2.js');