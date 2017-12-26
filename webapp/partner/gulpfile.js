var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var clean = require('gulp-clean');
var cleanCss = require('gulp-clean-css');
var rev = require("gulp-rev");
var revFormat = require('gulp-rev-format');
var revReplace = require("gulp-rev-replace");
var less = require('gulp-less');
var fs = require("fs");
var path = require('path');
var appScriptsPath = './js/app';
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
            // baseDir:"../WEB-INF/thymeleaf/web/views"
        }
    });
});


gulp.task('build-lib-js', function () {
    return gulp.src([
        './lib/jquery/jquery.min.js',
        './lib/clamp/clamp.min.js',
        './lib/angular/angular.min.js',
        './lib/ocLazyLoad/ocLazyLoad.min.js',
        './lib/angular-ui-router/angular-ui-router.min.js',
        './lib/angular-ui-bootstrap/ui-bootstrap.js',
        './lib/angular-ui-bootstrap/ui-bootstrap-tpls.js',
        './lib/angular-ui-notification/angular-ui-notification.min.js',
        './lib/angular-ui-bootstrap/ui-bootstrap.min.js',
        './lib/ng-file-upload/ng-file-upload-all.min.js'
    ])
        .pipe(concat('lib.min.js', {newLine: '\r\n'}))
        .pipe(gulp.dest('js'));
});

gulp.task('build-core-js', function () {
    return gulp.src(['js/core/*.js', 'js/holder/*.js', 'js/dialog/*.js'])
        .pipe(uglify())
        .pipe(concat('core.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('build-app-js', function () {
    // 提取app中各个模块的js整合并压缩
    function getFolders(dir) {
        // 提取文件夹
        return fs.readdirSync(dir)
            .filter(function (file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    }

    var folders = getFolders(appScriptsPath);
    var tasks = folders.map(function (folder) {
        return gulp.src(path.join(appScriptsPath, folder, '/*.js'))
            .pipe(concat(folder + '.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./js/dist'))
    });
    return merge(tasks);
});

gulp.task('concat-js', ['build-lib-js', 'build-core-js'], function () {
    var bundle = gulp.src([
        './js/lib.min.js',
        './js/core.min.js'
    ])
        .pipe(concat('all.min.js', {newLine: '\r\n'}))
        .pipe(gulp.dest('js'));

    return merge(bundle);
});

// 编译less
gulp.task('build-lib-css', function () {
    return gulp.src([
        './lib/angular-ui-bootstrap/ui-bootstrap-csp.css',
        './lib/angular-ui-notification/angular-ui-notification.min.css'
    ])
        .pipe(concat('lib.min.css', {newLine: '\r\n'}))
        .pipe(gulp.dest('css'));
});

gulp.task('build-app-css', function () {
    // 提取app中各个模块的js整合并压缩
    function getFolders(dir) {
        // 提取文件夹
        return fs.readdirSync(dir)
            .filter(function (file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    }

    var folders = getFolders('./css/app');
    var tasks = folders.map(function (folder) {
        return gulp.src(path.join('./css/app', folder, '/*.less'))
            .pipe(concat(folder + '.less'))
            .pipe(less())
            .pipe(cleanCss())
            .pipe(gulp.dest('./css/dist'))
    });
    return merge(tasks);
});

gulp.task('build-core-less', function () {
    var tasks = [];
    var task2 = gulp.src('css/less/*.less')
        .pipe(less())
        .pipe(concat('core.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('css'));
    tasks.push(task2);
    var task3 = gulp.src('css/dialog/*.less')
        .pipe(less())
        .pipe(concat('dialog.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('css'));
    tasks.push(task3);
    var task4 = gulp.src('css/directive/*.less')
        .pipe(less())
        .pipe(concat('directive.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('css'));
    tasks.push(task4);
    return merge.apply(null, tasks);
});

gulp.task('concat-css', ['build-lib-css', 'build-core-less'], function () {
    var bundle = gulp.src([
        './css/lib.min.css',
        './css/core.min.css',
        './css/dialog.min.css',
        './css/directive.min.css'
    ])
        .pipe(concat('all.min.css', {newLine: '\r\n'}))
        .pipe(gulp.dest('css'));

    return merge(bundle);
});

gulp.task('rev', ['concat-js', 'concat-css'], function () {
    var bundle2 = gulp.src(['./js/all.min.js'])
        .pipe(rev())
        .pipe(revFormat({
            prefix: '.',
            suffix: '.cache',
            lastExt: false
        }))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./rev/js"));
    var bundle1 = gulp.src(['./css/all.min.css'])
        .pipe(rev())
        .pipe(revFormat({
            prefix: '.',
            suffix: '.cache',
            lastExt: false
        }))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./rev/css"));
    return merge(bundle1, bundle2);
});

gulp.task('add-version', ['rev'], function () {
    var manifest = gulp.src(["rev/css/rev-manifest.json", "rev/js/rev-manifest.json"]);

    function modifyUnreved(filename) {
        return filename;
    }

    function modifyReved(filename) {
        if (filename.indexOf('.cache') > -1) {
            const _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, "");
            const _filename = filename.replace(/\.[\w]*\.cache/, "");
            filename = _filename + "?v=" + _version;
            return filename;
        }
        return filename;
    }

    return gulp.src(['./index.html'])
        .pipe(replace(/(\.[a-z]+)\?(v=)?[^\'\"\&]*/g, "$1"))
        .pipe(revReplace({
            manifest: manifest,
            modifyUnreved: modifyUnreved,
            modifyReved: modifyReved
        }))
        .pipe(gulp.dest('./'));
});

//监听文件变化
gulp.task('default', ['concat-js', 'build-app-js', 'concat-css', 'build-app-css','browserSync'], function () {

    gulp.watch(['js/holder/*.js', 'js/core/*.js', 'js/dialog/*.js'], ['concat-js']).on('change',
        function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp.watch(['./js/app/**/*.js'], ['build-app-js']).on('change',
        function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp.watch(['css/app/**/*.less'], ['build-app-css']).on('change',
        function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp.watch(['css/less/*.less', 'css/dialog/*.less', 'css/directive/*.less'], ['concat-css']).on('change',
        function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});
//发布
gulp.task('release', ['concat-js', 'build-app-js', 'concat-css', 'build-app-css', 'add-version','browserSync']);