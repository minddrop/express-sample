import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(8000, () => {
  console.log('server listening on port 8000!')
})
