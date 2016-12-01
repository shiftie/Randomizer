import 'angular';
import 'angular-ui-router';
import './services/random';
import './routes';

angular.module('Randomizer', ['Randomizer.services.random', 'Randomizer.routes']).controller('RandomizerMainCtrl', function($scope, RandomService) {
    RandomService.getRandom().then((result) => {
        $scope.random = result.data;
    });
});
