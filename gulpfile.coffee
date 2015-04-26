gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
concat     = require 'gulp-concat'
iife       = require 'gulp-iife'
plumber    = require 'gulp-plumber'
del        = require 'del'

gulp.task 'default', ->
  gulp.start 'build'

dependencies = [
  name: 'lodash', as: '_'
]

gulp.task 'build', ->
  gulp.src('source/coffee-concerns.coffee')
    .pipe plumber()
    .pipe iife {dependencies}
    .pipe gulp.dest('build')
    .pipe coffee()
    .pipe concat('coffee-concerns.js')
    .pipe gulp.dest('build')

gulp.task 'coffeespec', ->
  del.sync 'spec/**/*.js'
  gulp.src('coffeespec/**/*.coffee')
    .pipe coffee(bare: yes)
    .pipe gulp.dest('spec')