fis.set('project.files', '/*.js')
    .match('/*.js', {
        deploy: fis.plugin('local-deliver', {to: '../'}),
        release: "/rd/$0"
    });

fis.media('build')
    .match('/(*).js', {
        optimizer: fis.plugin('uglify-js', {comments: false}),
        release: "/rd/$1.min.js"
    });