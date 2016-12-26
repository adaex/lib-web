/*!
 * web.js v{version}
 * (c) 2016 hnbtr
 * Released under the MIT License.
 */

function $EE() {
    window.require = function () {
    };
    window.module = {};
    window.exports = {};
    window.$$CONFIG = {};
}

/*jquery*/
__inline('./lib/jquery_2.2.4.js');

/*require*/
__inline('./lib/require_2.3.2.js');