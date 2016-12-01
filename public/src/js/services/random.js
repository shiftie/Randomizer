angular.module('Randomizer.services.random', []).service('RandomService', function($http) {
    const service = this;

    service.getRandom = () => {
        return $http.get('https://www.random.org/integers/?num=1&min=0&max=1&col=1&base=10&format=plain&rnd=new');
    }
});
