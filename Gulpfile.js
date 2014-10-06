"user strict";
var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    refresh = require('gulp-livereload'),
    notify  = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    client  = require('tiny-lr')(),
    run  = require('gulp-run'),
    nodemon = require('gulp-nodemon'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    lr_port = 35728;


var paths = {
  scripts: ['!client/lib/**/*.js', 'client/**/*.js'],
  views: ['!client/lib/*.html', 'client/**/*.html', 'client/index.html']
};
var build = ['lint'];

gulp.task('html', function () {
  return gulp.src(paths.views)
    .pipe(plumber())
    .pipe(refresh(client))
    //.pipe(notify({message: 'Views refreshed'}));
});

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(refresh(client))
    //.pipe(notify({message: 'Lint done'}));
});

gulp.task('serve', function () {
  nodemon({script: './server.js', ignore: ['node_modules/**/*.js']})
    .on('restart', function () {
      refresh(client);
    });
});

gulp.task('live', function () {
  client.listen(lr_port, function (err) {
    if (err) {
      return console.error(err);
    }
  });
});

gulp.task('deploy', function () {
  gulp.src('client/index.html')
    .pipe(usemin({
      //assetsDir: 'client',
      js: [uglify(), 'concat']
    }))
    .pipe(gulp.dest('client'));
    return 1;
});

gulp.task('watch', function () {
  gulp.watch(paths.views, ['html']);
  gulp.watch(paths.scripts, ['lint']);
});

gulp.task('database', function() {
  var dir = 'backend/sql/'
  var tables = ['candidates', 'koch_contribs', 'koch_orgs', 'leadership_pacs', 'states', 'zipcode'];
  var live_tables = ['content', 'koch_assets'];

  tables.forEach(function(t) { 
    console.log("Dumping "+t+" table...");
    run('mysqldump -u root kochtracker '+t+' > '+dir+t+'.sql').exec()
  });
  console.log("Dumping schema....");
  run('mysqldump -d -u root kochtracker '+tables.join(' ') +' '+ live_tables.join(' ')+ '> '+dir+'schema.sql' ).exec()
})

gulp.task('build', build);

gulp.task('default', ['build', 'live', 'serve', 'watch']);
