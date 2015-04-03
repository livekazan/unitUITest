module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            concat_all: {
                files: {
                    'src/main/webapp/js/build/admin.library.js': [
                        'src/main/webapp/bower_components/angular/angular.js',
                        'src/main/webapp/bower_components/angular-i18n/angular-locale_ru.js',
                        'src/main/webapp/bower_components/angular-route/angular-route.js',
                        'src/main/webapp/bower_components/angular-bootstrap/ui-bootstrap.js',
                        'src/main/webapp/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                        'src/main/webapp/bower_components/angular-bootstrap-slider/slider.js',
                        'src/main/webapp/bower_components/jquery/dist/jquery.js',
                        'src/main/webapp/bower_components/bootstrap/dist/js/bootstrap.js',
                        'src/main/webapp/bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
                        'src/main/webapp/bower_components/seiyria-bootstrap-slider/js/bootstrap-slider.js',
                        'src/main/webapp/bower_components/metisMenu/dist/metisMenu.js',
                        'src/main/webapp/bower_components/ng-table/ng-table.js',
                        'src/main/webapp/bower_components/highcharts/highcharts.src.js',
                        'src/main/webapp/bower_components/highcharts-ng/dist/highcharts-ng.js',
                        'src/main/webapp/js/numericInput.js',
                        'src/main/webapp/js/sb-admin-2.js'
                    ],
                    'src/main/webapp/js/build/admin.modules.js': [
                        'src/main/webapp/view404/view404.js',
                        'src/main/webapp/viewAdmin/viewCurr/viewCurrent.js',
                        'src/main/webapp/viewAdmin/viewImport/viewImport.js',
                        'src/main/webapp/viewAdmin/viewMain/viewMain.js',
                        'src/main/webapp/viewAdmin/viewPoll/viewPoll.js',
                        'src/main/webapp/viewAdmin/viewTest/viewTest.js',
                        'src/main/webapp/viewAdmin/viewUser/viewUser.js',
                        'src/main/webapp/viewAdmin/viewStat/viewStat.js',
                        'src/main/webapp/viewAdmin/admin.js'
                    ],
                    'src/main/webapp/js/build/operator.library.js': [
                        'src/main/webapp/bower_components/angular/angular.js',
                        'src/main/webapp/bower_components/angular-i18n/angular-locale_ru.js',
                        'src/main/webapp/bower_components/angular-route/angular-route.js',
                        'src/main/webapp/bower_components/angular-bootstrap/ui-bootstrap.js',
                        'src/main/webapp/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                        'src/main/webapp/bower_components/angular-timer/dist/angular-timer.js',
                        'src/main/webapp/bower_components/jquery/dist/jquery.js',
                        'src/main/webapp/bower_components/bootstrap/dist/js/bootstrap.js'
                    ],
                    'src/main/webapp/js/build/operator.modules.js': [
                        'src/main/webapp/view404/view404.js',
                        'src/main/webapp/viewOperator/viewCurr/viewCurrent.js',
                        'src/main/webapp/viewOperator/viewMain/viewMain.js',
                        'src/main/webapp/viewOperator/operator.js'
                    ]
                }
            }
        },
        
        uglify: {
            uglify_all: {
                files: {
                    'src/main/webapp/js/build/admin.library.min.js': ['src/main/webapp/js/build/admin.library.js'],
                    'src/main/webapp/js/build/admin.modules.min.js': ['src/main/webapp/js/build/admin.modules.js'],
                    'src/main/webapp/js/build/operator.library.min.js': ['src/main/webapp/js/build/operator.library.js'],
                    'src/main/webapp/js/build/operator.modules.min.js': ['src/main/webapp/js/build/operator.modules.js']
                }
            }
        },

        cssmin: {
            target: {
                files: {
                    'src/main/webapp/css/build/admin.css': [
                        'src/main/webapp/bower_components/bootstrap/dist/css/bootstrap.css',
                        'src/main/webapp/bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css',
                        'src/main/webapp/bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.css',
                        'src/main/webapp/bower_components/font-awesome/css/font-awesome.css',
                        'src/main/webapp/bower_components/metisMenu/dist/metisMenu.css',
                        'src/main/webapp/bower_components/ng-table/ng-table.css',
                        'src/main/webapp/css/sb-admin-2.css',
                        'src/main/webapp/css/app.css'
                    ],
                    'src/main/webapp/css/build/operator.css': [
                        'src/main/webapp/bower_components/bootstrap/dist/css/bootstrap.css',
                        'src/main/webapp/bower_components/font-awesome/css/font-awesome.css',
                        'src/main/webapp/bower_components/metisMenu/dist/metisMenu.css',
                        'src/main/webapp/bower_components/ng-table/ng-table.css',
                        'src/main/webapp/css/app.css'
                    ]
                }
            }
        },

        watch: {
            scripts: {
                files: [
                    'src/main/webapp/view404/*.js',
                    'src/main/webapp/viewAdmin/**/*.js',
                    'src/main/webapp/viewOperator/**/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['src/main/webapp/css/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
    grunt.registerTask('minified', ['uglify', 'cssmin']);
    grunt.registerTask('watcher', ['watch']);

};