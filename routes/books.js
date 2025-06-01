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

//render the book details
router.get('/:id', async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            res.render('update-book', {book, title: book.title });
        } else {
            const err = new Error();
            err.status = 404;
            err.message = "Sorry! We couldn't find the book you were looking for.";
            next(err);
        }
    } catch (error) {
        next(error);
    }
});

//update book POST
router.post('/:id', async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books');
        } else {
            const err = new Error();
            err.status = 404;
            err.message = "Sorry! We couldn't find the book you were looking for.";
            next(err);
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const book = await Book.build(req.body);
            book.id = req.params.id;
            res.render('update-book', {
                book,
                errors: error.errors,
                title: 'Update Book'
            });
        } else {
            next(error);
        }
    }
});

//delete book POST
router.post('/:id/delete', async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.destroy();
            res.redirect('/books');
        } else {
            const err = new Error();
            err.status = 404;
            err.message = "Sorry! We couldn't find the book you were looking for.";
            next(err);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;