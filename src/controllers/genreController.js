import Genre from '../models/genre'
import Book from '../models/book'
import async from 'async'

export const genreList = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(err, listGenres) {
      if (err) return next(err)
      res.render('genreList', {
        title: 'Genre List',
        genreList: listGenres
      })
    })
}

export const genreDetail = (req, res) => {
  async.parallel(
    {
      genre: callback => {
        Genre.findById(req.params.id).exec(callback)
      },
      genreBooks: callback => {
        Book.find({ genre: req.params.id }).exec(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      if (results.genre === null) {
        const err = new Error('Genre not found')
        err.status = 404
        return next(err)
      }
      res.render('genreDetail', {
        title: 'Genre Detail',
        genre: results.genre,
        genreBooks: results.genreBooks
      })
    }
  )
}

export const genreCreateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre create GET')
}

export const genreCreatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre create POST')
}

export const genreDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete GET')
}

export const genreDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete POST')
}

export const genreUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update GET')
}

export const genreUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update POST')
}
