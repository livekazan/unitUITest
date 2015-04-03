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

var viewCurrent = angular.module('catiApp.viewCurrent', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/current', {
    templateUrl: 'viewOperator/viewCurr/viewCurrent.html',
    controller: 'ViewCurrentCtrl'
  });
}]);

viewCurrent.controller('ViewCurrentCtrl', ['$scope', '$rootScope', 'currService',
    function($scope, $rootScope, currService) {
        $scope.currPollPage = -1;
        $scope.disabledNext = false;
        $scope.contact = {};
        $scope.currTest = {};
        $scope.currPoll = {};
        $scope.currQuestion = {};
        $scope.resultInterviewJSON = {};
        $scope.resultInterviewJSON.resultAnswerJSONs = [];
        $scope.disabledFinishBtn = false;

        $rootScope.initializeInterview().success(function(response){
            if(!response || !response.result) $rootScope.dialogAlertOpen();

            var result = angular.fromJson(response.result);
            if(!result['errorMessage']) {
                $scope.currPoll = result;
                $scope.currTest = result['testJSON'];
                $scope.currPollPage = 0;
                $scope.disabledNext = false;
                $rootScope.setViewReviewId($scope.currPoll.id);
                $scope.contact = $rootScope.pollResult.contact;
                $scope.resultInterviewJSON = $rootScope.pollResult;
            } else $rootScope.dialogAlertOpen(result['errorMessage']);
        });

        $scope.$watch('currPollPage', function(newValue){
            if(newValue>=0 && newValue<$scope.currTest.questions.length){
                $scope.currQuestion = $scope.currTest.questions[newValue];
            }
        });
        
        $scope.startQuestion = function(){
            $scope.endedText = '';
            $scope.currPollPage = 0;
            $scope.disabledFinishBtn = false;
        };

        $scope.prevQuestion = function(){
            if($scope.currPollPage>0) $scope.currPollPage--;
        };

        $scope.checkAnswerTemp = function(){
            var values = [];
            $('.checkAnswerTemp').each(function(){
                if($(this).prop('checked')) values.push(parseInt($(this).val()));
            });
            return values;
        };

        $scope.nextQuestion = function(){
            if($scope.disabledNext===true) return;

            if($scope.currPollPage<$scope.currTest.questions.length) {
                var nextLinkQuestion;

                var $radioAnswerTemp = $('#radioAnswerTemp:checked');
                var checkAnswerTemp = $scope.checkAnswerTemp();
                var radioAnswerTemp = $radioAnswerTemp.val();

                var answer = {};
                answer.questionId = $scope.currQuestion.id;
                answer.answerIds = $scope.currQuestion.questionType=='multiple'
                    ? $scope.checkAnswerTemp() : [parseInt(radioAnswerTemp)];
                
                if($rootScope.pollRun){
                    if(checkAnswerTemp.length==0 && !radioAnswerTemp){
                        $rootScope.dialogAlertOpen('Выберите вариант ответа');
                        return;
                    }

                    var duplicateQuestion = $rootScope.findJsonObjectsFirstLevel($scope.resultInterviewJSON.resultAnswerJSONs, 'id', answer.questionId)[0];
                    if(!duplicateQuestion)
                        $scope.resultInterviewJSON.resultAnswerJSONs.push(answer);

                    $scope.disabledNext = true;
                    currService.saveResultInterview($scope).success(function(response){
                        if(!response || !response.result) $rootScope.dialogAlertOpen();

                        var result = angular.fromJson(response.result);
                        if(!result['errorMessage']) {
                            $scope.resultInterviewJSON.id = response.result;
                            nextLinkQuestion = $rootScope.findJsonObjectsFirstLevel($scope.currQuestion.answers, 'id', answer.answerIds[0])[0];
                            $scope.currPollPage = nextLinkQuestion && $scope.currQuestion.questionType == 'tree'
                                ? nextLinkQuestion.linkIndexOrder - 1 : $scope.currPollPage + 1;
                            $scope.disabledNext = false;
                            $('body,html').animate({scrollTop: 0}, 200);
                            if($scope.currPollPage>=$scope.currTest.questions.length){
                                $rootScope.setResultPollStateEnded();
                            }
                        } else {
                            $rootScope.dialogAlertOpen(result['errorMessage']);
                            if(result['errorCode']==9) {
                                $scope.setEndedText(result['errorMessage']);
                                $rootScope.setResultPollStateQuota();
                                $scope.currPollPage = $scope.currTest.questions.length;
                            }
                        }
                    });
                } else {
                    nextLinkQuestion = $rootScope.findJsonObjectsFirstLevel($scope.currQuestion.answers, 'id', answer.answerIds[0])[0];
                    $scope.currPollPage = nextLinkQuestion && $scope.currQuestion.questionType == 'tree'
                        ? nextLinkQuestion.linkIndexOrder - 1 : $scope.currPollPage + 1;
                    $('body,html').animate({scrollTop: 0}, 200);
                }
            }
        };

        $scope.setEndedText = function(text){
            $scope.endedText = text;
        };

        $scope.removeInterviewFromList = function(index){
            $rootScope.viewReviews.splice(index, 1);
            $rootScope.viewReviewId = $rootScope.viewReviews.length ? $rootScope.viewReviews[0].id : 0;
            $scope.initializeInterview();
        };

        $scope.getTextClass = function(interviewState){
            return 'text-'+$scope.getTypeClass(interviewState);
        };

        $scope.stopPoll = function(){
            $scope.disabledFinishBtn = true;
            $rootScope.stopCall();
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
    }
]);

viewCurrent.service('currService',['$http', function($http){
    return {
        saveResultInterview: saveResultInterview,
        beginResultInterview: beginResultInterview,
        getAvailableInterview: getAvailableInterview
    };

    function saveResultInterview($scope){
        var actionName = 'saveResultInterview';
        var data = { json: $scope.resultInterviewJSON };
        return ajaxRequest(actionName, null, data);
    }

    function beginResultInterview(){
        var actionName = 'beginResultInterview';
        return ajaxRequest(actionName);
    }

    function getAvailableInterview(){
        var actionName = 'getAvailableInterview';
        return ajaxRequest(actionName);
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
    templateUrl: 'viewOperator/viewMain/viewMain.html',
    controller: 'ViewMainCtrl'
  });
}]);

viewMain.controller('ViewMainCtrl', ['$rootScope', '$scope', 'mainService', function($rootScope, $scope, mainService) {
    $scope.currTest = {};
    $scope.currPoll = {};
    $scope.quotaPlan = {};
    $scope.quota = {};

    clearQuota();

    $rootScope.initializeInterview().success(function(response){
        if(!response || !response.result) $rootScope.dialogAlertOpen();

        var result = angular.fromJson(response.result);
        if(!result['errorMessage']) {
            $scope.currPoll = result;
            $scope.quotaPlan = $scope.currPoll.quotaPlanJSON;
        } else $rootScope.dialogAlertOpen(result['errorMessage']);
    });
    
    $scope.startPoll = function(){
        $rootScope.startPoll();
    };

    $scope.$watch('quotaPlan', function(newValue){
        if(!newValue || !newValue.id) return;

        clearQuota();

        $scope.quota.femaleNumber = newValue.femaleNumber;
        $scope.quota.maleNumber = newValue.maleNumber;

        angular.forEach(newValue.quotaList, function (item) {
            $scope.quota.totalNumber = $scope.quota.totalNumber + item.neededValue;
            $scope.quota.currTotalNumber = $scope.quota.currTotalNumber + item.completedValue;

            if(item.sex==='male'){
                $scope.quota.maleTotalNumber = $scope.quota.maleTotalNumber + item.neededValue;
                $scope.quota.maleCurrTotalNumber = $scope.quota.maleCurrTotalNumber + item.completedValue;
            }

            if(item.sex==='female'){
                $scope.quota.femaleTotalNumber = $scope.quota.femaleTotalNumber + item.neededValue;
                $scope.quota.femaleCurrTotalNumber = $scope.quota.femaleCurrTotalNumber + item.completedValue;
            }
        });
        $scope.quota.currTotalNumberPercent = $scope.quota.currTotalNumber*100/$scope.quota.totalNumber;
        $scope.quota.maleCurrTotalNumberPercent = $scope.quota.maleCurrTotalNumber*100/$scope.quota.maleTotalNumber;
        $scope.quota.femaleCurrTotalNumberPercent = $scope.quota.femaleCurrTotalNumber*100/$scope.quota.femaleTotalNumber;
    }, true);

    function clearQuota() {
        $scope.quota.totalNumber = 0;
        $scope.quota.currTotalNumber = 0;
        $scope.quota.currTotalNumberPercent = 0;
        $scope.quota.maleTotalNumber = 0;
        $scope.quota.maleCurrTotalNumber = 0;
        $scope.quota.maleCurrTotalNumberPercent = 0;
        $scope.quota.femaleTotalNumber = 0;
        $scope.quota.femaleCurrTotalNumber = 0;
        $scope.quota.femaleCurrTotalNumberPercent = 0;
    }

}]);

viewMain.service('mainService',['$http', function($http){
    return {
        
    };

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
    'ui.bootstrap',
    'timer',
    'catiApp.view404',
    'catiApp.viewMain',
    'catiApp.viewCurrent'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {redirectTo: '/main'});
    $routeProvider.when('/404', {redirectTo: '/404'});
    $routeProvider.otherwise({redirectTo: '/404'});

}]).controller('AppCtrl', ['$rootScope', '$scope', '$location', 'currService', 'appService', function ($rootScope, $scope, $location, currService, appService) {
    $scope.confirmText;
    $scope.alertText;

    $scope.confirmModal = $('#confirmModal');
    $scope.skypeModal = $('#skypeModal');
    $scope.alertModal = $('#alertModal');
    $scope.waitModal = $('#waitModal');

    $scope.currentNumber;
    $scope.currPoll = {};
    $scope.pollActive = false;
    $scope.resultInterviewId = 0;
    $scope.resultInterviewState = [];

    $rootScope.pollResult = {};
    $rootScope.appletParam = {};
    $rootScope.pollRun = false;
    $rootScope.uploadFile = false;
    $rootScope.viewReviews = [];
    $rootScope.viewReviewId = 0;

    // FOR SKYPE APPLET
    ($scope.defaultSkype = function (text) {
        $scope.skype = {};
        $scope.skype.text = '';
        $scope.skype.contact = {};
        $scope.skype.closeView = true;
        $scope.skype.recallView = false;
        $scope.skype.stopView = false;
        $scope.skype.manualView = false;
        $scope.skype.applet = document.jsk;
        $scope.skype.status = {
            RINGING: 'Соединение...',
            ROUTING: 'Набор номера...',
            EARLYMEDIA: 'Ожидание ответа...',
            CANCELLED: 'Отменен...',
            REFUSED: 'Абонент занят...',
            BUSY: 'Абонент занят...',
            INPROGRESS: 'Начало разговора',
            FINISHED: 'Разговор закончен',
            FAILED: 'Ошибка набора номера',
            skypeError: 'Ошибка приложения'
        }
        ;
    })();

    $rootScope.setVisibleButton = function (recallView, stopView, closeView, manualView) {
        $scope.skype.closeView = closeView;
        $scope.skype.recallView = recallView;
        $scope.skype.stopView = stopView;
        $scope.skype.manualView = manualView;
    };

    $scope.dialogSkype = function (text) {
        $scope.skype.text = text;
        $scope.skypeModal.modal('show');
    };

    $rootScope.dialogSkypeOpen = function (text) {
        $scope.pollStateTemp = null;
        $scope.dialogSkype(text);
    };

    $rootScope.dialogSkypeClose = function () {
        $scope.skypeModal.modal('hide');
    };

    $rootScope.pollFinished = function () {
        appService.changeDocumentStateResultInterview($scope, $rootScope.pollResult.id).success(function (response) {
            if (!response || !response.result) $rootScope.dialogAlertOpen();

            var result = angular.fromJson(response.result);
            if (!result['errorMessage']) {
                $rootScope.pollRun = false;
                $scope.skypeModal.modal('hide');
                $rootScope.setLocationPath('/main');
            } else $rootScope.dialogAlertOpen(result['errorMessage']);
        });
    };

    $rootScope.recallContact = function () {
        $scope.skype.statusText = $scope.skype.status['RINGING'];
        $scope.skype.applet.makeCall('' + $scope.skype.contact.number);
    };

    $rootScope.manualConnection = function () {
        $scope.skype.applet.manualConnect();
    };

    $rootScope.setInitParams = function (pollResult) {
        var jsessionid = pollResult.jsessionid;
        var resultInterviewId = pollResult.id;
        var actionName = 'uploadRecordFile';
        var url = pollResult.url;
        $scope.skype.applet.setInitParams(url, jsessionid, actionName, resultInterviewId);
    };

    $scope.statusChangedApplet = function (state) {
        console.log(state);
        $scope.skype.statusText = $scope.skype.status[state];

        if (state == 'RINGING' || state == 'ROUTING' || state == 'EARLYMEDIA' || state == 'UNPLACED') {
            $scope.skype.text = 'Вызываемый абонент: ' + $scope.skype.contact.number;
            $rootScope.setVisibleButton(false, false, false, true);
            $rootScope.dialogSkypeOpen();
        } else if (state == 'CANCELLED' || state == 'FINISHED' || state == 'REFUSED' || state == 'BUSY') {
            if ($scope.currentNumber == 'null' || $scope.skype.contact.number != $scope.currentNumber) {
                $rootScope.dialogSkypeClose();
                return;
            }

            $rootScope.setVisibleButton(true, true, false);
            if (state == 'FINISHED' && $scope.pollStateTemp == 'isEnded') {
                $rootScope.pollFinished();
            } else if (state == 'FINISHED' && $scope.pollStateTemp == 'isQuotaOverflow') {
                $rootScope.pollFinished();
            } else $rootScope.dialogSkypeOpen();
        } else if (state == 'INPROGRESS') {
            if ($scope.currentNumber === 'null' || $scope.skype.contact.number != $scope.currentNumber) return;

            $rootScope.pollRun = true;
            $rootScope.dialogSkypeClose();
            $rootScope.setLocationPath('/current');
            $rootScope.setResultPollStateClear();
        } else if (state == 'skypeError') {
            $rootScope.setVisibleButton(false, false, true);
            $rootScope.dialogSkypeOpen();
            $scope.skype.text = 'Ошибка соединения со Skype. Возможно программа не запущена. ' +
            'Для повторной попытки соединения перегрузите страницу.';
        } else if (state == 'FAILED') {
            $rootScope.setVisibleButton(false, false, true);
            $rootScope.dialogSkypeOpen();
            $scope.skype.text = 'Возможно набираемый номер содержит неверный формат';
        } else {
            $rootScope.setVisibleButton(false, false, true);
            $rootScope.dialogSkypeOpen('Неизвестный статус Skype: ' + state);
        }
    };
    //-----------------<

    $scope.initializeInterview = function () {
        return currService.getAvailableInterview();
    };

    ($rootScope.getProperties = function () {
        appService.getProperties(6).success(function (response) {
            if (!response || !response.result) $rootScope.dialogAlertOpen();

            var result = angular.fromJson(response.result);
            if (!result['errorMessage']) {
                $scope.resultPollState = result;
                var stateAll = $rootScope.findJsonObjectsFirstLevel($scope.resultPollState, 'index', 'all')[0];
                var runningState = $rootScope.findJsonObjectsFirstLevel($scope.resultPollState, 'index', 'isRunning')[0];
                var endedState = $rootScope.findJsonObjectsFirstLevel($scope.resultPollState, 'index', 'isEnded')[0];
                $scope.resultPollState.splice($scope.resultPollState.indexOf(stateAll), 1);
                $scope.resultPollState.splice($scope.resultPollState.indexOf(runningState), 1);
            } else $rootScope.dialogAlertOpen(result['errorMessage']);
        });
    })();

    $rootScope.setResultPollStateEnded = function () {
        var stateEnded = $rootScope.findJsonObjectsFirstLevel($scope.resultPollState, 'index', 'isEnded')[0];
        $scope.pollStateTemp = stateEnded.index;
    };

    $rootScope.setResultPollStateQuota = function () {
        var stateQuota = $rootScope.findJsonObjectsFirstLevel($scope.resultPollState, 'index', 'isQuotaOverflow')[0];
        $scope.pollStateTemp = stateQuota.index;
    };

    $rootScope.setResultPollStateClear = function () {
        $scope.pollStateTemp = null;
    };

    $rootScope.startPoll = function () {
        $rootScope.setVisibleButton(false, false, true, true);
        $rootScope.dialogSkypeOpen('Идет набор номера');

        currService.beginResultInterview().success(function (response) {
            if (!response || !response.result) $rootScope.dialogAlertOpen();

            var result = angular.fromJson(response.result);
            if (!result['errorMessage']) {
                $rootScope.pollResult = result;
                $rootScope.isPollStateDisabled = false;
                $scope.skype.contact = angular.copy(result.contact);
                $rootScope.setInitParams($rootScope.pollResult);
                $rootScope.recallContact();
                //$scope.statusChangedApplet('INPROGRESS');
            } else {
                $rootScope.dialogAlertOpen(result['errorMessage']);
                $rootScope.dialogSkypeClose();
            }
        });
    };

    $rootScope.stopCall = function () {
        $scope.skype.applet.stopCall();
        //$scope.statusChangedApplet('FINISHED');
    };

    $rootScope.setCallNumberApplet = function (number) {
        $scope.currentNumber = number;
    };

    $rootScope.uploadStarted = function () {
        $rootScope.uploadFile = true;
        $rootScope.dialogWaitingOpen();
    };

    $rootScope.uploadEnded = function () {
        $rootScope.uploadFile = false;
        $rootScope.dialogWaitingClose();
    };

    $rootScope.statusChangedApplet = $scope.statusChangedApplet;

    $rootScope.getLocationPath = function () {
        return $location.path();
    };

    $rootScope.setLocationPath = function (path) {
        if ($rootScope.getLocationPath() != path) {
            $location.path(path);
        }
    };

    $rootScope.setViewReviewId = function (id) {
        $scope.resultInterviewId = id;
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

    $rootScope.dialogWaitingOpen = function () {
        $scope.waitModal.modal('show');
    };

    $rootScope.dialogWaitingClose = function () {
        $scope.waitModal.modal('hide');
    };

    $rootScope.isComparePath = function (args) {
        return $location.path() == args;
    };

    $rootScope.initializeInterview = $scope.initializeInterview;

}]).service('appService', ['$http', function ($http) {
    return {
        getProperties: getProperties,
        changeDocumentStateResultInterview: changeDocumentStateResultInterview
    };

    function getProperties(num) {
        var actionName = 'getOperatorProperties';
        var params = {};
        params.typeNum = num;
        return ajaxRequest(actionName, params);
    }

    function changeDocumentStateResultInterview($scope, pollId) {
        var actionName = 'changeDocumentStateResultInterview';
        var params = {};
        params.resultInterviewId = pollId;
        params.resultInterviewState = $scope.pollStateTemp;
        params.comment = $scope.resultComment;
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

// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function formatTime(time) {
    var min = parseInt(time / 60),
        sec = parseInt(time / 1) - (min * 60),
        hundredths = pad(time - (sec * 1000) - (min * 60000), 2);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
}

function errorRequest() {
    $('#alertModal').modal('show');
}

//SKYPE FUNCTIONS
function getAngularScope() {
    var e = 'body[ng-controller="AppCtrl"]';
    var scope = angular.element($(e)).scope();
    return scope;
}

function statusChangedApplet(state) {
    var scope = getAngularScope();
    scope.statusChangedApplet(state);
    if (!scope.$$phase) scope.$apply();
}

function setCallNumberApplet(number) {
    var scope = getAngularScope();
    scope.setCallNumberApplet(number);
    if (!scope.$$phase) scope.$apply();
}

function uploadStarted() {
    var scope = getAngularScope();
    scope.uploadStarted();
    if (!scope.$$phase) scope.$apply();
}

function uploadEnded() {
    var scope = getAngularScope();
    scope.uploadEnded();
    if (!scope.$$phase) scope.$apply();
}