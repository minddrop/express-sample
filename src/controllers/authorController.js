import Author from '../models/author'
import Book from '../models/book'
import async from 'async'
import { body, validationResult, sanitizeBody } from 'express-validator'

export const authorList = (req, res, next) => {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, listAuthors) => {
      if (err) return next(err)
      res.render('authorList', {
        title: 'Author List',
        authorList: listAuthors
      })
    })
}

export const authorDetail = (req, res, next) => {
  async.parallel(
    {
      author: callback => {
        Author.findById(req.params.id).exec(callback)
      },
      authorsBooks: callback => {
        Book.find({ author: req.params.id }, 'title summary').exec(callback)
      }
    },

    (err, results) => {
      if (err) return next(err)
      if (results.author === null) {
        const err = new Error('Author not found')
        err.status = 303
        return next(err)
      }
      res.render('authorDetail', {
        title: 'Author Detail',
        author: results.author,
        authorBooks: results.authorsBooks
      })
    }
  )
}

export const authorCreateGet = (req, res) => {
  res.render('authorForm', { title: 'Create Author' })
}

export const authorCreatePost = [
  body('first-name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family-name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date-of-birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),
  body('date-of-death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),
  sanitizeBody('first-name').escape(),
  sanitizeBody('family-name').escape(),
  sanitizeBody('date-of-birth').toDate(),
  sanitizeBody('date-of-death').toDate(),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('authorForm', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array()
      })
      return
    } else {
      const author = new Author({
        first_name: req.body['first-name'],
        family_name: req.body['family-name'],
        date_of_birth: req.body['date-of-birth'],
        date_of_death: req.body['date-of-death']
      })
      author.save(err => {
        if (err) return next(err)
        res.redirect(author.url)
      })
    }
  }
]

export const authorDeleteGet = (req, res, next) => {
  async.parallel(
    {
      author: callback => {
        Author.findById(req.params.id).exec(callback)
      },
      authorsBooks: callback => {
        Book.find({ author: req.params.id }).exec(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      if (results.author == null) {
        res.redirect('/catalog/authors')
      }
      res.render('authorDelete', {
        title: 'Delete Author',
        author: results.author,
        authorBooks: results.authorsBooks
      })
    }
  )
}

export const authorDeletePost = (req, res, next) => {
  async.parallel(
    {
      author: callback => {
        Author.findById(req.body.authorid).exec(callback)
      },
      authorsBooks: callback => {
        Book.find({ author: req.body.authorid }).exec(callback)
      }
    },
    (err, results) => {
      if (err) return next(err)
      if (results.authorsBooks.length > 0) {
        res.render('authorDelete', {
          title: 'Delete Author',
          author: results.author,
          authorBooks: results.authorsBooks
        })
        return
      } else {
        Author.findByIdAndRemove(req.body.authorid, err => {
          if (err) return next(err)
          res.redirect('/catalog/authors')
        })
      }
    }
  )
}

export const authorUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update GET')
}

export const authorUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update POST')
}
