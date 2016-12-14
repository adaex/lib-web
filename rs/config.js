module.exports = {
    isMin: false,
    version: '0.0.3',
    mode: 'replace',
    config: function (fis) {

        var time = new Date().toLocaleString();
        var rules = [{search: /\{version\}/g, replace: this.version}, {search: /\{time\}/g, replace: time}];
        var ext = this.isMin ? '.min.js' : '.js';

        fis.set('project.files', '/*.{js,html}')
            .match('/*', {
                parser: fis.plugin('replace', {rules: rules}),
                deploy: fis.plugin('local-deliver', {to: '../'}),
                release: "/rd/$0"
            })
            .match('/(*).js', {release: "/rd/" + this.version + "/$1" + ext});

        if (this.isMin) fis.match('/(*).js', {optimizer: fis.plugin('uglify-js', {comments: false})});

    }
};