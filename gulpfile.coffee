gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
concat     = require 'gulp-concat'
preprocess = require 'gulp-preprocess'
del        = require 'del'

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

gulp.task 'coffeespec', ->
  del.sync 'spec/**/*.js'
  gulp.src('coffeespec/**/*.coffee')
    .pipe coffee(bare: yes)
    .pipe gulp.dest('spec')