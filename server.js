const express = require('express');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const candidates = require('./routes/candidates');
const groups = require('./routes/groups');
const app = express();

app.use('/', express.static('public/dist/css'));
app.use('/', express.static('public/dist/js'));
app.use('/', express.static('public/src/js'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/candidates', candidates);
app.use('/groups', groups);

app.get('/', function (req, res) {
   res.sendFile(path.resolve('./public/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
