(function (window) {
    var support = window.history && window.history.pushState && window.history.replaceState && window.localStorage && window.sessionStorage;
    if (!support) {
        document.body.innerHTML = '<div class="version-box"><div class="version-content"><h4><span>您的浏览器版本较低，不能正常显示网页，建议您升级浏览器。</span></h4></div></div>';
        throw new Error('Browser does not support');
    }
})(this);