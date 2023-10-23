import express from 'express'
import addSelfieController from '../controllers/addSelfieController'

const router = express.Router()

router.post('/selfie', addSelfieController)

export default router