'use strict';

angular.module('clientApplication', [
	'ngResource',
	'ngRoute',
	'ui.router',
	'clientApplication.services',
	'clientApplication.filters',
	'angularFileUpload',
	'ui.bootstrap',
	'sy.bootstrap.timepicker',
	'template/syTimepicker/timepicker.html',
	'template/syTimepicker/popup.html',
	'frapontillo.bootstrap-switch'
])
	.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider
			.when('/', '/vue-principale/liste')
			.otherwise('/');
		$stateProvider
			.state('vue-principale', { 
				url: '/vue-principale',
				abstract: true,
				templateUrl: URLS.vuePrincipale, 
			})
			
			.state('nouveau-document', {
				url: '/nouveau-document',
				abstract: true,
				templateUrl: URLS.vuePrincipale,
			})
			
			.state('nouveau-document.note', {
				url: '/note',
				templateUrl: URLS.noteForm,
				controller: 'form-controller'
			})
			
			.state('nouveau-document.facture', {
				url: '/facture',
				templateUrl: URLS.factureForm,
				controller: 'form-controller'
			})
			
			.state('nouveau-document.compte-rendu', {
				url: '/compte-rendu',
				templateUrl: URLS.compteRenduForm,
				controller: 'form-controller'
			})
			
			.state('nouveau-document.documentStandard', {
				url: '/documentStandard',
				templateUrl: URLS.standardForm,
				controller: 'form-controller'
			})
			
			.state('vue-principale.liste', { 
				url: '/liste',
				templateUrl: URLS.liste,
				controller: 'list-controller'
			})
			
			.state('vue-principale.recherche', { 
				url: '/recherche', 
				templateUrl: URLS.recherche,
				controller: 'search-controller'
			})
			
			.state('vue-principale.details', {
				url: '/details/guid=:guid',
				templateUrl: URLS.details,
				controller: 'details-controller'
			})
			
			.state('vue-principale.techniques', {
				url: '/details/techniques/guid=:guid',
				templateUrl: URLS.detailsTechniques,
				controller: 'details-techniques-controller'
			});
	})
	.config(function (datepickerConfig, datepickerPopupConfig) {
		datepickerConfig.showWeeks = false;
		datepickerPopupConfig.toggleWeeksText = null;
	})
	
	.run(function ($rootScope, $state, $stateParams, $log) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.clientApplicationServerUrl = window.location.protocol + '//' + window.location.host;
	})
;
