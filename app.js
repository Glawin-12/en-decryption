const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const app = express();

const router = require('./route/encrypt');

const viewPath = path.join(__dirname, './views');

app.set('view engine', 'hbs');
app.set('views', viewPath);

app.use(express.json());
app.use(express.static(viewPath));
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES REALTED CODE
app.use(router);


app.listen(5000, () => {
    console.log('server is up on port:  http://localhost:5000');
});





