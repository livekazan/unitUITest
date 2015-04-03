'use strict';

var view404 = angular.module('catiApp.view404', ['ngRoute']);

view404.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/404', {
    templateUrl: 'view404/view404.html',
    controller: 'Ctrl404'
  });
}]);

view404.controller('Ctrl404',[, function(){
  //Страница ошибки 404
}]);
'use strict';

var viewCurrent = angular.module('catiApp.viewCurrent', ['highcharts-ng']).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/current', {
    templateUrl: 'viewAdmin/viewCurr/viewCurrent.html',
    controller: 'ViewCurrentCtrl'
  });
}]);

viewCurrent.controller('ViewCurrentCtrl', ['$scope', '$rootScope', 'currService', 'ngTableParams',
    function($scope, $rootScope, currService, ngTableParams) { 
        $scope.currPollPage = -1;
        $scope.currTest = {};
        $scope.currPoll = {};
        $scope.currQuestion = {};

        $scope.initializeTest = function(id){
            currService.getTest(id).success(function(response){
                if(!response || !response.result) $rootScope.dialogAlertOpen();

                var result = angular.fromJson(response.result);
                if(!result['errorMessage']) {
                    $scope.currTest = result;
                } else $rootScope.dialogAlertOpen(result['errorMessage']);
            });
        };

        ($scope.initializeInterview = function(id){
            $rootScope.viewReviewId = id || $rootScope.viewReviewId;

            if(!$rootScope.viewReviewId){
                $rootScope.setLocationPath('/main');
                return;
            }

            if($rootScope.getLocationPath() != '/current'){
                $rootScope.setLocationPath('/current');
                return;
            }

            $scope.viewReviewId = id || $rootScope.viewReviewId;

            currService.getInterview($scope.viewReviewId).success(function(response){
                if(!response || !response.result) $rootScope.dialogAlertOpen();

                var result = angular.fromJson(response.result);
                if(!result['errorMessage']) {
                    $scope.currPoll = result;
                    $scope.currPollPage = -1;
                    $scope.chartConfigSexInit();
                    $scope.chartConfigAgeMaleInit();
                    $scope.chartConfigAgeFemaleInit();
                    $scope.initializeTest($scope.currPoll.testId);
                } else $rootScope.dialogAlertOpen(result['errorMessage']);
            });
        })();

        $scope.$watch('currPollPage', function(newValue){
            if(newValue>=0){
                $scope.currQuestion = $scope.currTest.questions[newValue];
            }
        });
        
        $scope.startQuestion = function(){
            $scope.currPollPage = 0;
        };

        $scope.endQuestion = function(){
            $scope.currPollPage = -1;
        };

        $scope.prevQuestion = function(){
            if($scope.currPollPage>0) $scope.currPollPage--;
        };

        $scope.nextQuestion = function(){
            if($scope.currPollPage<$scope.currTest.questions.length-1) {
                $scope.currPollPage = $scope.answerNextPage ? $scope.answerNextPage-1 : $scope.currPollPage + 1;
                $scope.answerNextPage = null;
            }
        };

        $scope.pickAnswerNextPage = function(answerNextPage){
            $scope.answerNextPage = answerNextPage;
        };

        $scope.chartConfigSexInit = function(){
            $scope.chartConfigSex.series = [];
            var totalNumber = $scope.currPoll.quotaPlanTemplateJSON.totalNumber;
            $scope.chartConfigSex.title.text =  '';
            var data = [{
                name: 'Женщины',
                y:  Math.round(parseFloat(totalNumber*$scope.currPoll.quotaPlanTemplateJSON.femalePercent/100))
            },{
                name: 'Мужчины',
                y: Math.round(parseFloat(totalNumber*$scope.currPoll.quotaPlanTemplateJSON.malePercent/100))
            }];
            $scope.chartConfigSex.series.push({
                name: 'Количество',
                dataLabels: {enabled: false},
                data: data
            });
        };

        $scope.chartConfigAgeMaleInit = function(){
            $scope.chartConfigAgeMale.series = [];
            $scope.chartConfigAgeMale.title.text =  '';
            var totalNumber = $scope.currPoll.quotaPlanTemplateJSON.totalNumber;
            var quotaTemplateJSONs = $scope.currPoll.quotaPlanTemplateJSON.quotaTemplateJSONs;
            var maleCount = Math.round(parseFloat(totalNumber*$scope.currPoll.quotaPlanTemplateJSON.malePercent/100));
            
            var data = [];
            for(var i=0; i<quotaTemplateJSONs.length; i++) {
                if(quotaTemplateJSONs[i].sex!='male') continue;
                var item = {
                    name: quotaTemplateJSONs[i].beginAge+' - '+quotaTemplateJSONs[i].endAge+' лет',
                    y: Math.round(parseFloat(maleCount*quotaTemplateJSONs[i].percent/100))
                };
                data.push(item);
            }
            
            $scope.chartConfigAgeMale.series.push({
                name: 'Количество',
                dataLabels: {enabled: false},
                data: data
            });
        };

        $scope.chartConfigAgeFemaleInit = function(){
            $scope.chartConfigAgeFemale.series = [];
            $scope.chartConfigAgeFemale.title.text =  '';
            var totalNumber = $scope.currPoll.quotaPlanTemplateJSON.totalNumber;
            var quotaTemplateJSONs = $scope.currPoll.quotaPlanTemplateJSON.quotaTemplateJSONs;
            var femaleCount = Math.round(parseFloat(totalNumber * $scope.currPoll.quotaPlanTemplateJSON.femalePercent / 100));

            var data = [];
            for(var i=0; i<quotaTemplateJSONs.length; i++) {
                if(quotaTemplateJSONs[i].sex!='female') continue;
                var item = {
                    name: quotaTemplateJSONs[i].beginAge+' - '+quotaTemplateJSONs[i].endAge+' лет',
                    y: Math.round(parseFloat(femaleCount*quotaTemplateJSONs[i].percent/100))
                };
                data.push(item);
            }

            $scope.chartConfigAgeFemale.series.push({
                name: 'Количество',
                dataLabels: {enabled: false},
                data: data
            });
        };

        $scope.removeInterviewFromList = function(index){
            $rootScope.viewReviews.splice(index, 1);
            $rootScope.viewReviewId = $rootScope.viewReviews.length ? $rootScope.viewReviews[0].id : 0;
            $scope.initializeInterview();
        };

        $scope.getTextClass = function(interviewState){
            return 'text-'+$scope.getTypeClass(interviewState);
        };

        $scope.getTypeClass = function(interviewState){
            var classes = {
                isEdited: 'info',
                isRunning: 'success',
                isEnded: 'danger'
            };
            return classes[interviewState] || 'info';
        };

        $rootScope.initializeInterview = $scope.initializeInterview;
        $rootScope.removeInterviewFromList = $scope.removeInterviewFromList;

        $scope.chartConfigSex = {
            options: {
                chart: {
                    type: 'pie'
                },
                plotOptions:{
                    pie: {
                        colors: (function () {
                            var colors = [], i = 0, male = '#428bca', female = '#d9534f';
                            colors.push(Highcharts.Color(female).brighten(0).get());
                            colors.push(Highcharts.Color(male).brighten(0).get());
                            return colors;
                        }())
                    }
                }
            },
            series: [],
            title: {},
            loading: false
        };
        
        $scope.chartConfigAgeMale = {
            options: {
                chart: {
                    type: 'pie'
                },
                plotOptions:{
                    pie: {
                        colors: (function () {
                            var colors = [], base = Highcharts.getOptions().colors[0], i;
                            for (i = 0; i < 10; i += 1) {
                                colors.push(Highcharts.Color('#428bca').brighten((i - 1) / 10).get());
                            }
                            return colors;
                        }())
                    }
                }
            },
            series: [],
            title: {},
            loading: false
        };

        $scope.chartConfigAgeFemale = {
            options: {
                chart: {
                    type: 'pie'
                },
                plotOptions:{
                    pie: {
                        colors: (function () {
                            var colors = [], base = Highcharts.getOptions().colors[3], i;
                            for (i = 0; i < 10; i += 1) {
                                colors.push(Highcharts.Color('#d9534f').brighten((i - 1) / 10).get());
                            }
                            return colors;
                        }())
                    }
                }
            },
            series: [],
            title: {},
            loading: false
        };
    }
]);

viewCurrent.service('currService',['$http', function($http){
    return {
        getTest: getTest,
        getInterview: getInterview
    };

    function getTest(id){
        var actionName = 'getTest';
        var params = { testId: id };
        return ajaxRequest(actionName, params);
    }

    function getInterview(id){
        var actionName = 'getInterview';
        var params = { interviewId: id };
        return ajaxRequest(actionName, params);
    }
    
    //стандартный ajax запрос
    function ajaxRequest(actionName, params) {
        var settings = {
            method: 'POST',
            url: actionName,
            params: params
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);
'use strict';

var viewMain = angular.module('catiApp.viewImport', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/import', {
    templateUrl: 'viewAdmin/viewImport/viewImport.html',
    controller: 'ViewImportCtrl'
  });
}]);

viewMain.controller('ViewImportCtrl', ['$scope', '$rootScope', 'importService', 'appService', function($scope, $rootScope, importService, appService) {
    $scope.modal = {};
    $scope.modal.city = $('#newCityModal');
    
    ($scope.getAllCity = function(){
        appService.getProperties(5).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.cityList = angular.fromJson(response.result);
            $scope.cityTemp = $scope.cityList[0];
        });
    })();
    
    $scope.deleteCity = function(){
        $rootScope.dialogConfirmOpen('Вы уверены, что хотите удалить телефонную базу?', function(){
            importService.deleteCity($scope).success(function(response){
                if(!response || !response.result) $rootScope.dialogAlertOpen();
                $scope.getAllCity();
            });
        });
    };

    $scope.addCity = function(){
        importService.addCity($scope).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.getAllCity();
            $scope.modal.city.modal('hide');
        });
    };

    $scope.importContacts = function(){
        $rootScope.dialogWaitingOpen('Подождите, идет загрузка контактов в систему...', 'Импортирование завершено');
        importService.importContacts($scope).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $rootScope.setWaitingFinish(response.result);
        });
    };
}]);

viewMain.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

viewMain.service('importService',['$http', function($http){
    return {
        addCity: addCity,
        deleteCity: deleteCity,
        importContacts: importContacts
    };

    function importContacts($scope){
        var actionName = 'importContacts';
        
        var params = {};
        params.cityId = $scope.cityTemp.index;
        
        var formData = new FormData();
        formData.append("excelFile", $scope.excelFile);
        formData.append("cityId", $scope.cityTemp.index);

        var httpRequest = $http.post(actionName, formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        httpRequest.error(errorRequest);
        
        return httpRequest;
        //return ajaxRequest(actionName, params, formData);
    }

    function addCity($scope){
        var actionName = 'addCity';
        var params = {};
        params.cityName = $scope.cityName;
        return ajaxRequest(actionName, params);
    }

    function deleteCity($scope){
        var actionName = 'deleteCity';
        var params = {};
        params.cityId = $scope.cityTemp.index;
        return ajaxRequest(actionName, params);
    }

    //стандартный ajax запрос
    function ajaxRequest(actionName, params, data) {
        var settings = {
            method: 'POST',
            url: actionName,
            params: params,
            data: data
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);
'use strict';

var viewMain = angular.module('catiApp.viewMain', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'viewAdmin/viewMain/viewMain.html',
    controller: 'ViewMainCtrl'
  });
}]);

viewMain.controller('ViewMainCtrl', ['$rootScope', '$scope', 'mainService', function($rootScope, $scope, mainService) {
    $scope.stat = {};
    
    ($scope.getMainStat = function(){
        mainService.getMainStat().success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();

            var result = angular.fromJson(response.result);
            if(!result['errorMessage']) {
                $scope.stat = result;
                $scope.chartConfigCityInit();
                $scope.chartConfigPollInit();
            } else $rootScope.dialogAlertOpen(result['errorMessage']);
        });
    })();

    $scope.chartConfigCityInit = function(){
        $scope.chartConfigCity.series = [];
        $scope.chartConfigCity.title.text =  '';
        
        var contactsCount = $scope.stat.contactsCount;
        var contacts = $scope.stat.contacts;

        var data = [];
        
        $.each(contacts, function(k, v){
            var item = {
                name: k,
                y: Math.round(parseFloat(v))
            };
            data.push(item);
        });

        $scope.chartConfigCity.series.push({
            name: 'Количество',
            dataLabels: {enabled: true},
            data: data
        });
    };
    
    $scope.chartConfigCity = {
        options: {
            chart: {
                type: 'pie',
                width: 400,
                height: 150
            }
        },
        series: [],
        title: {},
        loading: false
    };

    $scope.chartConfigPollInit = function(){
        $scope.chartConfigPoll.series = [];
        $scope.chartConfigPoll.title.text =  '';
        var interviews = $scope.stat.interviews;

        var data = [];
        $scope.chartConfigPoll.xAxis = {};
        $scope.chartConfigPoll.xAxis.categories = [];
        
        $.each(interviews, function(k, v){
            var item = {
                name: k,
                y: Math.round(parseFloat(v))
            };
            data.push(item);
            $scope.chartConfigPoll.xAxis.categories.push(k);
        });

        $scope.chartConfigPoll.series.push({
            name: 'Количество',
            showInLegend: false,
            dataLabels: {enabled: false},
            data: data
        });
    };

    $scope.chartConfigPoll = {
        options: {
            chart: {
                type: 'column',
                width: 400,
                height: 150
            }
        },
        series: [],
        title: {},
        yAxis: {
            title: {
                text: 'Кол-во'
            }
        },
        loading: false
    };
}]);

viewMain.service('mainService',['$http', function($http){
    return {
        getMainStat: getMainStat
    };

    function getMainStat(){
        var actionName = 'getMainStat';
        return ajaxRequest(actionName);
    }

    //стандартный ajax запрос
    function ajaxRequest(actionName, params) {
        var settings = {
            method: 'POST',
            url: actionName,
            params: params
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);
'use strict';

var viewPoll = angular.module('catiApp.viewPoll', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/poll', {
    templateUrl: 'viewAdmin/viewPoll/viewPoll.html',
    controller: 'ViewPollCtrl'
  });
}]);

viewPoll.controller('ViewPollCtrl', 
    ['$scope', '$rootScope', 'pollService', 'testService', 'userService', 'appService', 'ngTableParams',
        function($scope, $rootScope, pollService, testService, userService, appService, ngTableParams) {
            $scope.isView = false;
            $scope.pollTab = 0;
            $scope.quoteTab = 0;
            $scope.pollList = [];
            $scope.testList = [];
            $scope.cityList = [];
            $scope.format = 'dd.MM.yyyy';

            $scope.sliders = {};
            $scope.sliders.sliderValue = 0;
        
            $scope.modal = {};
            $scope.modal.poll = $('#newPollModal');
            $scope.modal.test = $('#pickTestModal');
            $scope.modal.city = $('#pickCityModal');
            $scope.modal.user = $('#pickUserModal');

            ($scope.getAllInterviews = function(){
                pollService.getAllInterviews().success(function(response){
                    if(!response || !response.result) $rootScope.dialogAlertOpen();
                    $scope.pollList = angular.fromJson(response.result)
                });
            })();
        
            ($scope.clearPoll = function(){
                $scope.pollTemp = {};
                $scope.pollTemp.userJSONList = [];
                $scope.pollTemp.quotaPlanTemplateJSON = {};
                $scope.pollTemp.quotaPlanTemplateJSON.quotaTemplateJSONs = [];
                $scope.pollTemp.quotaPlanTemplateJSON.malePercent = 50;
                $scope.pollTemp.quotaPlanTemplateJSON.femalePercent = 50;
            })();
        
            ($scope.getAllTests = function(){
                testService.getAllTests('isConfirm').success(function(response){
                    if(!response || !response.result) $rootScope.dialogAlertOpen();
                    $scope.testList = angular.fromJson(response.result)
                });
            })();

            ($scope.getAllCity = function(){
                appService.getProperties(5).success(function(response){
                    if(!response || !response.result) $rootScope.dialogAlertOpen();
                    $scope.cityList = angular.fromJson(response.result)
                });
            })();
        
            $scope.newPoll = function(){
                $scope.clearPoll();
                $scope.sliders.sliderValue = 50;
                $scope.modal.poll.modal('show');
            };
        
            $scope.pickTest = function(test){
                $scope.pollTemp.testId = test.id;
                $scope.pollTemp.testName = test.name;
                $scope.modal.test.modal('hide');
            };

            $scope.pickCity = function(city){
                $scope.pollTemp.cityId = city.index;
                $scope.pollTemp.cityName = city.name;
                $scope.modal.city.modal('hide');
            };
        
            $scope.openTestChange = function(){
                $scope.modal.test.modal('show');
            };

            $scope.openCityChange = function(){
                $scope.modal.city.modal('show');
            };
        
            $scope.pickUser = function(test){
                userService.addUser($scope).success(function(response){
                    if(!response || !response.result) $rootScope.dialogAlertOpen();

                    var result = angular.fromJson(response.result);
                    if(!result['errorMessage']) {
                        $scope.userTemp = result;
                        $scope.pollTemp.userJSONList.push(angular.copy($scope.userTemp));
                        $scope.userTemp = {};
                        $scope.modal.user.modal('hide');
                    } else $rootScope.dialogAlertOpen(result['errorMessage']);
                });
            };
        
            $scope.addInterview = function(){
                pollService.addInterview($scope).success(function(response){
                    if(!response || !response.result) $rootScope.dialogAlertOpen();

                    var result = angular.fromJson(response.result);
                    if(!result['errorMessage']) {
                        $scope.getAllInterviews();
                        $scope.modal.poll.modal('hide');
                    } else $rootScope.dialogAlertOpen(result['errorMessage']);
                });
            };
        
            $scope.pickUserOpen = function(){
                $scope.modal.user.modal('show');
            };
        
            $scope.removeUser = function(id, index){
                $rootScope.dialogConfirmOpen('Вы уверены, что хотите удалить интервьюера?', function(){
                    userService.removeUser(id).success(function(response){
                        if(!response || !response.result) $rootScope.dialogAlertOpen();

                        var result = angular.fromJson(response.result);
                        if(!result['errorMessage']) {
                            $scope.pollTemp.userJSONList.splice(index, 1);
                        } else $rootScope.dialogAlertOpen(result['errorMessage']);
                    });
                });
            };
        
            $scope.addMale = function(){
                var p = {};
                p.beginAge = $scope.maleBeginTemp;
                p.endAge = $scope.maleEndTemp;
                p.percent = 0;
                p.sex = 'male';
                $scope.pollTemp.quotaPlanTemplateJSON.quotaTemplateJSONs.push(p);
                $scope.maleBeginTemp = '';
                $scope.maleEndTemp = '';
            };
        
            $scope.addFemale = function(){
                var p = {};
                p.beginAge = $scope.femaleBeginTemp;
                p.endAge = $scope.femaleEndTemp;
                p.percent = 0;
                p.sex = 'female';
                $scope.pollTemp.quotaPlanTemplateJSON.quotaTemplateJSONs.push(p);
                $scope.femaleBeginTemp = '';
                $scope.femaleEndTemp = '';
            };
        
            $scope.removeQuoteAge = function(index){
                $scope.pollTemp.quotaPlanTemplateJSON.quotaTemplateJSONs.splice(index, 1);
            };
        
            $scope.savePoll = function(){
                $scope.pollList.push(angular.copy($scope.pollTemp));
                $scope.modal.poll.modal('hide');
            };

            $scope.calculateSumPercent = function(male){
                var m=0, f=0;
                var quotes = $scope.pollTemp.quotaPlanTemplateJSON.quotaTemplateJSONs;
                for (var i = 0; i < quotes.length; i++) {
                    if (quotes[i].sex=='male') m = m + parseFloat(quotes[i].percent);
                    if (quotes[i].sex=='female') f = f + parseFloat(quotes[i].percent);
                }
                
                return (male) ? m : f;
            };

            $scope.getBtnGroupClass = function(interviewState){
                return 'btn-'+$scope.getTypeClass(interviewState);
            };

            $scope.getAlertClass = function(interviewState){
                return 'alert-'+$scope.getTypeClass(interviewState);
            };

            $scope.getTypeClass = function(interviewState){
                var classes = {
                    isEdited: 'info',
                    isRunning: 'success',
                    isEnded: 'danger'
                };
                return classes[interviewState] || 'info';
            };
        
            $scope.editPoll = function(id){
                pollService.getInterview(id).success(function(response){
                    if(!response || !response.result) $rootScope.dialogAlertOpen();

                    $scope.pollTemp = angular.fromJson(response.result);
                    $scope.sliders.sliderValue = parseFloat($scope.pollTemp.quotaPlanTemplateJSON.malePercent);
                    $scope.modal.poll.modal('show');
                });
            };

            $scope.exportResults = function(id){
                pollService.exportResults(id);
            };

            $scope.runInterview = function(id){
                $rootScope.dialogConfirmOpen('Вы уверены, что хотите запустить опрос?', function(){
                    pollService.runInterview(id).success(function(response){
                        if(!response || !response.result) $rootScope.dialogAlertOpen();

                        var result = angular.fromJson(response.result);
                        if(!result['errorMessage']) {
                            $scope.getAllInterviews();
                        } else $rootScope.dialogAlertOpen(result['errorMessage']);
                    });
                });
            };

            $scope.endInterview = function(id){
                $rootScope.dialogConfirmOpen('Вы уверены, что хотите остановить опрос?', function(){
                    pollService.endInterview(id).success(function(response){
                        if(!response || !response.result) $rootScope.dialogAlertOpen();

                        var result = angular.fromJson(response.result);
                        if(!result['errorMessage']) {
                            $scope.getAllInterviews();
                        } else $rootScope.dialogAlertOpen(result['errorMessage']);
                    });
                });
            };

            $scope.viewInterview = function(poll){
                $rootScope.dialogConfirmOpen('Перейти к тестовому просмотру опроса?', function(){
                    if($rootScope.findJsonObjectsFirstLevel($rootScope.viewReviews, 'id', poll.id).length<=0){
                        $rootScope.viewReviews.push(poll);
                    }
                    $rootScope.viewReviewId = poll.id;
                    $rootScope.setLocationPath('/current');
                });
            };
        
            $scope.deleteInterview = function(id){
                $rootScope.dialogConfirmOpen('Вы уверены, что хотите удалить опрос?', function(){
                    pollService.deleteInterview(id).success(function(response){
                        if(!response || !response.result) $rootScope.dialogAlertOpen();

                        var result = angular.fromJson(response.result);
                        if(!result['errorMessage']) {
                            $scope.getAllInterviews();
                        } else $rootScope.dialogAlertOpen(result['errorMessage']);
                    });
                });
            };
        
            $scope.tablePollParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.pollList.length, // length of data
                getData: function($defer, params) {
                    $scope.tablePollParams.total($scope.pollList.length);
                    $defer.resolve($scope.pollList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $scope.tablePollParams.settings().$scope = $scope;
        
            $scope.$watchCollection('pollList', function(newValue){
                if(newValue) $scope.tablePollParams.reload();
            });
        
            $scope.tableUserParams = new ngTableParams({
                page: 1,            // show first page
                count: 5           // count per page
            }, {
                total: $scope.pollTemp.userJSONList.length, // length of data
                getData: function($defer, params) {
                    $scope.tableUserParams.total($scope.pollTemp.userJSONList.length);
                    $defer.resolve($scope.pollTemp.userJSONList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $scope.tableUserParams.settings().$scope = $scope;
        
            $scope.$watchCollection('pollTemp.userJSONList', function(newValue){
                if(newValue) $scope.tableUserParams.reload();
            });
        
            $scope.tableTestParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.testList.length, // length of data
                getData: function($defer, params) {
                    $scope.tableTestParams.total($scope.testList.length);
                    $defer.resolve($scope.testList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $scope.tableTestParams.settings().$scope = $scope;
        
            $scope.$watchCollection('testList', function(newValue){
                if(newValue) $scope.tableTestParams.reload();
            });

            $scope.tableCityParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.cityList.length, // length of data
                getData: function($defer, params) {
                    $scope.tableCityParams.total($scope.cityList.length);
                    $defer.resolve($scope.cityList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $scope.tableCityParams.settings().$scope = $scope;

            $scope.$watchCollection('cityList', function(newValue){
                if(newValue) $scope.tableCityParams.reload();
            });
        
            $scope.dateOptions = {
                formatYear: 'yy',
                showWeeks: false,
                startingDay: 1
            };
        
            $scope.openS = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
        
                $scope.openedS = true;
            };
        
            $scope.openE = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
        
                $scope.openedE = true;
            };
        
            $scope.testOptions = {
                min: 0,
                max: 100,
                step: 1
            };
        
            $scope.percentFormater = function(value) {
                return value + "%";
            };
        
            $scope.$watchCollection('sliders', function(newValue){
                if($scope.pollTemp && $scope.pollTemp.quotaPlanTemplateJSON) {
                    $scope.pollTemp.quotaPlanTemplateJSON.malePercent = parseFloat(newValue.sliderValue);
                    $scope.pollTemp.quotaPlanTemplateJSON.femalePercent = 100-parseFloat(newValue.sliderValue);
                }
            });

            $scope.$watchCollection('pollTemp', function(newValue){
                if(newValue!=null) {
                    $scope.isView = newValue.interviewState && (newValue.interviewState!='isEdited');
                }
            });
}]);

viewPoll.service('pollService',['$http', function($http){
    return {
        addInterview: addInterview,
        getInterview: getInterview,
        runInterview: runInterview,
        endInterview: endInterview,
        exportResults: exportResults,
        deleteInterview: deleteInterview,
        getAllInterviews: getAllInterviews
    };

    function addInterview($scope){
        var actionName = 'addInterview';
        var data = {json: $scope.pollTemp};
        return ajaxRequest(actionName, null, data);
    }

    function exportResults(id){
        var actionName = 'exportResults';
        var params = 'interviewId='+id;
        return hrefRequest(actionName, params);
    }

    function getInterview(id){
        var actionName = 'getInterview';
        var params = { interviewId: id };
        return ajaxRequest(actionName, params);
    }

    function runInterview(id){
        var actionName = 'runInterview';
        var params = { interviewId: id };
        return ajaxRequest(actionName, params);
    }

    function endInterview(id){
        var actionName = 'endInterview';
        var params = { interviewId: id };
        return ajaxRequest(actionName, params);
    }

    function deleteInterview(id){
        var actionName = 'deleteInterview';
        var params = { interviewId: id };
        return ajaxRequest(actionName, params);
    }

    function getAllInterviews(interviewState){
        interviewState = interviewState || 'all';
        var actionName = 'getAllInterviews';
        var params = { interviewState: interviewState };
        return ajaxRequest(actionName, params);
    }

    function hrefRequest(actionName, params) {
        window.location = actionName + '?' + params;
    }

    //стандартный ajax запрос
    function ajaxRequest(actionName, params, data) {
        var settings = {
            method: 'POST',
            url: actionName,
            params: params,
            data: data
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);
'use strict';

var viewTest = angular.module('catiApp.viewTest', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test', {
    templateUrl: 'viewAdmin/viewTest/viewTest.html',
    controller: 'ViewTestCtrl'
  });
}]);

viewTest.controller('ViewTestCtrl', ['$scope', '$rootScope', 'testService', 'appService', 'ngTableParams', function($scope, $rootScope, testService, appService, ngTableParams) {
    var $toggleTest = $("#toggleTest");

    $scope.testTab = 0;
    $scope.askNameTemp = '';
    $scope.isView = false;
    $scope.isDeleted = false;
    $scope.documentStateFirst = false;
    $scope.questionTypes =[];

    $scope.testList = [];
    $scope.testTemp = {};
    $scope.questionTemp = {};

    $scope.modal = {};
    $scope.modal.test = $('#newTestModal');
    $scope.modal.question = $('#newAskModal');

    ($scope.clearQuestion = function(){
        $scope.questionTemp = {};
        $scope.questionTypeTemp = $scope.questionTemp.questionType;
        $scope.questionTemp.answers = [];
    })();

    ($scope.clearTest = function(){
        $scope.testTemp = {};
        $scope.testTemp.documentState = 'Черновик';
        $scope.testTemp.questions = [];
    })();

    ($scope.getAllTests = function(){
        testService.getAllTests().success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.testList = angular.fromJson(response.result)
        });
    })();
    
    ($scope.getAllCity = function(){
        appService.getProperties(2).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.questionTypes = angular.fromJson(response.result);
            $scope.questionTypeTemp = $scope.questionTypes[0];
        });
    })();

    $scope.tableTestParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.testList.length, // length of data
        getData: function($defer, params) {
            $scope.tableTestParams.total($scope.testList.length);
            $defer.resolve($scope.testList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.tableTestParams.settings().$scope = $scope;

    $scope.tableQuestionParams = new ngTableParams({
        page: 1,            // show first page
        count: 3           // count per page
    }, {
        total: $scope.testTemp.questions.length, // length of data
        getData: function($defer, params) {
            $scope.tableQuestionParams.total($scope.testTemp.questions.length);
            $defer.resolve($scope.testTemp.questions.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.tableQuestionParams.settings().$scope = $scope;

    $scope.addAsk = function(notRead){
        notRead = notRead || false;
        if($scope.isAge){
            var interval = ($scope['askAgeEndTemp']<100)
                ? $scope['askAgeBeginTemp'] + ' - ' + $scope['askAgeEndTemp'] + ' лет'
                : $scope['askAgeBeginTemp'] + ' и старше';
            var askTemp = { name: interval };
            $scope.questionTemp.answers.push(askTemp);
            $scope['askAgeBeginTemp'] = '';
            $scope['askAgeEndTemp'] = '';
            return;
        }

        var askTemp = { name: $scope['askNameTemp'], notRead: notRead };
        $scope.questionTemp.answers.push(askTemp);
        $scope['askNameTemp'] = '';
    };

    $scope.removeTest = function(testId, $event){
        $event.stopPropagation();
        $rootScope.dialogConfirmOpen('Вы уверены, что хотите удалить анкету?', function(){
            testService.deleteTest(testId).success(function(response){
                if(!response || !response.result) $rootScope.dialogAlertOpen();
                var result = angular.fromJson(response.result);
                if(!result['errorMessage']) {
                    $scope.getAllTests();
                } else $rootScope.dialogAlertOpen(result['errorMessage']);
            });
        });
    };

    $scope.revertEditTest = function(state){
        var testId = $scope.testTemp.id;

        if(!testId) return;

        $rootScope.dialogWaitingOpen();

        testService.revertEditTest(testId, !state).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            var result = angular.fromJson(response.result);
            if(!result['errorMessage']) {
                $scope.testTemp = result;
                $scope.getAllTests();
            } else {
                $toggleTest.bootstrapSwitch('state', false);
                $rootScope.dialogAlertOpen(result['errorMessage']);
            }

            $rootScope.dialogWaitingClose();
        });
    };

    $scope.removeQuestion = function(num, $event){
        $event.stopPropagation();
        $rootScope.dialogConfirmOpen('Вы уверены, что хотите удалить вопрос?', function(){
            $scope.testTemp.questions[num].deleted = true;
        });
    };

    $scope.removeAsk = function(num){
        $scope.questionTemp.answers[num].deleted = true;
    };

    $scope.questionAnswersLength = function(question){
        var count = 0;
        var l = question.answers.length;
        for(var i=0; i<l; i++){
            if(question.answers[i].deleted) continue;
            count++;
        }
        return count;
    };

    $scope.newTest = function(){
        $scope.clearTest();
        $scope.testTab = 0;
        $toggleTest.bootstrapSwitch('state', true);
        $scope.modal.test.modal('show');
    };

    $scope.newQuestion = function(){
        $scope.clearQuestion();
        $scope.questionTypeTemp = $scope.questionTypes[0];
        $scope.modal.question.modal('show');
    };

    $scope.editQuestion = function(question){
        $scope.questionTemp = angular.copy(question);
        $scope.questionTypeTemp = $rootScope.findJsonObjects($scope.questionTypes,
            'index',$scope.questionTemp.questionType)[0];
        $scope.modal.question.modal('show');
    };

    $scope.editTest = function(test){
        $scope.testTab = 0;
        $scope.testTemp = angular.copy(test);
        var state = $scope.testTemp.documentState=='Черновик';
        $scope.documentStateFirst = $toggleTest.bootstrapSwitch('state')!=state;
        $toggleTest.bootstrapSwitch('state', state);
        $scope.modal.test.modal('show');
    };

    $scope.saveQuestion = function(num){
        $scope.questionTemp.questionType = $scope.questionTypeTemp.index;
        $scope.questionTemp.questionTypeStr = $scope.questionTypeTemp.name;
        var cloneObject = angular.copy($scope.questionTemp);
        if(!cloneObject.indexOrder) {
            var indexOrder = $scope.testTemp.questions.length;
            cloneObject.indexOrder = indexOrder + 1;
            $scope.testTemp.questions.push(cloneObject);
        } else {
            var findObject =  $rootScope.findJsonObjectsFirstLevel($scope.testTemp.questions, 'indexOrder', $scope.questionTemp.indexOrder)[0];
            var index = $scope.testTemp.questions.indexOf(findObject);
            if(index>=0) $scope.testTemp.questions[index] = cloneObject;
        }
        $scope.modal.question.modal('hide');
        $scope.modal.test.modal('show');
    };

    $scope.saveTest = function(){
        $scope.testTemp.documentState = $toggleTest.bootstrapSwitch('state') ? 'Черновик' : 'Завершен';
        testService.addTest($scope).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            var result = angular.fromJson(response.result);
            if(!result['errorMessage']) {
                $scope.testTemp = result;
                $scope.getAllTests();
            } else $rootScope.dialogAlertOpen(result['errorMessage']);
        });
    };

    $scope.saveTestAndClose = function(){
        $scope.saveTest();
        $scope.modal.test.modal('hide');
    };

    $scope.cutText = function(text){
        var maxValue = 40;
        var lengthCut = text.length<maxValue ? text.length : maxValue;
        var postfixCut = text.length<maxValue ? '' : '...';
        return text.substring(0, lengthCut) + postfixCut;
    };

    $scope.$watchCollection('testTemp.questions', function(newValue){
        if(newValue) $scope.tableQuestionParams.reload();
    });

    $scope.$watchCollection('testList', function(newValue){
        if(newValue) $scope.tableTestParams.reload();
    });

    $scope.$watch('testTemp.documentState', function(newValue){
        if(newValue) {
            $scope.isView = (newValue != 'Черновик');
            $scope.isDeleted = (newValue == 'Удален');
        }
    });

    $scope.$watch('questionTypeTemp', function(newValue){
        if(newValue) {
            $scope.isSex = false;
            $scope.isAge = false;
            if(newValue.index=='sex'){
                $scope.questionTemp.answers = [];
                $scope.questionTemp.answers.push({name: 'Мужской'});
                $scope.questionTemp.answers.push({name: 'Женский'});
                $scope.questionTemp.name = 'Ваш пол';
                $scope.isSex = (newValue.index=='sex');
            }
            if(newValue.index=='age'){
                $scope.questionTemp.name = 'В какой интервал попадает Ваш возраст?';
                $scope.isAge = (newValue.index=='age');
            }
        }
    });
    
    $scope.$watchCollection('testTemp.questions', function(newValue, oldValue){
        if(newValue.length!=oldValue.length){
            for(var i=0; i<newValue.length;i++){
                newValue[i].indexOrder = i+1;
            }
        }
    });

    $scope.$watchCollection('questionTemp.answers', function(newValue, oldValue){
        if(newValue.length!=oldValue.length){
            for(var i=0; i<newValue.length;i++){
                newValue[i].linkIndexOrder = newValue[i].linkIndexOrder || 1;
            }
        }
    });

    $toggleTest.bootstrapSwitch().on('switchChange.bootstrapSwitch', function(event, state) {
        if(!$scope.$$phase) $scope.$apply(function() { $scope.isView = !state; });
        else $scope.isView = !state;

        if($scope.documentStateFirst) {
            $scope.documentStateFirst = false;
        } else $scope.revertEditTest(state);
    });

}]);

viewTest.service('testService',['$http', function($http){
    return {
        addTest: addTest,
        deleteTest: deleteTest,
        getAllTests: getAllTests,
        revertEditTest: revertEditTest
    };

    function addTest($scope){
        var actionName = 'addTest';
        var data = { json: $scope.testTemp };
        return ajaxRequest(actionName, null, data);
    }

    function deleteTest(testId){
        var actionName = 'deleteTest';
        var params = { testId: testId };
        return ajaxRequest(actionName, params);
    }

    function revertEditTest(testId, confirmTest){
        return confirmTest
            ? confirmTestVariant(testId) 
            : revertEditTestVariant(testId);
    }

    function confirmTestVariant(testId){
        var actionName = 'confirmTest';
        var params = { testId: testId };
        return ajaxRequest(actionName, params);
    }

    function revertEditTestVariant(testId){
        var actionName = 'revertEditTest';
        var params = { testId: testId };
        return ajaxRequest(actionName, params);
    }

    function getAllTests(documentState){
        documentState = documentState || 'all';
        var actionName = 'getAllTests';
        var params = { documentState: documentState };
        return ajaxRequest(actionName, params);
    }

    //стандартный ajax запрос
    function ajaxRequest(actionName, params, data) {
        var settings = {
            method: 'POST',
            url: actionName,
            dataType: 'json',
            params: params,
            data: data
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);
'use strict';

var viewUser = angular.module('catiApp.viewUser', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/user', {
    templateUrl: 'viewAdmin/viewUser/viewUser.html',
    controller: 'ViewUserCtrl'
  });
}]);

viewUser.controller('ViewUserCtrl', ['$scope', '$rootScope', 'userService', 'ngTableParams', function($scope, $rootScope, userService, ngTableParams) {
    $scope.userList = [];

    $scope.modal = {};
    $scope.modal.user = $('#newUserModal');

    ($scope.getAllUsers = function(){
        userService.getAllUsers().success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.userList = angular.fromJson(response.result)
        });
    })();

    $scope.saveUser = function(){
        userService.addUser($scope).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.getAllUsers();
            $scope.modal.user.modal('hide');
        });
    };

    $scope.newUser = function(){
        $scope.clearUser();
        $scope.modal.user.modal('show');
    };

    $scope.clearUser = function(){
        $scope.userTemp = {};
    };

    $scope.editUser = function(user){
        $scope.userTemp = angular.copy(user);
        $scope.modal.user.modal('show');
    };

    $scope.removeUser = function(num, $event){
        $event.stopPropagation();
        $rootScope.dialogConfirmOpen('Вы уверены, что хотите удалить интервьюера?', function(){
            userService.removeUser(num).success(function(response){
                if(!response || !response.result) $rootScope.dialogAlertOpen();
                $scope.getAllUsers();
            });
        });
    };

    $scope.tableUserParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.userList.length, // length of data
        getData: function($defer, params) {
            var page = params.page();
            var count = params.count();
            $scope.tableUserParams.total($scope.userList.length);
            $defer.resolve($scope.userList.slice((page-1)*count, page*count));
        }
    });
    $scope.tableUserParams.settings().$scope = $scope;

    $scope.$watchCollection('userList', function(newValue){
        if(newValue){
            $scope.tableUserParams.reload();
        }
    });

}]);

viewUser.service('userService',['$http', function($http){
    return {
        addUser: addUser,
        removeUser: removeUser,
        getAllUsers: getAllUsers
    };

    function addUser($scope){
        var actionName = 'addUser';
        var params = { data: $scope.userTemp };
        return ajaxRequest(actionName, params);
    }

    function removeUser(userId){
        var actionName = 'inActivateUser';
        var params = { userId: userId };
        return ajaxRequest(actionName, params);
    }

    function getAllUsers(){
        var actionName = 'getAllUsers';
        var params = { role: 'operator' };
        return ajaxRequest(actionName, params);
    }

    //стандартный ajax запрос
    function ajaxRequest(actionName, params, data) {
        var settings = {
            method: 'POST',
            url: actionName,
            params: params,
            data: data
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);
'use strict';

var viewStat = angular.module('catiApp.viewStat', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stat/', {
    templateUrl: 'viewAdmin/viewStat/viewStat.html',
    controller: 'ViewStatCtrl'
  });
}]);

viewStat.controller('ViewStatCtrl', ['$rootScope', '$scope', 'pollService', 'statService', 'ngTableParams',
    function($rootScope, $scope, pollService, statService, ngTableParams) {
    $scope.type = 'test';
    $scope.pollList = [];
    $scope.userList = [];
    $scope.quotaPlan = [];
    $scope.callInfo = [];
    $scope.resultAnswer = [];
    $scope.quota = [];
    $scope.modal = {};
    $scope.countRefresh = 0; //надо
    $scope.modal.view = $('#viewResultModal');

    ($scope.getAllInterviews = function(){
        pollService.getAllInterviews().success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.pollList = angular.fromJson(response.result);
        });
    })();

    $scope.getUsersForInterview = function(){
        var userOld = angular.copy($scope.userTemp);
        statService.getUsersForInterview($scope).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.userList = angular.fromJson(response.result);
            $scope.userList.unshift({});
            $scope.userTemp = $scope.userList[0];
            console.log(userOld, $scope.userTemp);
            if(angular.equals(userOld, {}) && angular.equals(userOld, $scope.userTemp)){
                $scope.getResultInterviewCountStat();
                $scope.getResultInterviewListStat();
            }
        });
    };

    $scope.getResultInterviewCountStat = function(){
        if(!$scope.pollTemp) return;
        if(!$scope.pollTemp.id) return;
        statService.getResultInterviewCountStat($scope).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.quotaPlan = angular.fromJson(response.result);
        });
    };

    $scope.getResultInterviewListStat = function(){
        if(!$scope.pollTemp) return;
        if(!$scope.pollTemp.id) return;
        statService.getResultInterviewListStat($scope).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.callInfo = angular.fromJson(response.result);
        });
    };

    $scope.getSelectUserName = function(stat){
        return (stat && stat.login) ? stat.fio + ' (' + stat.login + ')' : 'Все';
    };

    //***********************
    $scope.tableInfoParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.callInfo.length, // length of data
        getData: function($defer, params) {
            $scope.tableInfoParams.total($scope.callInfo.length);
            $defer.resolve($scope.callInfo.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.tableInfoParams.settings().$scope = $scope;

    $scope.$watchCollection('callInfo', function(newValue){
        if(newValue) $scope.tableInfoParams.reload();
    });

    //************************
    $scope.tableResultParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.resultAnswer.length, // length of data
        getData: function($defer, params) {
            $scope.tableResultParams.total($scope.resultAnswer.length);
            $defer.resolve($scope.resultAnswer.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.tableResultParams.settings().$scope = $scope;

    $scope.$watchCollection('resultAnswer', function(newValue){
        if(newValue) $scope.tableResultParams.reload();
    });

    $scope.openViewResultModal = function(id){
        statService.allAnswersByResultInterview(id).success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.resultAnswer = angular.fromJson(response.result);
            $scope.modal.view.modal('show');
        });
    };

    $scope.$watch('pollTemp', function(newValue){
        if(newValue){
            $scope.getUsersForInterview();
        }
    }, true);

    $scope.$watch('userTemp', function(newValue){
        $scope.getResultInterviewCountStat();
        $scope.getResultInterviewListStat();
    }, true);

    $scope.$watch('quotaPlan', function(newValue){
        if(!newValue) return;

        $scope.quota.totalCount = newValue.maleCount + newValue.femaleCount;
        $scope.quota.completedTotalCount = newValue.completedMaleCount + newValue.completedFemaleCount;
        $scope.quota.completedTotalPercent = Math.round($scope.quota.completedTotalCount/$scope.quota.totalCount * 100);
    }, true);
}]);

viewStat.service('statService',['$http', function($http){
    return {
        getUsersForInterview: getUsersForInterview,
        getResultInterviewListStat: getResultInterviewListStat,
        getResultInterviewCountStat: getResultInterviewCountStat,
        allAnswersByResultInterview: allAnswersByResultInterview
    };

    function allAnswersByResultInterview(id){
        var actionName = 'allAnswersByResultInterview';
        var params = {};
        params.resultInterviewId = id;
        return ajaxRequest(actionName, params);
    }

    function getResultInterviewListStat($scope){
        var actionName = 'getResultInterviewListStat';
        var params = {};
        params.interviewId = $scope.pollTemp.id;
        params.userId = $scope.userTemp ? $scope.userTemp.id : null;
        return ajaxRequest(actionName, params);
    }

    function getResultInterviewCountStat($scope){
        var actionName = 'getResultInterviewCountStat';
        var params = {};
        params.interviewId = $scope.pollTemp.id;
        params.userId = $scope.userTemp ? $scope.userTemp.id : null;
        return ajaxRequest(actionName, params);
    }

    function getUsersForInterview($scope){
        var actionName = 'getUsersForInterview';
        var params = {};
        params.interviewId = $scope.pollTemp.id;
        return ajaxRequest(actionName, params);
    }

    //стандартный ajax запрос
    function ajaxRequest(actionName, params) {
        var settings = {
            method: 'POST',
            url: actionName,
            params: params
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);
'use strict';

// Declare app level module which depends on views, and components
angular.module('catiApp', [
    'ngRoute',
    'ngTable',
    'ui.bootstrap',
    'ui.bootstrap-slider',
    'catiApp.view404',
    'catiApp.viewMain',
    'catiApp.viewTest',
    'catiApp.viewPoll',
    'catiApp.viewUser',
    'catiApp.viewCurrent',
    'catiApp.viewImport',
    'catiApp.viewStat'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {redirectTo: '/main'});
    $routeProvider.when('/404', {redirectTo: '/404'});
    $routeProvider.otherwise({redirectTo: '/404'});

}]).controller('AppCtrl', ['$rootScope', '$scope', '$location', 'appService', function ($rootScope, $scope, $location, appService) {
    $scope.confirmText;
    $scope.alertText;

    $scope.confirmModal = $('#confirmModal');
    $scope.alertModal = $('#alertModal');
    $scope.waitModal = $('#waitModal');

    $scope.progress = {};
    $scope.progress.count = 0;

    $scope.pollActive = false;
    $rootScope.viewReviews = [];
    $rootScope.viewReviewId = 0;

    $rootScope.getLocationPath = function (path) {
        return $location.path();
    };

    $rootScope.setLocationPath = function (path) {
        $location.path(path);
    };

    $rootScope.isActiveMark = function (arg, postfix) {
        return $rootScope.isComparePath(arg) ? 'activeMark' + postfix : '';
    };

    $scope.catiDialogAlert = function () {
        $scope.alertModal.modal('hide');
    };

    $scope.dialogAlert = function (text, callback) {
        $scope.catiDialogAlert = function () {
            if (callback != null) callback();
            $scope.alertModal.modal('hide');
        };
        $scope.alertText = text;
        $scope.alertModal.modal('show');
    };

    $scope.dialogConfirm = function (text, callback) {
        $scope.catiDialogConfirm = function () {
            if (callback) callback();
            $scope.confirmModal.modal('hide');
        };
        $scope.confirmText = text;
        $scope.confirmModal.modal('show');
    };

    $rootScope.findJsonObjects = function (obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat($rootScope.findJsonObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    };

    $rootScope.findJsonObjectsFirstLevel = function (obj, key, val) {
        var objects = [];
        for (var i = 0; i < obj.length; i++) {
            if (obj[i][key] == val) objects.push(obj[i]);
        }
        return objects;
    };

    $rootScope.dialogConfirmOpen = function (text, callback) {
        $scope.dialogConfirm(text, callback);
    };

    $rootScope.dialogAlertOpen = function (text, callback) {
        $scope.dialogAlert(text, callback);
    };

    $rootScope.dialogWaitingOpen = function (titleText, finishText) {
        $scope.progress.title = titleText;
        $scope.progress.finish = finishText;
        $scope.startProgressBar();
        $scope.waitModal.modal('show');
    };

    $rootScope.setWaitingFinish = function (finishText) {
        $scope.progress.finish = finishText;
    };

    $rootScope.dialogWaitingClose = function () {
        $rootScope.stopProgressBar();
        $scope.waitModal.modal('hide');
        $scope.progress.intervalId = null;
        $scope.progress.count = 0;
    };

    $scope.startProgressBar = function () {
        if($scope.progress.intervalId) return;

        $scope.progress.intervalId = setInterval(function(){
            $scope.getProgressBar();
            if($scope.progress.count>=100)
                $rootScope.stopProgressBar();
        }, 1000);
    };

    $scope.getProgressBar = function () {
        appService.getProgressBar().success(function (response) {
            if (!response || !response.result) $rootScope.dialogAlertOpen();
            $scope.progress.count = parseFloat(response.result);
        });
    };

    $rootScope.stopProgressBar = function () {
        clearInterval($scope.progress.intervalId);
    };

    $rootScope.isComparePath = function (args) {
        return $location.path().substr(0,args.length) === args;
        /*return $location.path().indexOf(args)==0;*/
    }

}]).directive('numbersOnly', function () {
    return function (scope, element, attrs) {
        var numonly = attrs['numonly'] === 'true';
        $(element[0]).numericInput({allowFloat: !numonly});
    };

}).service('appService', ['$http', function ($http) {
    return {
        getProgressBar: getProgressBar,
        getProperties: getProperties
    };

    function getProgressBar(num) {
        var actionName = 'getProgressBar';
        return ajaxRequest(actionName);
    }

    function getProperties(num) {
        var actionName = 'getProperties';
        var params = {};
        params.typeNum = num;
        return ajaxRequest(actionName, params);
    }

    //стандартный ajax запрос
    function ajaxRequest(actionName, params) {
        var settings = {
            method: 'POST',
            url: actionName,
            params: params
        };
        var httpRequest = $http(settings);
        httpRequest.error(errorRequest);
        return httpRequest;
    }
}]);

function errorRequest() {
    $('#alertModal').modal('show');
}