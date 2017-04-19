'use strict';

angular.module('clientApplication.filters', [])
	
	.filter('detailsURLfilter', function() {
		
		return function(input) {
			console.log("Input: " + input);
			//var inputWithoutQuotes = input?input.replace(/"/g, ''):'';
			var inputWithFirstLetterLowercase = input.charAt(0).toLowerCase() + input.toString().substring(1);
			console.log("inputWithFirstLetterLowercase: " + inputWithFirstLetterLowercase);
			
			for (var i=0; i<inputWithFirstLetterLowercase.length-1; i++) {
				if (inputWithFirstLetterLowercase.charAt(i) == " ") {
					console.log("in the if loop");
					inputWithFirstLetterLowercase = inputWithFirstLetterLowercase.replace(/ /g, '');
					console.log(inputWithFirstLetterLowercase);
					/*
					var letter = inputWithFirstLetterLowercase.charAt(i+1);
					letter = letter.toString().toLowerCase();
					var rest = inputWithFirstLetterLowercase.toString().substring(i+2);
					var firstPart = inputWithFirstLetterLowercase.slice(0, i+1);
					inputWithFirstLetterLowercase = firstPart + letter + rest;
					*/
				}
				
			}
			return inputWithFirstLetterLowercase;
		};
	})
	.filter('currentStateFilter', function() {
		return function(currentState) {
			console.log("Current state: " + currentState);
			for (var i=0; i<currentState.length-1; i++) {
				if (currentState.charAt(i) == ".") {
					var lastSegmentState = currentState.toString().substring(i+1); 
					return lastSegmentState;
				}
			}
		};
	});

