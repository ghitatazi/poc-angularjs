'use strict';

angular.module('clientApplication')

	.controller('overviewCtrl',['$scope', 'Documents', '$location', 'Download', 'Delete', 'AlertService', '$timeout', '$rootScope', '$filter',
	function($scope, Documents, $location, Download, Delete, AlertService, $timeout, $rootScope, $filter) {

		$scope.alertMessageShow = false;
		var timer=false;
		
		if (AlertService.alertMessages.length > 0) {
			$scope.alertMessageShow = true;
			$scope.alertMessage = AlertService.alertMessages[0];
			if(timer){
				$timeout.cancel(timer);
			}
			timer= $timeout(function(){
				AlertService.deleteAlertMessage();
				},2000);
		}
		
		$scope.listDocs = false;
			
		$scope.switchBool = function (value) {
			$scope[value] = !$scope[value];
		};
				
		$scope.loadData = function() {
				
			$scope.documents = Documents.query({}, function() {
				//success
				if ($scope.documents.length > 0) {
					$scope.listDocs = true;
					
					$scope.documents.forEach(function(document) {
						document.typeList = TYPES[document.type];
						console.log("contentType: " + document.contentType);
						console.log("contentLength: " + document.contentLength);
						
						if (document.contentType == null) {
							console.log("The document with guid: " + document.guid + " has no file content");
							document.disableDownload = true;
						} else {
							console.log("The document with guid: " + document.guid + " has no file content");
							document.disableDownload = false;
						}
					});
				} else {
					console.log("No docs found");
					$scope.listDocs = false;
					$scope.subToInformNoDocs = "Aucune référence de document pour le moment";
				}
			});
		};
			
		$scope.loadData();
			
		$scope.showDetails = function(document) {
			//if (document.typeDoc === null) {
			//	$location.path('/docs/details/techniques/guid=' + document.guid);
			//} else {
				$location.path('/docs/details/guid=' + document.guid);
			//}
		};
		
		$scope.download = function(guid) {
			/*var result = Download.query({guid: guid},
					function() {
						//success:
					}, function() {
						//error:
					});*/
			window.location.href = CONTEXT_PATH + 'api/document/' + guid + '/download';
			//console.log(result);
		};
				
		$scope.deleteFile = function(guid) {
			//delete the file from the registry and local directory:
			Delete.query({guid: guid}, function() {
				$scope.loadData();
			});
		};
	}])
	
	.controller('docStandardCtrl', ['$scope', 'GenerateGuid', '$upload', '$timeout', '$location', 'AlertService', 'jsonFilter',
	function($scope, GenerateGuid, $upload, $timeout, $location, AlertService, jsonFilter) {
		
		$scope.showSuccessAlert = false;
		$scope.showFailureAlert = false;
		$scope.typeForTitle = "Document Standard";
		$scope.type = "cm:content"; 
		
		$scope.generate = function() {
			var guid = GenerateGuid.query({}, function(){});
			$scope.guid = guid;
		};
		
		$scope.incrementPriority = function() {
			console.log("Actual priority: " + $scope.priority);
			var priorityInt = Number($scope.priority); 
			if ( priorityInt >= "99" ) {
				return;
			}
			priorityInt += 1;
			$scope.priority = priorityInt;
		};
		
		$scope.decrementPriority = function() {
			console.log("Actual priority: " + $scope.priority);
			var priorityInt = Number($scope.priority);
			if ($scope.priority <= "0") {
				return;
			}
			priorityInt -= 1;
			$scope.priority = priorityInt;
		};
		
		$scope.onFileSelect = function($files) {
			$scope.files =  $files;
		};
		
		$scope.switchBool = function (value) {
			$scope[value] = !$scope[value];
		};

		$scope.submitTheForm = function() {
			
			if (!$scope.files) {
				console.log("No file added to the document");
				$scope.files = [];
			}
			
			if (!$scope.guid || $scope.guid.value == "") {
				console.log("Vous devez ajouter un guid");
				$scope.showFailureAlert = true;
				$scope.errorMessage = "Il faut ajouter un identifiant metier";
				return;
			}
			
			console.log("Length of $scope.files: " + $scope.files.length);
			
			if ($scope.files.length == "0") {
				$scope.upload = [];
				
				var data = {guid: $scope.guid.value};
				
				if ($scope.titre) data.titre = $scope.titre;
				if ($scope.description) data.description = $scope.description;
				if (file) data.monFichier = file;
				if ($scope.nomDocument) data.nomDocument = $scope.nomDocument;
				if ($scope.priority) data.priority = $scope.priority;
				
				$scope.upload = $upload.upload({
					url: 'api/document/create', 
					method: 'POST',
					data: data
				}).progress(function(evt) {
					var percent = parseInt(100.0 * evt.loaded / evt.total);
					console.log('percent: ' + percent);
				}).success(function(data, status, headers, config) {
					console.log(data);
					var msgToDisplay = "Formulaire soumis avec succès";
					AlertService.addAlertMessage(msgToDisplay);
					//$scope.showSuccessAlert = true;
					var timer=false;
					$scope.$watch('submitButton', function(){
						if(timer){
							$timeout.cancel(timer);
						}
							timer= $timeout(function(){
							$location.path('/docs/overview');
							},1000);
						});
				}).error(function(data, status, headers, config) {
					$scope.showFailureAlert = true;
					$scope.errorMessage = "HttpStatus: " + status + ", Message: " + data.message;
				});
				
				} else {
				//si il y a un contenu ou des contenus ajoutés au fichier
					for (var i = 0; i < $scope.files.length; i++) {
						if ($scope.files.length >= 1) {
							console.log("Length >=1");
							var file = $scope.files[i];
							console.log("File at index:" + i + " has the name: " + file.name);
							console.log("File size at index: " + i + " has the size: " + file.size);
						} else {
							var file = [];
							console.log("Length <1");
						}
						var logResult = function (str, data, status, headers, config) {
							return str + "\n\n" + "data: " + data + "\n\n" + "status: " + status + "\n\n" + "headers: " + jsonFilter(headers()) + "\n\n" +
							"config: " + jsonFilter(config);
						};
						
						$scope.upload = [];
						
						var data = {guid: $scope.guid.value};
						
						if ($scope.titre) data.titre = $scope.titre;
						if ($scope.description) data.description = $scope.description;
						if ($scope.nomDocument) data.nomDocument = $scope.nomDocument;
						if (file) data.monFichier = file;
						if ($scope.priority) data.priority = $scope.priority;
						
						$scope.upload = $upload.upload({
							url: 'api/document/create', 
							method: 'POST',
							data: data
							}).progress(function(evt) {
								var percent = parseInt(100.0 * evt.loaded / evt.total);
								console.log('percent: ' + percent);
							}).success(function(data, status, headers, config) {
								console.log(data);
								logResult("POST SUCCESS", data, status, headers, config);
								//$scope.showSuccessAlert = true;
								var msgToDisplay = "Formulaire soumis avec succès";
								AlertService.addAlertMessage(msgToDisplay);
								var timer=false;
								$scope.$watch('submitButton', function(){
									if(timer){
										$timeout.cancel(timer);
									}
									timer= $timeout(function(){
										$location.path('/docs/overview');
									},1000);
								});
							}).error(function(data, status, headers, config) {
								logResult("POST ERROR", data, status, headers, config);
								$scope.showFailureAlert = true;
								$scope.errorMessage = "HttpStatus: " + status + ", Message: " + data.message;
							});
						}
					}
			};
	}])
	
	.controller('searchDocWithGuidCtrl', ['$scope', 'Document', 'Documents', '$location', 'Download', 'Delete',
	function ($scope, Document, Documents, $location, Download, Delete) {
		
		$scope.list = false;
		$scope.showFailureAlert = false;
		$scope.disableDownload = false;
		
		$scope.switchBool = function (value) {
			$scope[value] = !$scope[value];
		};
		
		$scope.searchDoc = function(guid) {
			
			console.log(guid);
			
			if (guid!=null) {
				
				$scope.document = Document.query({guid: guid}, function() {
					//success:
					$scope.list = true;
					$scope.document.typeList = TYPES[$scope.document.type];
					
					if ($scope.document.contentType == null) {
						$scope.disableDownload = true;
					} else {
						$scope.disableDownload = false;
					}
				}, function() {
					//error:
					$scope.showFailureAlert = true;
					$scope.list = false;
					$scope.errorMessage = "Le document n'existe pas en mémoire";
				});
			} else {
				$scope.showFailureAlert = true;
				$scope.list = false;
				$scope.errorMessage = "Veuillez entrer un identifiant métier valide";
			}
		};
		
		$scope.showDetails = function(document) {
//			if (document.typeDoc == null) {
//				$location.path('/docs/details/techniques/guid=' + document.guid);
//			} else {
			$location.path('/docs/details/guid=' + document.guid);
//			}
		};
		
		$scope.download = function(guid) {
			//var result = Download.query({guid: guid}, function() {});
			window.location.href = CONTEXT_PATH + 'api/document/' + guid + '/download';
			//console.log(result);
		};
		
		$scope.deleteFile = function(guid) {
			//delete the file from the registry and local directory:
			var result = Delete.query({guid: guid}, function() {
			});
			console.log(result);
			$scope.list = false;
		};
		}])
		
		.controller('navCtrl', ['$scope', '$location', '$log', 'Online', 'Offline', function ($scope, $location, $log, Online, Offline) {

		$scope.navClass = function(page) {
				var currentRoute = $location.path().substring(1) || 'main';
				return page == currentRoute ? 'active' : '';
		};
		
		$scope.isActive = true; //switch enabled
		$scope.switchOnOff = ONLINE;
		$scope.size = 'medium';
		$scope.animate = true;
		$scope.radioOff = false;
		$scope.onText = 'En<br />ligne';
		$scope.offText = 'Hors<br />ligne';
		$scope.labelText = '&nbsp;';
		$scope.onColor = 'primary';
		$scope.offColor = 'warning';
		
		$scope.$watch('switchOnOff', function(newValue, oldValue) {
			$log.info('Selection changed.');

			if (newValue === oldValue) {
				return;
			}
			if (newValue == true) {
				Online.query({}, function() {});
			} else {
				Offline.query({}, function() {});
			}
			
		});
		
		}])
		
		.controller('detailsTechniquesCtrl', ['$scope', 'Document', '$stateParams', 'jsonFilter', '$location', 
		'Download', function($scope, Document, $stateParams, jsonFilter, $location, Download) {
			
			$scope.disableDownload = true;
			$scope.list = [];
			
			$scope.document = Document.query({guid: $stateParams.guid}, function() {
				var data = $scope.document.properties;
				var jsonString = jsonFilter(data);
				
				if ($scope.document.contentType == null) {
					$scope.disableDownload = true;
				} else {
					$scope.disableDownload = false;
				};
				
				$scope.list = angular.fromJson(jsonString);
				(function filter(obj) {
					$.each(obj, function(key, value){
						if (value === "" || value === null){
							obj[key] = "n/a";
						}
					});
				})($scope.list);
				console.log($scope.list);
				});
			
			$scope.download = function(guid) {
				//var result = Download.query({guid: guid}, function() {});
				window.location.href = CONTEXT_PATH + 'api/document/' + guid + '/download';
				//console.log(result);
			};
				
			$scope.getDetails = function(guid) {
				$location.path('/docs/details/guid=' + guid);
			};
			
		}])
		
		.controller('detailsCtrl', ['$scope', 'Document', '$stateParams', 'Download', '$filter', '$location',
		function ($scope, Document, $stateParams, Download, $filter, $location) {
			
			$scope.showFailureAlert = false;
			$scope.descriptionShow = false;
			$scope.auteurShow = false;
			$scope.createurShow = false;
			$scope.avancementShow = false;
			$scope.dateShow = false;
			$scope.numeroFactureShow = false;
			$scope.nomClientShow = false;
			$scope.dateReunionShow = false;
			$scope.participantsShow = false;
			$scope.priorityShow = false;
			$scope.numCandidatsShow = false;
			$scope.guidShow = false;
			$scope.titreShow = false;
			$scope.contentTypeShow = false;
			$scope.contentLengthShow = false;
			$scope.nomDocumentShow = false;
			$scope.disableDownload = true;
			
			$scope.typeShow = false;
			$scope.showDownload = false;
			$scope.showTechnicalDetails = false;
			
			$scope.switchBool = function (value) {
				$scope[value] = !$scope[value];
			};
			
			$scope.document =  Document.query({guid: $stateParams.guid}, function() {
				//succès:
				$scope.typeShow = true;
				$scope.showDownload = true;
				$scope.showTechnicalDetails = true;
				
				if ($scope.document.contentType == null) {
					$scope.disableDownload = true;
				} else {
					$scope.disableDownload = false;
				};
				
				$scope.participants = [];
				$scope.numCandidats = [];
				
				if ($scope.document.participants != null) {
					$scope.participants = $scope.document.participants;
					$scope.participantsShow = true;
				};
				
				if ($scope.document.numCandidats != null) {
					$scope.numCandidats = $scope.document.numCandidats;
					$scope.numCandidatsShow = true;
				} else {
					$scope.numCandidatsShow = false;
				};
				
				if(!$scope.document.titre){
					console.log("Title field undefined");
				} else {
					$scope.titreShow = true;
				};
				if(!$scope.document.guid){
					console.log("Guid field undefined");
				} else {
					$scope.guidShow = true;
				};
				if(!$scope.document.description){
					console.log("Description field undefined");
				} else {
					$scope.descriptionShow = true;
				};
				if(!$scope.document.auteur){
					console.log("Author field undefined");
				} else {
					$scope.auteurShow = true;
				};
				if(!$scope.document.createur){
					console.log("Creator field undefined");
				} else {
					$scope.createurShow = true;
				};
				if(!$scope.document.avancement){
					console.log("avancement field undefined");
				} else {
					$scope.avancementShow = true;
				};
				if($scope.document.date == null){
					console.log("dateCreation field undefined");
				} else {
					$scope.dateShow = true;
				};
				if(!$scope.document.numeroFacture){
					console.log("numBill field undefined");
				} else {
					$scope.numeroFactureShow = true;
				};
				if(!$scope.document.nomClient){
					console.log("clientName field undefined");
				} else {
					$scope.nomClientShow = true;
				};
				if ($scope.document.dateReunion != null)
				//if (($scope.document.typeDoc == "Compte-rendu") && ($scope.document.dateMeeting != "undefined, undefined"))
				{
					$scope.dateReunionShow = true;
				} else {
					console.log("dateMeeting field undefined");
				};
				if(!$scope.document.priority){
					console.log("priority field undefined");
				} else {
					$scope.priorityShow = true;
				};
				if(!$scope.document.contentType){
					console.log("typeMIME field undefined");
				} else {
					$scope.contentTypeShow = true;
					$scope.contentLengthShow = true;
				};
				if(!$scope.document.nomDocument){
					console.log("nameDoc field undefined");
				} else {
					$scope.nomDocumentShow = true;
				};
				var resultingList = [];
				
				if (($scope.document.type == "Compte-rendu") && ($scope.document.numCandidats != null)) {
				
				$scope.document.numCandidats.forEach(function(numCandidat) {
				if (numCandidat == null) {
					numCandidat = 0;
					resultingList.push(numCandidat);
					}
				});
				
				console.log("$scope.document.numCandidats.length: " + $scope.document.numCandidats.length);
				console.log("resultingList.length: " + resultingList.length);
				
				if (resultingList.length === $scope.document.numCandidats.length) {
					console.log("All fields of numCandidats are null, don't show the field");
				} else {
					console.log("numCandidats is not completely empty");
					$scope.numCandidatsShow = true;
					};
				};
			}, function(error) {
					//cas d'erreur:
					$scope.showFailureAlert = true;
					$scope.errorMessage = error.data;// "Il n'existe pas de document avec le guid renseigné";
			});
			
			$scope.download = function(guid) {
				//var result = Download.query({guid: guid}, function() {});
				window.location.href = CONTEXT_PATH + 'api/document/' + guid + '/download';
				//console.log(result);
			};
				
			$scope.getTechnicalDetails = function(guid) {
				console.log("in the technical details");
				$location.path('/docs/details/techniques/guid=' + guid);
			};
			
		}])
		
		.controller('docCtrl', ['$scope', '$http', 'jsonFilter', 'transformRequestAsFormPost', 'GenerateGuid', '$upload', 
		'$location', '$timeout', '$route', 'datepickerPopupConfig', '$filter', '$state', 'AlertService',
		function($scope, $http, jsonFilter, transformRequestAsFormPost, GenerateGuid, $upload, $location, $timeout,
				$route, datepickerPopupConfig, $filter, $state, AlertService) {
					
		$scope.myForm = {};
		$scope.showSuccessAlert = false;
		$scope.showFailureAlert = false;
		$scope.numeroFactureShow = false;
		$scope.numCandidatsShow = false;
		$scope.nomClientShow = false;
		$scope.dateReunionShow = false;
		$scope.participantsShow = false;
		$scope.avancementShow = false;
		$scope.empreinteShow = false;
		$scope.inconnuShow = false;
		$scope.url = " ";
		$scope.dataMsgError = [];
					
		var currentURL = window.location.href.toString().split(window.location.host)[1];
		console.log(currentURL);
		console.log("Current state: " + $state.current.name);
		var currentState = $state.current.name;
			
		if (currentState == "newDocument.facture") {
			//facture
			$scope.typeForTitle = "Facture";
			$scope.type = "ecole:facture";
			$scope.numeroFactureShow = true;
			$scope.nomClientShow = true;
			$scope.inconnuShow = true;
			$scope.url = 'facture';
		} else if (currentState == "newDocument.compteRendu") {
			//compte-rendu
			$scope.typeForTitle = "Compte-rendu";
			$scope.type = "ecole:compteRendu";
			$scope.dateReunionShow = true;
			$scope.participantsShow = true;
			$scope.numCandidatsShow = true;
			$scope.url = 'compteRendu';
		} else if (currentState == "newDocument.note") {
			//note
			$scope.typeForTitle = "Note";
			$scope.type = "ecole:note";
			$scope.avancementShow = true;
			$scope.empreinteShow = true;
			$scope.url = 'note';
		}
				
		$scope.fields = [];
		$scope.fieldsCandidats = [];
		
		$scope.generateInputParticipants = function() {
		console.log("Generate input");
		$scope.fields.push({input:""});
		};
		
		$scope.removeInputParticipants = function(index) {
			console.log("Delete input at index: ", index);
			$scope.fields.splice(index, 1);
		};
		
		$scope.generateInputNumCandidats = function() {
			console.log("Generate input");
			$scope.fieldsCandidats.push({input:""});
		};
			
		$scope.removeInputNumCandidats = function(index) {
			console.log("Delete input at index: ", index);
			$scope.fieldsCandidats.splice(index, 1);
		};
			
			
		$scope.incrementPriority = function() {
			console.log("Actual priority: " + $scope.priority);
			var priorityInt = Number($scope.priority); 
			if ( priorityInt >= "99" ) {
				return;
			}
			priorityInt += 1;
			$scope.priority = priorityInt;
		};
		
		$scope.decrementPriority = function() {
			console.log("Actual priority: " + $scope.priority);
			var priorityInt = Number($scope.priority);
			if ($scope.priority <= "0") {
				return;
			}
			priorityInt -= 1;
			$scope.priority = priorityInt;
		};
		
		$scope.generate = function() {
			var guid = GenerateGuid.query({}, function(){});
			$scope.guid = guid;
		};
		
		$scope.onFileSelect = function($files) {
			$scope.files =  $files;
		};
		
		$scope.switchBool = function (value) {
			$scope[value] = !$scope[value];
		};
		
		//Time and date pickers
		$scope.datepickers = {
			date: false,
			tpsCreation: false,
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
		
		$scope.initDate = new Date('2016-15-20');
		
		datepickerPopupConfig.currentText = 'Aujourd\'hui';
		datepickerPopupConfig.clearText = 'Effacer';
		
		//Time picker
		$scope.tpsCreation = new Date();
		$scope.ismeridian = false;
		
		$scope.changed = function () {
		console.log('Time changed to: ' + $scope.tpsCreation);
		};
		
		$scope.submitTheForm = function() {
			console.log("TITLE:" + $scope.titre);
			var fieldValues = [];
			var fieldCandidatsValues = [];
			
			$scope.fields.forEach(function(field) {
				if (field.input == "") {
					//don't do anything
				} else {
				fieldValues.push(field.input);
				}
			});
			console.log("fieldValues: " + fieldValues);
			
			console.log("Participant1: " + $scope.participant1);
			if ($scope.participant1 != null) {
				fieldValues = fieldValues.concat($scope.participant1);
			}
			console.log("fieldValues after adding participant1: " + fieldValues);
			var listParticipants = '' + fieldValues;
			console.log("list participants: " + listParticipants);
			
			$scope.fieldsCandidats.forEach(function(field) {
				if (field.input == "") {
					//don't do anything
				} else {
					fieldCandidatsValues.push(field.input);
				}
			});
			console.log("fieldCandidatsValues: " + fieldCandidatsValues);
			
			console.log("numCandidat1: " + $scope.numCandidat1);
			if ($scope.numCandidat1 != null) {
				fieldCandidatsValues = fieldCandidatsValues.concat($scope.numCandidat1);
			}
			console.log("fieldCandidatsValues after adding numCandi1: " + fieldCandidatsValues);
			var listCandidats = '' + fieldCandidatsValues;
			console.log("list candidats: " + listCandidats);
			
			if (!$scope.guid || $scope.guid.value == "") {
				console.log("Vous devez ajouter un guid");
				$scope.showFailureAlert = true;
				$scope.errorMessage = "Il faut ajouter un identifiant metier";
				return;
			}
			
			if (!$scope.files) {
				console.log("No file added to the document");
				$scope.files = [];
			}
			
			var dateFiltered = $filter('date')($scope.date, 'dd/MM/yyyy', 'UTC'); //'yyyy-MM-dd'
			var timeFiltered = $filter('date')($scope.tpsCreation, 'HH:mm:ss', 'UTC');
			console.log("dateCreation filtered: " + dateFiltered);
			console.log("timeCreation filtered: " + timeFiltered);
			var combinationDateTimeCreation = dateFiltered +  " " + timeFiltered;
			
			var dateFilteredMeeting = $filter('date')($scope.dateReunion, 'dd/MM/yyyy', 'UTC');
			var timeFilteredMeeting = $filter('date')($scope.tpsMeeting, 'HH:mm:ss', 'UTC');
			console.log("dateMeeting filtered: " + dateFilteredMeeting);
			console.log("timeMeeting filtered: " + timeFilteredMeeting);
			var combinationDateTimeMeeting = undefined;
			if (dateFilteredMeeting && timeFilteredMeeting) {
				combinationDateTimeMeeting = dateFilteredMeeting + " " + timeFilteredMeeting;
			}
			
			console.log("Length of $scope.files: " + $scope.files.length);
			if ($scope.files.length == "0") {
				$scope.upload = [];
				var data = {
					guid: $scope.guid.value,
					date: combinationDateTimeCreation,
					participants: listParticipants
				};
				
				if ($scope.titre) data.titre = $scope.titre;
				if ($scope.description) data.description = $scope.description;
				if ($scope.auteur) data.auteur = $scope.auteur;
				if ($scope.createur) data.createur = $scope.createur;
				if ($scope.avancement) data.avancement = $scope.avancement;
				if ($scope.numeroFacture) data.numeroFacture = $scope.numeroFacture;
				if ($scope.nomClient) data.nomClient = $scope.nomClient;
				if ($scope.priority) data.priority = $scope.priority;
				if ($scope.nomDocument) data.nomDocument = $scope.nomDocument;
				if ($scope.empreinte) data.empreinte = $scope.empreinte;
				if (combinationDateTimeMeeting) data.dateReunion = combinationDateTimeMeeting;
				
				if (listCandidats) data.numCandidats = listCandidats;
				
				if (file) data.monFichier = file;
				if ($scope.inconnu) data.inconnu = $scope.inconnu;
				
				$scope.upload = $upload.upload({
					url: 'api/document/create' + '/' + $scope.url, 
					method: 'POST',
					data: data
				}).progress(function(evt) {
					var percent = parseInt(100.0 * evt.loaded / evt.total);
					console.log('percent: ' + percent);
				}).success(function(data, status, headers, config) {
					$scope.dataMsgError = data;
					console.log(data);
					var msgToDisplay = "Formulaire soumis avec succès";
					AlertService.addAlertMessage(msgToDisplay);
					var timer=false;
					$scope.$watch('submitButton', function() {
						if(timer){
							$timeout.cancel(timer);
						}
							timer= $timeout(function() {
								$location.path('/docs/overview');
							},1000);
						});
				}).error(function(data, status, headers, config) {
					/*
					$scope.dataMsgError = jsonFilter(data);
					console.log('dataMsgError: ' + $scope.dataMsgError);
					*/
					$scope.showFailureAlert = true;
					$scope.errorMessage = "HttpStatus: " + status + ", Message: " + data.message;
				});
				
				} else {
				//si il y a un contenu ou des contenus ajoutés au fichier
					for (var i = 0; i < $scope.files.length; i++) {
						if ($scope.files.length >= 1) {
							console.log("Length >=1");
							var file = $scope.files[i];
							console.log("File at index:" + i + " has the name: " + file.name);
							console.log("File size at index: " + i + " has the size: " + file.size);
						} else {
							var file = [];
							console.log("Length <1");
						}
						var logResult = function (str, data, status, headers, config) {
							return str + "\n\n" + "data: " + data + "\n\n" + "status: " + status + "\n\n" + "headers: " + jsonFilter(headers()) + "\n\n" +
							"config: " + jsonFilter(config);
						};
						
						$scope.upload = [];
						
						var data = {
							guid: $scope.guid.value,
							date: combinationDateTimeCreation,
							participants: listParticipants
						};
						

						if ($scope.titre) data.titre = $scope.titre;
						if ($scope.description) data.description = $scope.description;
						if ($scope.auteur) data.auteur = $scope.auteur;
						if ($scope.createur) data.createur = $scope.createur;
						if ($scope.avancement) data.avancement = $scope.avancement;
						if ($scope.numeroFacture) data.numeroFacture = $scope.numeroFacture;
						if ($scope.nomClient) data.nomClient = $scope.nomClient;
						if ($scope.priority) data.priority = $scope.priority;
						if ($scope.nomDocument) data.nomDocument = $scope.nomDocument;
						if (listCandidats) data.numCandidats = listCandidats;
						if ($scope.empreinte) data.empreinte = $scope.empreinte;
						if (file) data.monFichier = file;
						if ($scope.inconnu) data.inconnu = $scope.inconnu;
						if (combinationDateTimeMeeting) data.dateReunion = combinationDateTimeMeeting;
						
						console.log("End url: " + $scope.url);
						
						$scope.upload = $upload.upload({
							url: 'api/document/create' + '/' + $scope.url, 
							method: 'POST',
							data: data
							}).progress(function(evt) {
								var percent = parseInt(100.0 * evt.loaded / evt.total);
								console.log('percent: ' + percent);
							}).success(function(data, status, headers, config) {
								console.log(data);
								var msgToDisplay = "Formulaire soumis avec succès";
								AlertService.addAlertMessage(msgToDisplay);
								logResult("POST SUCCESS", data, status, headers, config);
								//$scope.showSuccessAlert = true;
								//display a message of success and go back to the main view after 2sec:
								var timer=false;
								$scope.$watch('submitButton', function(){
									if(timer){
										$timeout.cancel(timer);
									}
									timer= $timeout(function(){
										$location.path('/docs/overview');
									},1000);
								});
							}).error(function(data, status, headers, config) {
								logResult("POST ERROR", data, status, headers, config);
								$scope.showFailureAlert = true;
								$scope.errorMessage = "HttpStatus: " + status + ", Message: " + data.message;
							});
						}
							}
					};
				}]);
