module.exports = {
    isMin: false,
    mode: 'replace',
    config: function (fis) {
        fis.set('project.files', '/*.js')
            .match('/*.js', {
                deploy: fis.plugin('local-deliver', {to: '../'}),
                release: "/rd/$0"
            });

        if (this.isMin) {
            fis.match('/(*).js', {
                optimizer: fis.plugin('uglify-js', {comments: false}),
                release: "/rd/$1.min.js"
            });
        }
    }
};