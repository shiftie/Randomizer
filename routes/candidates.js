const fs = require('fs');
const _ = require('lodash');
const shortId = require('shortid');
const express = require('express');
const config = require('../config.js');
const sharedService = require('./shared');
const router = express.Router();
const dataFile = config.dataFile;

function checkDataFile(req, res, next) {
    try {
        fs.statSync(dataFile).isFile();
    }
    catch (err) {
        createDataFile();
    }

    next();
}

function createDataFile() {
    const data = {"candidates":[],"groups":[]};
    return fs.writeFileSync(dataFile, JSON.stringify(data));
};

function getCandidates() {
    const data = getAllData();
    return data.candidates;
}

function getAllData() {
    return JSON.parse(fs.readFileSync(dataFile).toString());
}

function updateAllData(data) {
    return fs.writeFileSync(dataFile, JSON.stringify(data));
}

router.all("/*", checkDataFile, function(req, res, next) {
    return next();
});

router.get('/', function (req, res) {
    res.send(getCandidates());
});

router.post('/', function (req, res) {
    const data = getAllData();
    const candidate = _.findIndex(data.candidates, (candidate) => { return candidate.name === req.body.name });
    if (candidate === -1 && req.body.name && req.body.name.length > 0) {
        data.candidates.push({id: shortId.generate(), name: req.body.name});
        updateAllData(data);
        res.send(_.last(data.candidates));
    }else{
        res.status(500).send('Name exists');
    }
});

router.delete('/:id/:name', function (req, res) {
    const data = getAllData();
    const candidate = _.remove(data.candidates, (candidate) => {
        return candidate.id === req.params.id;
    });

    if (candidate) {
        sharedService.removeCandidateFromGroups(candidate[0]);
        sharedService.updatedGroups.then((groups) => {
            console.log(groups);
        });
        // updateAllData(data);
    }

    res.send(candidate ? candidate[0] : '');
});


router.get('/:id', function (req, res) {
    const candidates = getCandidates();
    res.send(_.find(candidates, (candidate) => { return candidate.id === req.params.id }));
});

router.post('/:id', function (req, res) {
    const data = getAllData();
    const candidate = _.findIndex(data.candidates, (candidate) => { return candidate.id === req.params.id });
    if (candidate > -1 && req.body.name.length > 0) {
        data.candidates[candidate] = req.body;
    }
    updateAllData(data);

    res.send(data.candidates[candidate]);
});

module.exports = router;
