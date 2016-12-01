import 'angular-ui-router';
import './candidates/routes';
import './groups/routes';

angular.module('Randomizer.routes', ['ui.router', 'Randomizer.candidates.routes', 'Randomizer.groups.routes']).config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: '/main.tmpl.html'
        });

    $urlRouterProvider.otherwise('/');
})
