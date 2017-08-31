const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');

const server = express();

server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');

server.use(bodyparser.urlencoded({ extended: true }));

const db = new Sequelize('todo', 'kristablachian', '', {
    dialect: 'postgres',
});
const Task = db.define('task', {
    name: Sequelize.STRING,
    completed: Sequelize.BOOLEAN,
});

// Sychronize the 'dog' schema with the database, meaning make
// sure all tables exist and have the right fields.
Task.sync().then(function () {
    console.log('todo list yay');
});

server.get('/', function (req, res) {
    // Get all tasks and render them on the page.
    Task.findAll({
        where: {    // this is really powerful (there are lots of things
    //                 // you can do here).

         }
     }).then(function (task) {
        res.render('todolist', {
            todoitem: task , // todo: get info from database
       });
     });
});

server.get('/add', function (req, res) {
    res.render('add');
});

server.post('/addtodo', function (req, res) {
    Task.create({
        name: req.body.task,
        completed: req.body.completed,
    }).then(function () {
        // Wait until insert is finished, then redirect.
        res.redirect('/');
    });
});

server.post('/complete/:id', function (req, res) {
  const id = parseInt(req.params.id);
  Task.update({completed: true}, {where: {id: id}})
  .then(function() {
    res.redirect('/');
  });
});



server.listen(3027);
