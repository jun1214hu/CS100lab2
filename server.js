
// const _ = require('lodash');
const express = require('express');
// const async = require('async');
const path = require('path');
require('cross-fetch/polyfill');

const app = express();
const host = '127.0.0.1';
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const API_KEY = "8d33e1b0-b77e-11e8-bf0e-e9322ccde4db";

// behavior for the index route
app.get('/', (req, res) => {
  const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    res.render('index', {galleries: data.records});
  });
});


app.get('/gallery/:gallery_id', function(req, res) {
    res.send(`You are on gallery ${req.params.gallery_id}`);
    // convert info to json
    const objURL = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}&gallery=${req.params.gallery_id}`;
    fetch(objURL)
        .then(response => response.json())
        .then(data => {
            res.render('index', {galleries: data.records});
            // ejs
            // header = bootstrap. gallery listening
            // unordered list
            // run a loop
            // each item is a link to an object
            //  url/gallery/
            // footer =
        });
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}/`);
});
