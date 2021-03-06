'use strict'
var mongoose = require('mongoose');
var app = require('./app');

require('dotenv').config({path: 'variables.env'})

var port = process.env.PORT || 3900;
var url = process.env.URL
var host = process.env.HOST || '0.0.0.0';

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true })
        .then(() => {
          console.log('la conexion a la base de datos se a conectado correcta!!');

          //crear servidor y ponerme a escuchar peticiones HTTP
          app.listen(port, host, () => {
            console.log('servidor corriendo');
          });
        })