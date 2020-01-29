import BookInstance from '../models/bookInstance'
import { nextTick } from 'async'

export const bookInstanceList = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec(function(err, listBookInstances) {
      if (err) return next(err)
      res.render('bookInstanceList', {
        title: 'Book Instance List',
        bookInstanceList: listBookInstances
      })
    })
}

export const bookInstanceDetail = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id)
}

export const bookInstanceCreateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance create GET')
}

export const bookInstanceCreatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance create POST')
}

export const bookInstanceDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstanceDelete GET')
}

export const bookInstanceDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST')
}

export const bookInstanceUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET')
}

export const bookInstanceUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST')
}
