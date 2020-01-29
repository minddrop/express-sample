import Author from '../models/author'

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

export const authorDetail = (req, res) => {
  res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id)
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
