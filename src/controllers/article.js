'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Article = require('../models/article');

var controller = {

  save: (req, res) =>{
    // Recoger los parametros por post 
    var params = req.body;

    // Validar datos (validator)
    try{
      var validate_ci = !validator.isEmpty(params.ci);
      var validate_name = !validator.isEmpty(params.name);
      var validate_cibank = !validator.isEmpty(params.cibank);
      var validate_bank = !validator.isEmpty(params.bank);
      var validate_namebank = !validator.isEmpty(params.namebank);
      var validate_numberbank = !validator.isEmpty(params.numberbank);
      var validate_typebank = !validator.isEmpty(params.typebank);

    }catch(err){
      return res.status(200).send({
        status: 'error',
        message: 'Faltan datos por enviar !!'
      });
    }

    if(validate_ci && validate_name && validate_cibank && validate_bank && validate_namebank && validate_numberbank && validate_typebank){
      // Crear el objeto a guardar
      var article = new Article();

      // Asignar valores
      article.ci = params.ci;
      article.name = params.name;
      article.cibank = params.cibank;
      article.bank = params.bank;
      article.namebank = params.namebank;
      article.numberbank = params.numberbank;
      article.typebank = params.typebank


      // Guardar el articulo
      article.save((err, articleStored) =>{
        if(err || !articleStored){
          return res.status(404).send({
            status: 'error',
            message: 'el articulo no se a guardado'
          });
        }

      // Devolver una respuesta
        return res.status(200).send({
          status: 'success',
          article: articleStored
        })

      });  
    }else{
      return res.status(200).send({
        status: 'error',
        message: 'Los datos no son validos !!'
      });
    }
  },

  getArticles: (req, res)=>{

    var query = Article.find({});

    var last = req.params.last;
    if(last || last != undefined){
      query.limit(5);
    }

    //Find recibir los articulos
    query.sort('-_id').exec((err, articles) =>{

      if(err){
        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver los articulos !!'
        });
      };

      if(!articles){
        return res.status(404).send({
          status: 'error',
          message: 'No hay articulos para mostrar !!'
        });
      };

      return res.status(200).send({
        status: 'success',
        articles
      });
    });

  },

  getArticle: (req, res) =>{

    // Recoger el id de la url

    var articleId = req.params.id;

    // Comprobar que existe

    if(!articleId || articleId == null){
      return res.status(404).send({
        status: 'error',
        message: 'No existe el articulo !!!'
      });
    }

    // Buscar el articulo
    Article.findById(articleId, (err, article) =>{
      
      if(err || !article){
        return res.status(404).send({
          status: 'error',
          message: 'No existe el articulo !!!'
        });
      }

      // Devolverlo en json
      return res.status(200).send({
        status: 'success',
        article
      });

    });
  },

  update: (req, res) =>{

    // Recoger el id del articulo por la url+
    var articleId = req.params.id;

    // Recoger los datos que llegan por put
    var params = req.body;

    // Validar datos
    try{
      var validate_ci = !validator.isEmpty(params.ci);
      var validate_name = !validator.isEmpty(params.name);
      var validate_cibank = !validator.isEmpty(params.cibank);
      var validate_bank = !validator.isEmpty(params.bank);
      var validate_namebank = !validator.isEmpty(params.namebank);
      var validate_numberbank = !validator.isEmpty(params.numberbank);
      var validate_typebank = !validator.isEmpty(params.typebank);
    }catch(err){
      return res.status(200).send({
        status: 'error',
        message: 'Faltan datos por enviar !!!'
      });
    }

    if(validate_ci && validate_name && validate_cibank && validate_bank && validate_namebank && validate_numberbank && validate_typebank){
      // Find and Update
      Article.findByIdAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) =>{
        if(err){
          return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar !!!'
          })
        }
        if(!articleUpdated){
          return res.status(404).send({
            status: 'error',
            message: 'No existe el articulo !!!'
          })
        }
        return res.status(200).send({
          status: 'success',
          articleUpdated
        })
      }); 
    }else{
      // Devolver respuesta
      return res.status(200).send({
        status: 'error',
        message: 'La validacion no es correcta !!!'
      });
    } 
  },

  delete: (req, res) =>{
    //Recoger el id de la url
    var articleId = req.params.id;
    // Find and delete
    Article.findByIdAndDelete({_id:articleId}, (err, articleRemoved) =>{
      if(err){
        return res.status(500).send({
          status: 'error',
          message: 'Error al borrar !!!'
        })
      }
      if(!articleRemoved){
        return res.status(404).send({
          status: 'error',
          message: ' Noi se a borrado el articulo, posiblemente no exista !!!'
        });
      }

      return res.status(200).send({
        status: 'success',
        articleRemoved
      })

    });
  },

  search: (req, res) =>{
    // Sacar el string a mostrar
    var searchString = req.params.search;

    // Find or
    Article.find({"$or": [
      {"ci": {"$regex": searchString, "$options": "i"}},
      {"name": {"$regex": searchString, "$options": "i"}}
    ]})
    .sort([['date', 'descending']])
    .exec((err, articles) => {
      if(err){
        return res.status(500).send({
          status: 'error',
          message: 'Error en la peticion !!!'
        });
      }
      if(!articles || articles.length <= 0){
        return res.status(404).send({
          status: 'error',
          message: 'No hay articulos que coincidan con la busqueda !!!'
        });
      }
      return res.status(200).send({
        status: 'success',
        articles
      });
    });
  }


}; // end controller

module.exports = controller;