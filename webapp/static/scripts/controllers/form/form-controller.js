'use strict';

angular.module('clientApplication')

	.controller('form-controller', ['$scope', '$http', 'jsonFilter', 'transformRequestAsFormPost', 'GenerateGuid', '$upload', 
		'$location', '$timeout', '$route', 'datepickerPopupConfig', '$filter', '$state', 'AlertService',
		function($scope, $http, jsonFilter, transformRequestAsFormPost, GenerateGuid, $upload, $location, $timeout,
				$route, datepickerPopupConfig, $filter, $state, AlertService) {
		
		$scope.showFailureAlert = false;
		$scope.data = {};
		$scope.fields = [];
		$scope.fieldsCandidats = [];

		var typeState = $filter('currentStateFilter')($state.current.name);
		var getType = function() {
			var url = CONTEXT_PATH + 'api/document/type/' + typeState;
			$http.get(url).success(function(response) {
				$scope.data.type = response?response.replace(/"/g, ''):'';
			});
		};
		getType();

		$scope.incrementPriority = function() {
			var priorityInt = Number($scope.data.priority); 
			if ( priorityInt >= "99" ) {
				return;
			}
			priorityInt += 1;
			$scope.data.priority = priorityInt;
		};
		
		$scope.decrementPriority = function() {
			var priorityInt = Number($scope.data.priority);
			if ( priorityInt <= "0") {
				return;
			}
			priorityInt -= 1;
			$scope.data.priority = priorityInt;
		};
		
		/************COMPTE-RENDU***********/
		$scope.generateInputParticipants = function() {
			$scope.fields.push({input:""});
		};
			
		$scope.removeInputParticipants = function(index) {
			$scope.fields.splice(index, 1);
		};
			
		$scope.generateInputNumCandidats = function() {
			$scope.fieldsCandidats.push({input:""});
		};
			
		$scope.removeInputNumCandidats = function(index) {
			$scope.fieldsCandidats.splice(index, 1);
		};
		/*********************************/
		
		$scope.generate = function() {
			$scope.guid = GenerateGuid.query({}, function(){});
		};
		
		$scope.onFileSelect = function($files) {
			$scope.data.monFichier =  $files[0];
		};
		
		$scope.switchBool = function (value) {
			$scope[value] = !$scope[value];
		};
		
		//Time and date pickers
		$scope.datepickers = {
			date: false,
			temps: false,
			dateReunion: false,
			tpsReunion: false
		};
		$scope.today = function() {
			$scope.date = new Date();
		};
		$scope.today();
		$scope.clear = function () {
			$scope.date = null;
		};
		$scope.open = function($event, which) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.datepickers[which]= true;
			};
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		//Time picker:
		$scope.temps = new Date();
		$scope.ismeridian = false;
		$scope.submitTheForm = function() {
			
			//ajout manuel du guid dans data: 
			$scope.data.guid = $scope.guid.value;
			
			if ($scope.date && $scope.temps) {
				var dateFiltered = $filter('date')($scope.date, 'dd/MM/yyyy', 'UTC');
				var timeFiltered = $filter('date')($scope.temps, 'HH:mm:ss', 'UTC');
				var combinationDateTime = dateFiltered +  " " + timeFiltered;
				//ajout manuel de la date dans data:
				$scope.data.date = combinationDateTime;
			}

			if (angular.equals('', $scope.guid.value)) {
				$scope.showFailureAlert = true;
				$scope.errorMessage = MESSAGES.form.msgErrorForm;
				return;
			}
			
			/***********************************/
			var fieldValues = [];
			var fieldCandidatsValues = [];
			
			$scope.fields.forEach(function(field) {
				if (field.input == "") {
					//don't do anything
				} else {
				fieldValues.push(field.input);
				}
			});

			if ($scope.participant1 != null) {
				fieldValues = fieldValues.concat($scope.participant1);
			}
			var listParticipants = '' + fieldValues;
			//ajout manuel des participants dans data:
			if (listParticipants) $scope.data.participants = listParticipants;
			
			$scope.fieldsCandidats.forEach(function(field) {
				if (field.input == "") {
					//don't do anything
				} else {
					fieldCandidatsValues.push(field.input);
				}
			});

			if ($scope.numCandidat1 != null) {
				fieldCandidatsValues = fieldCandidatsValues.concat($scope.numCandidat1);
			}
			var listCandidats = '' + fieldCandidatsValues;
			//ajout manuel des candidats dans data:
			if (listCandidats) $scope.data.numCandidats = listCandidats;
			
			var dateFilteredMeeting = $filter('date')($scope.dateReunion, 'dd/MM/yyyy', 'UTC');
			var timeFilteredMeeting = $filter('date')($scope.tpsMeeting, 'HH:mm:ss', 'UTC');
			var combinationDateTimeMeeting = undefined;
			if (dateFilteredMeeting && timeFilteredMeeting) {
				combinationDateTimeMeeting = dateFilteredMeeting + " " + timeFilteredMeeting;
				data.dateReunion =  combinationDateTimeMeeting;
			}
			/***********************************/
				
			$scope.upload = [];
			
			var suffix = $filter('detailsURLfilter')(TYPES[$scope.data.type]);
			$scope.upload = $upload.upload({
				url: 'api/document/create/' + suffix, 
				method: 'POST',
				data: $scope.data
			}).progress(function(evt) {
				var percent = parseInt(100.0 * evt.loaded / evt.total);
				console.log('percent: ' + percent);
			}).success(function(data, status, headers, config) {
				AlertService.addAlertMessage(MESSAGES.form.msgSuccessForm);
				var timer=false;
				$scope.$watch('submitButton', function() {
					if(timer){
						$timeout.cancel(timer);
					}
					timer= $timeout(function() {
						$location.path('/vue-principale/liste');
					},1000);
				});
			}).error(function(data, status, headers, config) {
				$scope.showFailureAlert = true;
				$scope.errorMessage = "HttpStatus: " + status + ", Message: " + data;
			});
		};
}]);
