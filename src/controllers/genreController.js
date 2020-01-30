import Genre from '../models/genre'
import Book from '../models/book'
import async from 'async'
import { body, sanitizeBody, validationResult } from 'express-validator'

export const genreList = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, listGenres) => {
      if (err) return next(err)
      res.render('genreList', {
        title: 'Genre List',
        genreList: listGenres
      })
    })
}

export const genreDetail = (req, res, next) => {
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
  res.render('genreForm', { title: 'Create Genre' })
}

export const genreCreatePost = [
  body('name', 'Genre name required')
    .isLength({ min: 1 })
    .trim(),
  sanitizeBody('name').escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    const genre = new Genre({ name: req.body.name })

    if (!errors.isEmpty()) {
      res.render('genreForm', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array()
      })
    } else {
      Genre.findOne({ name: req.body.name }).exec((err, foundGenre) => {
        if (err) return next(err)
        if (foundGenre) {
          res.redirect(foundGenre.url)
        } else {
          genre.save(err => {
            if (err) return next(err)
            res.redirect(genre.url)
          })
        }
      })
    }
  }
]

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
