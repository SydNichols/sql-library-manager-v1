const express = require('express');
const router = express.Router();
const { Book } = require('../models');

//new book form
router.get('/new', (req, res) => {
    res.render('new-book', { book: {}, title: 'New Book' });
});

//adding books to list
router.post('/new', async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const book = await Book.build(req.body);
            res.render('new-book', {
                book,
                errors: error.errors,
                title: 'New Book'
            });
        } else {
            next(error);
        }
    }
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