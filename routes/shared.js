const EventEmitter = require('events').EventEmitter;
const Q = require('q');
const evt = new EventEmitter();
const deferred = Q.defer();

module.exports = {
    removeCandidate: (candidate) => {
        evt.emit('removeCandidate', candidate);

        return deferred.promise;
    },
    onRemoveCandidate: (handler) => {
        evt.on('removeCandidate', (candidate) => {
            deferred.resolve(handler(candidate));
        });
    }
};
