const express = require('express');
const router = express.Router();
const { Book } = require('../models');

//new book form
router.get('/new', (req, res) => {
    res.render('new-book', { book: {}, title: 'New Book' });
});

//render books from list
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