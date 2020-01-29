import async, { nextTick } from 'async'

import Book from '../models/book'
import Author from '../models/author'
import Genre from '../models/genre'
import BookInstance from '../models/bookInstance'

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

export const bookList = (req, res) => {
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

export const bookDetail = (req, res) => {
  res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id)
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
