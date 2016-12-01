const EventEmitter = require('events').EventEmitter;
const evt = new EventEmitter();

module.exports = {
    removeCandidateFromGroups: (candidate) => {
        evt.emit('removeCandidateFromGroups', candidate);
    },
    handleCandidateRemovalFromGroups: (handler) => {
        evt.on('removeCandidateFromGroups', handler);
    }
};
