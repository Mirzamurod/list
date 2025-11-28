import { check } from 'express-validator'

export const userAddField = [
  check('name').trim().notEmpty().withMessage('name_required'),
  check('phone').trim().notEmpty().withMessage('phone_required'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('password_required')
    .isLength({ min: 4, max: 16 })
    .withMessage('password_length_invalid'),
]

export const userLoginField = [
  check('phone').trim().notEmpty().withMessage('phone_required'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('password_required')
    .isLength({ min: 4, max: 16 })
    .withMessage('password_length_invalid'),
]

export const clientAddField = [
  check('name').trim().notEmpty().withMessage('name_required'),
  check('phone').trim().notEmpty().withMessage('phone_required'),
  check('year').trim().notEmpty().withMessage('year_required'),
  check('address').trim().notEmpty().withMessage('address_required'),
  check('comment').optional().trim(),
]
