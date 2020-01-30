import BookInstance from '../models/bookInstance'
import Book from '../models/book'

import { body, validationResult, sanitizeBody } from 'express-validator'

export const bookInstanceList = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, listBookInstances) => {
      if (err) return next(err)
      res.render('bookInstanceList', {
        title: 'Book Instance List',
        bookInstanceList: listBookInstances
      })
    })
}

export const bookInstanceDetail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookInstance) => {
      if (err) return next(err)
      if (bookInstance === null) {
        const err = new Error('Book copy not found')
        err.status = 404
        return next(err)
      }
      res.render('bookInstanceDetail', {
        title: 'Copy: ' + bookInstance.book.title,
        bookInstance: bookInstance
      })
    })
}

export const bookInstanceCreateGet = (req, res) => {
  Book.find({}, 'title').exec((err, books) => {
    if (err) {
      return next(err)
    }
    res.render('bookInstanceForm', {
      title: 'Create BookInstance',
      bookList: books
    })
  })
}

export const bookInstanceCreatePost = [
  body('book', 'Book must be specified')
    .isLength({ min: 1 })
    .trim(),
  body('imprint', 'Imprint must be specified')
    .isLength({ min: 1 })
    .trim(),
  body('due-back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),
  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status')
    .trim()
    .escape(),
  sanitizeBody('due-back').toDate(),

  (req, res, next) => {
    const errors = validationResult(req)
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body['due-back']
    })

    if (!errors.isEmpty()) {
      Book.find({}, 'title').exec((err, books) => {
        if (err) {
          return next(err)
        }
        res.render('bookInstanceForm', {
          title: 'Create BookInstance',
          bookList: books,
          selectedBook: bookInstance.book._id,
          errors: errors.array(),
          bookInstance: bookInstance
        })
      })
      return
    } else {
      bookInstance.save(err => {
        if (err) {
          return next(err)
        }
        res.redirect(bookInstance.url)
      })
    }
  }
]

export const bookInstanceDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstanceDelete GET')
}

export const bookInstanceDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST')
}

export const bookInstanceUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET')
}

export const bookInstanceUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST')
}
