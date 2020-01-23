import { Router } from 'express'
const router = Router({ mergeParams: true })

router.get('/', (req, res) => {
  res.render('user', { name: req.params.userName })
})

export default router
