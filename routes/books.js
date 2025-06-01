const express = require('express');
const router = express.Router();
const { Book } = require('../models');


router.get('/', async(req, res, next) => {
    try {
        const books = await Book.findAll();
        res.render('index', { books, title:'Books' });
    } catch (error) {
        next(error);
        //res.send(`Error: ${error.message}`)
    }
});

module.exports = router;