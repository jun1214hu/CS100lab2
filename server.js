
const _ = require('lodash');
const express = require('express');
// const async = require('async');
const path = require('path');
const bodyParser = require('body-parser');
require('cross-fetch/polyfill');
const session = require('express-session');

const app = express();
const host = '127.0.0.1';
const port = 3000;

const NAMES = [{
    objectNumber: "",
    username: "",
    comment: [""]
}];


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}));

// function commentRequired(req, res, next) {
//     if (!req.session.username) {
//         res.redirect('/login');
//     } else {
//         next();
//     }
// }

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

// behavior of the object route
app.get('/gallery/:gallery_id', function(req, res) {
    // res.send(`You are on gallery ${req.params.gallery_id}`);
    // convert info to json
    const objURL = `https://api.harvardartmuseums.org/object?size=100&apikey=${API_KEY}&gallery=${req.params.gallery_id}`;
    fetch(objURL)
        .then(response => response.json())
        .then(data => {
            res.render('object', {objects: data.records});
        });
});

// behavior of individual objects
app.get('/object/:objectnumber', function(req, res) {
    const objectComment = req.params.objectnumber;
    const singleURL = `https://api.harvardartmuseums.org/object?size=100&apikey=${API_KEY}&objectnumber=${req.params.objectnumber}`;
    fetch(singleURL)
        .then(response => response.json())
        .then(data => {
            res.render('singles', {singles: data.records[0], username: req.session['username'],
                users: NAMES});
        });
});

// behavior after posting a comment
app.post('/object/:objectnumber', function (req, res) {
    let {username, comment} = req.body;
    if (username && comment) {
            NAMES.push({
                objectNumber: req.params.objectnumber,
                username: username,
                comment: [comment]
            });
        }
        else alert("Please input a username and a comment");
        res.redirect(`/object/${req.params.objectnumber}`);
    });






app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
});
