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
    }
    Genre.findOne({ name: req.body.name }, (err, foundGenre) => {
      if (err) return next(err)
      if (foundGenre) return res.redirect(foundGenre.url)
      genre.save(err => {
        if (err) return next(err)
        res.redirect(genre.url)
      })
    })
  }
]

export const genreDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete GET')
}

export const genreDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete POST')
}

export const genreUpdateGet = (req, res, next) => {
  Genre.findById(req.params.id, (err, genre) => {
    if (err) return next(err)
    if (genre === null) {
      res.redirect('/catalog/genres')
      return
    }
    res.render('genreForm', {
      title: 'Update Genre',
      genre: genre
    })
  })
}

export const genreUpdatePost = [
  body('name', 'Genre name required')
    .isLength({ min: 1 })
    .trim(),
  sanitizeBody('name').escape(),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('genreForm', {
        title: 'Update Genre',
        genre: genre,
        errors: errors.array()
      })
    }
    const genre = new Genre({ name: req.body.name, _id: req.params.id })
    Genre.findByIdAndUpdate(req.params.id, genre, (err, thegenre) => {
      if (err) return next(err)
      res.redirect(thegenre.url)
    })
  }
]
