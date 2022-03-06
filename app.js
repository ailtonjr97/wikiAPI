//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://ailtonjr:/@cluster0.dq7kh.mongodb.net/wikiDB");

const articleSchema = {
  title: String,
  content: String,
}

const Article = mongoose.model('Article', articleSchema);

const Fact = mongoose.model('Fact', articleSchema);

app.route('/articles')

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if(err){
      res.send(err)
    } else{
      res.send(foundArticles);
    }
  });
})

.post(function(req, res){
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function(err){
    if(err){
      console.log('Ocorreu um erro. Favor tentar novamente')
    } else{
      res.send('Formulário enviado com sucesso!')
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(err){
      res.send('Houve um erro ao tentar excluir. Favor entrar em contato com o administrador do sistema.')
    } else{
      res.send('Excluído com sucesso.')
    }
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.route('/articles/:articleTitle')
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, found){
    if(err){
      res.send('Página não encontrada')
    }else{
      res.send(found)
    }
  });
})

.post(function(req, res){
  const fact = new Article ({
    title: req.body.title,
    content: req.body.content
  })
  fact.save(function(err){
    if(err){
      res.send('Ocorreu um erro. Tente novamente.')
    }
  });
})

.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(err){
        res.send('Teste erro')
      };
    }
  )
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(err){
        res.send('Teste erro1')
      } else{
        res.send('Deu certo')
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(err){
        res.send(err)
      } else{
        res.send('Excluído')
      }
    }
  )
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
