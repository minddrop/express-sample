import Book from '../models/book'
import Author from '../models/author'
import Genre from '../models/genre'
import BookInstance from '../models/bookInstance'
import async from 'async'
import { body, validationResult, sanitizeBody } from 'express-validator'

export const index = (req, res) => {
  async.parallel(
    {
      bookCount(callback) {
        Book.countDocuments({}, callback)
      },
      bookInstanceCount(callback) {
        BookInstance.countDocuments({}, callback)
      },
      bookInstanceAvailableCount(callback) {
        BookInstance.countDocuments({ status: 'Available' }, callback)
      },
      authorCount(callback) {
        Author.countDocuments({}, callback)
      },
      genreCount(callback) {
        Genre.countDocuments({}, callback)
      }
    },
    (err, results) => {
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: results
      })
    }
  )
}

export const bookList = (req, res, next) => {
  Book.find({}, 'title author')
    .populate('author')
    .exec((err, listBooks) => {
      if (err) return next(err)
      listBooks.sort((a, b) => {
        let textA = a.title.toUpperCase()
        let textB = b.title.toUpperCase()
        return textA < textB
      })
      res.render('bookList', { title: 'Book List', bookList: listBooks })
    })
}

export const bookDetail = (req, res, next) => {
  async.parallel(
    {
      book: callback => {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback)
      },
      bookInstance: callback => {
        BookInstance.find({
          book: req.params.id
        }).exec(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      if (results.book === null) {
        const err = new Error('Book not found')
        err.status = 404
        return next(err)
      }
      res.render('bookDetail', {
        title: results.book.title,
        book: results.book,
        bookInstances: results.bookInstance
      })
    }
  )
}

export const bookCreateGet = (req, res, next) => {
  async.parallel(
    {
      authors: callback => {
        Author.find(callback)
      },
      genres: callback => {
        Genre.find(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      res.render('bookForm', {
        title: 'Create Book',
        authors: results.authors,
        genres: results.genres
      })
    }
  )
}

export const bookCreatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (req.body.genre === void 0) req.body.genre = []
      else req.body.genre = new Array(req.body.genre)
    }
    next()
  },

  body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('author', 'Author must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('summary', 'Summary must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('isbn', 'ISBN must not be empty')
    .isLength({ min: 1 })
    .trim(),
  sanitizeBody('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req)
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    })

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors: callback => {
            Author.find(callback)
          },
          genres: callback => {
            Genre.find(callback)
          }
        },
        (err, results) => {
          if (err) return next(err)
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true'
            }
          }
          res.render('bookForm', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array()
          })
        }
      )
      return
    } else {
      book.save(err => {
        if (err) return next(err)
        res.redirect(book.url)
      })
    }
  }
]

export const bookDeleteGet = (req, res, next) => {
  async.parallel(
    {
      book: callback => {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      if (results.book === null) {
        res.redirect('/catalog/books')
      }
      res.render('bookDelete', {
        title: 'Delete Book',
        book: results.book
      })
    }
  )
}

export const bookDeletePost = (req, res, next) => {
  Book.findByIdAndDelete(req.body.bookid, err => {
    if (err) return next(err)
    res.redirect('/catalog/books')
  })
}

export const bookUpdateGet = (req, res, next) => {
  async.parallel(
    {
      book: callback => {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback)
      },
      authors: callback => {
        Author.find(callback)
      },
      genres: callback => {
        Genre.find(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      if (results.book === null) {
        const err = new Error('Book not found')
        err.status = 404
        return next(err)
      }

      for (
        let allGenreIter = 0;
        allGenreIter < results.genres.length;
        allGenreIter++
      ) {
        for (
          let bookGenreIter = 0;
          bookGenreIter < results.book.genre.length;
          bookGenreIter++
        ) {
          if (
            results.genres[allGenreIter]._id.toString() ===
            results.book.genre[bookGenreIter]._id.toString()
          ) {
            results.genres[allGenreIter].checked = 'true'
          }
        }
      }
      res.render('bookForm', {
        title: 'Update Book',
        authors: results.authors,
        genres: results.genres,
        book: results.book
      })
    }
  )
}

export const bookUpdatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === void 0) req.body.genre = []
      else req.body.genre = new Array(req.body.genre)
    }
    next()
  },

  body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('author', 'Author must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('summary', 'Summary must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('isbn', 'ISBN must not be empty')
    .isLength({ min: 1 })
    .trim(),
  sanitizeBody('title').escape(),
  sanitizeBody('author').escape(),
  sanitizeBody('summary').escape(),
  sanitizeBody('isbn').escape(),
  sanitizeBody('genre.*').escape(),

  (req, res, next) => {
    const errors = validationResult(req)
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === void 0 ? [] : req.body.genre,
      _id: req.params.id //This is required, or a new ID will be assigned!
    })

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors: callback => {
            Author.find(callback)
          },
          genres: callback => {
            Genre.find(callback)
          }
        },
        (err, results) => {
          if (err) return next(err)
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true'
            }
          }
          res.render('bookForm', {
            title: 'Update Book',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array()
          })
        }
      )
      return
    } else {
      Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
        if (err) return next(err)
        res.redirect(thebook.url)
      })
    }
  }
]
