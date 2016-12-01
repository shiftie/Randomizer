import 'angular-resource';

angular.module('Randomizer.candidates.services',  ['ngResource']).factory('CandidatesService', function($resource) {
    return $resource('/candidates/:id/:name', {id: '@id'}, {update: {method: 'POST'}});
});
