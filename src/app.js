import express from 'express'
import morgan from 'morgan'
import path from 'path'
import indexRouter from './routes/index'

const app = express()
app.set('views', path.resolve('src', 'views'))
app.set('view engine', 'pug')

app.use(morgan('tiny'))
app.use(express.static(path.resolve('src', 'public')))
app.use('/', indexRouter)

export default app
