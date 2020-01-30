import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import path from 'path'
import { compose } from 'compose-middleware'
import createError from 'http-errors'
import indexRouter from './routes/index'
import usersRouter from './routes/users'
import errorRouter from './routes/error'
import catalogRouter from './routes/catalog'
import compression from 'compression'
import helmet from 'helmet'

const app = express()
app.use(helmet())
app.set('views', path.resolve('src', 'views'))
app.set('view engine', 'pug')

const mongoUri = process.env.MONGO_URI
if (mongoUri === undefined) throw error('undefined: MONGO_URI')
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopoloy: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(compression())
app.use(express.static(path.resolve('src', 'public')))
app.use('/', indexRouter)
app.use('/users/:userName', usersRouter)
app.use('/catalog', catalogRouter)

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
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

export default app
