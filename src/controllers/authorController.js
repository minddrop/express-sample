import Author from '../models/author'
import Book from '../models/book'
import async from 'async'

export const authorList = (req, res, next) => {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function(err, listAuthors) {
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
  res.send('NOT IMPLEMENTED: Author create GET')
}

export const authorCreatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Author create POST')
}

export const authorDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Author delete GET')
}

export const authorDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Author delete POST')
}

export const authorUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update GET')
}

export const authorUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update POST')
}
