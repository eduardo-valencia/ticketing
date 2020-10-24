import express, { Request, Response } from 'express'
import { currentUser } from '@tickets-448800/common'

const router = express.Router()

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null })
  }
)

export { router as currentUserRouter }
