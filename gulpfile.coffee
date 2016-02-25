gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
concat     = require 'gulp-concat'
iife       = require 'gulp-iife-wrap'
plumber    = require 'gulp-plumber'
del        = require 'del'
preprocess = require 'gulp-preprocess'

gulp.task 'default', ->
  gulp.start 'build'

dependencies = [{require: 'lodash'}, {require: 'yess', global: '_'}]

gulp.task 'build', ->
  gulp.src('source/__manifest__.coffee')
    .pipe plumber()
    .pipe preprocess()
    .pipe iife {dependencies, global: 'Concerns'}
    .pipe concat('coffee-concerns.coffee')
    .pipe gulp.dest('build')
    .pipe coffee()
    .pipe concat('coffee-concerns.js')
    .pipe gulp.dest('build')

gulp.task 'coffeespec', ->
  del.sync 'spec/**/*'
  gulp.src('coffeespec/**/*.coffee')
    .pipe coffee(bare: yes)
    .pipe gulp.dest('spec')
  gulp.src('coffeespec/support/jasmine.json')
    .pipe gulp.dest('spec/support')
