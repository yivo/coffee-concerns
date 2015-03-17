gulp   = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'

gulp.task 'default', ->
  gulp.start 'build'

gulp.task 'build', ->
  gulp.src('source/oop.coffee')
  .pipe(coffee())
  .pipe concat('oop.js')
  .pipe gulp.dest('build')