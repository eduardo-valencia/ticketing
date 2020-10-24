import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { body } from 'express-validator'
import { BadRequestError, validateRequest } from '@tickets-448800/common'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4-20 characters.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userData = { email, password }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('User already has that email.')
    }
    const user = User.build(userData)
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )
    req.session = { jwt: userJwt }
    await user.save()
    res.status(201).send(user)
  }
)

export { router as signupRouter }
