import Book from '../models/book'

export const index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page')
}

export const bookList = (req, res) => {
  res.send('NOT IMPLEMENTED: Book list')
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
