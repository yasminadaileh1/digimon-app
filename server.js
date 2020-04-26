'use strict';
require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const PORT = process.env.PORT
const client = new pg.Client(process.env.DATABASE_URL);

const app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/hello',testPage);
app.get('/', homePage);
app.post('/add' , addToFav)
app.get('/fav' , favDigimon);
app.get('/detail/:id' , showDetails)
app.post('/update/:id' , updateDigimon)
app.post('/delete/:id' , deleteDigimon)


function testPage(req,res){
    res.status(200).send('helllloooo')
}
function homePage(req,res){
    const url =`https://digimon-api.herokuapp.com/api/digimon`;
    superagent.get(url)
    .then(data => {
       res.render('index' , {digimon :data.body})
    })
}
function addToFav(req , res){
    let {digimon_name , digimon_img , digimon_level} = req.body;
    let SQL = 
    `INSERT INTO digimonTable (digimon_name , digimon_img , digimon_level) VALUES ($1,$2,$3)`;
    let safeValues = [digimon_name , digimon_img , digimon_level];
    client.query(SQL , safeValues)
    .then( () => {
        res.redirect('/fav')
    })
}
function favDigimon(req,res){
    let SQL = `SELECT * FROM digimonTable;`;
    client.query(SQL)
    .then( data => {
        res.render('fav' , {digimon: data.rows})
    })
}
function showDetails(req,res){
    let SQL = `SELECT * FROM digimonTable WHERE id=$1;`;
    let value = [req.params.id];
    client.query(SQL , value)
    .then( data => {
        res.render('detail', {digimon:data.rows[0]})
    })
}
function updateDigimon(req,res){
    let {digimon_name , digimon_img , digimon_level } = req.body;
    let SQL = 
    ` UPDATE digimonTable SET digimon_name=$1, digimon_img=$2, digimon_level=$3 WHERE id =$4;`;
    let id = req.params.id;
    let values = [digimon_name , digimon_img , digimon_level,id];
    client.query(SQL , values)
    .then( () => {
        res.redirect(`/detail/${id}`);
    })
}
function deleteDigimon(req , res){
    let SQL = `DELETE * FROM digimonTable WHERE id=$1;`;
    let value = [req.params.id];
    client.query(SQL,value)
    .then(()=>{
        res.redirect('/fav')
    })
}
client.connect()
.then( ()=>{
    app.listen(PORT , () => {
        console.log(`this is my lovly PORT ${PORT}`)
    })
})
