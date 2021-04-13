'use strict'
var env = require('node-env-file');
env(__dirname + '/.env');

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3900;
var url = process.env.URL

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true })
        .then(() => {
          console.log('la conexion a la base de datos se a conectado correcta!!');

          //crear servidor y ponerme a escuchar peticiones HTTP
          app.listen(port, () => {
            console.log('servidor corriendo en http://localhost:'+port);
          });
        })