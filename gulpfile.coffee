gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
concat     = require 'gulp-concat'
iife       = require 'gulp-iife'
del        = require 'del'

gulp.task 'default', ->
  gulp.start 'build'

gulp.task 'build', ->
  dependencies = lodash: '_'
  gulp.src('source/coffee-concerns.coffee')
    .pipe iife {type: 'coffee', dependencies}
    .pipe gulp.dest('build')
    .pipe coffee()
    .pipe concat('coffee-concerns.js')
    .pipe gulp.dest('build')

gulp.task 'coffeespec', ->
  del.sync 'spec/**/*.js'
  gulp.src('coffeespec/**/*.coffee')
    .pipe coffee(bare: yes)
    .pipe gulp.dest('spec')