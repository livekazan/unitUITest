module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'src/main/webapp/bower_components/angular/angular.js',
      'src/main/webapp/bower_components/angular-route/angular-route.js',
      'src/main/webapp/bower_components/angular-mocks/angular-mocks.js',
      'src/main/webapp/bower_components/jquery/dist/jquery.js',
      'src/main/webapp/bower_components/ng-table/ng-table.js',
      'src/main/webapp/view*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
