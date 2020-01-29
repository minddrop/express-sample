import Book from '../models/book'
import Author from '../models/author'
import Genre from '../models/genre'
import BookInstance from '../models/bookInstance'
import async from 'async'

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

export const bookCreateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Book create GET')
}

export const bookCreatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Book create POST')
}

export const bookDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete GET')
}

export const bookDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete POST')
}

export const bookUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Book update GET')
}

export const bookUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Book update POST')
}
