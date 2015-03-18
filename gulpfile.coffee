gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
concat     = require 'gulp-concat'
preprocess = require 'gulp-preprocess'

gulp.task 'default', ->
  gulp.start 'build'

gulp.task 'build', ->
  gulp.src('source/bundle.coffee')
  .pipe preprocess()
  .pipe concat('coffee-concerns.coffee')
  .pipe gulp.dest('build')
  .pipe coffee()
  .pipe concat('coffee-concerns.js')
  .pipe gulp.dest('build')