import BookInstance from '../models/bookInstance'
import Book from '../models/book'
import async from 'async'

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

export const bookInstanceCreateGet = (req, res, next) => {
  Book.find({}, 'title').exec((err, books) => {
    if (err) return next(err)
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
        if (err) return next(err)
        const dueBack =
          bookInstance.due_back === void 0
            ? void 0
            : bookInstance.due_back.toISOString().split('T')[0]
        return res.render('bookInstanceForm', {
          title: 'Create BookInstance',
          bookList: books,
          errors: errors.array(),
          bookInstance: bookInstance,
          dueBack: dueBack
        })
      })
    }

    bookInstance.save(err => {
      if (err) return next(err)
      res.redirect(bookInstance.url)
    })
  }
]

export const bookInstanceDeleteGet = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookInstance) => {
      if (err) return next(err)
      if (bookInstance === null || bookInstance === void 0) {
        return res.redirect('/catalog/bookInstances')
      }

      res.render('bookInstanceDelete', {
        title: 'Delete BookInstance',
        bookInstance: bookInstance
      })
    })
}

export const bookInstanceDeletePost = (req, res, next) => {
  BookInstance.findByIdAndDelete(req.body.bookinstanceid, err => {
    if (err) return next(err)
    res.redirect('/catalog/bookInstances')
    return
  })
}

export const bookInstanceUpdateGet = (req, res, next) => {
  async.parallel(
    {
      bookInstance: callback => {
        BookInstance.findById(req.params.id)
          .populate('book')
          .exec(callback)
      },
      books: callback => {
        Book.find({}, 'title').exec(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      if (results.bookInstance === null || results.bookInstance === void 0) {
        const err = new Error('BookInsatnce not found')
        err.status = 404
        return next(err)
      }

      const dueBack =
        results.bookInstance.due_back === void 0
          ? void 0
          : results.bookInstance.due_back.toISOString().split('T')[0]
      res.render('bookInstanceForm', {
        title: 'Update BookInstance',
        bookInstance: results.bookInstance,
        bookList: results.books,
        dueBack: dueBack
      })
    }
  )
}

export const bookInstanceUpdatePost = [
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
      due_back: req.body['due-back'],
      _id: req.params.id
    })

    if (!errors.isEmpty()) {
      Book.find({}, 'title').exec((err, books) => {
        if (err) return next(err)
        const dueBack =
          bookInstance.due_back === void 0
            ? void 0
            : bookInstance.due_back.toISOString().split('T')[0]
        return res.render('bookInstanceForm', {
          title: 'Update BookInstance',
          bookList: books,
          errors: errors.array(),
          bookInstance: bookInstance,
          dueBack: dueBack
        })
      })
    }

    BookInstance.findByIdAndUpdate(
      req.params.id,
      bookInstance,
      (err, thebookInstance) => {
        if (err) return next(err)
        res.redirect(thebookInstance.url)
      }
    )
  }
]
