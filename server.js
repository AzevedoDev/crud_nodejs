const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let ObjectId = require('mongodb').ObjectID;

// Conexao com o banco
const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://pedro:Pa22101350@ds058739.mlab.com:58739/crudteste";

MongoClient.connect(
  uri,
  { useNewUrlParser: true },
  (err, client) => {
    if (err) console.log(err);
    db = client.db("crudteste");

    app.listen(3000, () => console.log("Server up on port 3000"));
  }
);
//-----------------------------------------------------


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/", (req, res) => {
  let cursor = db.collection("data").find();
});

app.get("/show", (req, res) => {
  db.collection("data")
    .find()
    .toArray((err, results) => {
      if (err) console.log(err);
      res.render("show.ejs", { data: results });
    });
});

app.post("/show", (req, res) => {
    db.collection("data").insertOne(req.body, (err, result) => {
        if (err) console.log(err);
        
        console.log("Salvo no Banco de Dados");
        res.redirect("/show");
  });
});



//---------Editar conteudo------------------
app.route('/edit/:id')
.get((req, res) =>{
    var id = req.params.id;

    db.collection('data').find(ObjectId(id)).toArray((err, result) =>{
        if (err) res.send(err);
        res.render('edit.ejs',{data: result});
    })
})
.post((req,res) => {
    var id = req.params.id;
    var name = req.body.name;
    var lastname = req.body.lastname;

    db.collection('data').updateOne({_id: ObjectId(id)},{
        $set: {
            name: name,
            lastname: lastname
        }
    }, (err, result) =>{
        if(err) res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados');
        console.log(id,name,lastname);
        
    })
})

//-------------Deletar Conteudo---------------------------
app.route('/delete/:id').get((req,res) => {
    let id = req.params.id;

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) res.send(500, err)
        console.log('deleteado do banco de dados');
        res.redirect('/show');
        
    })
})