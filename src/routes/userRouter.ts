import express from 'express'
import addSelfieController from '../controllers/addSelfieController'
import addAvatarController from '../controllers/addAvatarController'

const router = express.Router()

// router.post('/selfie', addSelfieController)
router.post('/selfie', addAvatarController)

export default router