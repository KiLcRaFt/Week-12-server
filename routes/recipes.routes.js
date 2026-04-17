const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    const recipes = await db.query('SELECT * FROM recipe;');  
    res.json(recipes.rows);
});

router.post('/', async (req, res) => {
    const {recipename} = req.body;

    const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

    console.log(data.rows);
    if(data.rows.length !== 0){
        res.json({message: "Recipe already exists!"});
    } 
    else {

        try{

            const result = await db.query("INSERT INTO recipe (recipename) VALUES ($1);", [recipename]);
            console.log(result.rowCount);
            res.status(200).json({message: `${result.rowCount} row was added.`});
        }
        catch(error) {
            console.log(error);
        }
    };
});

router.put('/', async (req, res) => {
    const {recipename, instructions} = req.body;

    const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

    if(data.rows.length === 0){
        res.json({message: "There is no such recipe."})
    }
    else {
        try{
            const result = await db.query("UPDATE recipe SET instructions = $1 WHERE recipename = $2;", [instructions, recipename]);
            res.status(200).json({message: `${result.rowCount} row was updated.`});
        }
        catch(error){
            console.log(error);
        }
    };
});

router.delete('/', async (req, res) => {
    const {recipename} = req.body;
    const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

    if(data.rows.length === 0){
        res.json({message: "There is no such recipe."})
    }
    else {
        try{
            const result = await db.query("DELETE FROM recipe WHERE recipename = $1;", [recipename]);
            res.status(200).json({message: `${result.rowCount} row was deleted.`});
        }
        catch(error){
            console.log(error);
        }
    };
});

module.exports = router;