import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { compose } from 'compose-middleware'
import createError from 'http-errors'
import indexRouter from './routes/index'
import usersRouter from './routes/users'
import errorRouter from './routes/error'

const app = express()
app.set('views', path.resolve('src', 'views'))
app.set('view engine', 'pug')

app.use(morgan('tiny'))
app.use(express.static(path.resolve('src', 'public')))
app.use('/', indexRouter)
app.use('/users/:userName', usersRouter)

app.use((req, res, next) => {
  next(createError(404))
})
app.use(
  compose([
    (err, req, res) => {
      res.locals.message = err.message
      res.locals.error = req.app.get(
        'env',
        req.app.get('env') === 'development' ? err : {}
      )
      res.status(err.status || 500)
    },
    errorRouter
  ])
)
app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

export default app
