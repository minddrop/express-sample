import { Router } from 'express'
import * as bookController from '../controllers/bookController'
import * as authorController from '../controllers/authorController'
import * as genreController from '../controllers/genreController'
import * as bookinstanceController from '../controllers/bookinstanceController'

const router = Router()

router.get('/', bookController.index)
router.get('/book/create', bookController.bookCreateGet)
router.post('/book/create', bookController.bookCreatePost)
router.get('/book/:id/delete', bookController.bookDeleteGet)
router.post('/book/:id/delete', bookController.bookDeletePost)
router.get('/book/:id/update', bookController.bookUpdateGet)
router.post('/book/:id/update', bookController.bookUpdatePost)
router.get('/book/:id', bookController.bookDetail)
router.get('/books', bookController.bookList)

router.get('/author/create', authorController.authorCreateGet)
router.post('/author/create', authorController.authorCreatePost)
router.get('/author/:id/delete', authorController.authorDeleteGet)
router.post('/author/:id/delete', authorController.authorDeletePost)
router.get('/author/:id/update', authorController.authorUpdateGet)
router.post('/author/:id/update', authorController.authorUpdatePost)
router.get('/author/:id', authorController.authorDetail)
router.get('/authors', authorController.authorList)

router.get('/genre/create', genreController.genreCreateGet)
router.post('/genre/create', genreController.genreCreatePost)
router.get('/genre/:id/delete', genreController.genreDeleteGet)
router.post('/genre/:id/delete', genreController.genreDeletePost)
router.get('/genre/:id/update', genreController.genreUpdateGet)
router.post('/genre/:id/update', genreController.genreUpdatePost)
router.get('/genre/:id', genreController.genreDetail)
router.get('/genres', genreController.genreList)

router.get('/bookinstance/create', bookinstanceController.bookinstanceCreateGet)
router.post(
  '/bookinstance/create',
  bookinstanceController.bookinstanceCreatePost
)
router.get(
  '/bookinstance/:id/delete',
  bookinstanceController.bookinstanceDeleteGet
)
router.post(
  '/bookinstance/:id/delete',
  bookinstanceController.bookinstanceDeletePost
)
router.get(
  '/bookinstance/:id/update',
  bookinstanceController.bookinstanceUpdateGet
)
router.post(
  '/bookinstance/:id/update',
  bookinstanceController.bookinstanceUpdatePost
)
router.get('/bookinstance/:id', bookinstanceController.bookinstanceDetail)
router.get('/bookinstances', bookinstanceController.bookinstanceList)

export default router
