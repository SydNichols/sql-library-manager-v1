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
        //create new book with the form
        const book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        //catch for validation errors with the title
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

//render books from list + search functionality for extra credit
router.get('/', async(req, res, next) => {
    try {
        const search = req.query.search;
        let books;

        if (search) {
            const { Op } = require('sequelize');

            //search all fields
            books = await Book.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { author: { [Op.like]: `%${search}%` } },
                        { genre: { [Op.like]: `%${search}%` } },
                        { year: { [Op.like]: `%${search}%` } }
                    ]
                }
            });
        } else {
            books = await Book.findAll();
        }
        //render the list of books with the search term
        res.render('index', { books, search, title: 'Books' });
    } catch (error) {
        next(error);
    }
});

//render the book details
router.get('/:id', async (req, res, next) => {
    try {
        //find the book by id using findByPk
        const book = await Book.findByPk(req.params.id);
        if (book) {
            res.render('update-book', {book, title: book.title });
        } else {
            //404 if not found
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
    //pull up book by id
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books');
        } else {
            //404 if book not found
            const err = new Error();
            err.status = 404;
            err.message = "Sorry! We couldn't find the book you were looking for.";
            next(err);
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            //hande validation errors
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
            //redirect to books homepage after book is deleted
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