/*!
 * web_app.js v0.0.2
 * (c) 2016 hnbtr
 * Released under the MIT License.
 */

function $EE() {
    window.require = function () {
    };
    window.module = {};
    window.exports = {};
}
/*support*/
__inline('./js/support.js');

/*jquery*/
__inline('./lib/jquery_2.2.4.js');

/*vue*/
__inline('./lib/vue_2.1.6.js');

/*fastclick*/
__inline('./lib/fastclick.js');

/*web*/
__inline('./js/web.js');

/*web_app*/
__inline('./js/web_app.js');

/*require*/
__inline('./lib/require_2.3.2.js');