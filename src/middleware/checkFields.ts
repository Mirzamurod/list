import { check } from 'express-validator'

export const userAddField = [
  check('name').notEmpty().withMessage('name_required').bail().trim(),
  check('phone').notEmpty().withMessage('phone_required').bail().trim(),
  check('password')
    .notEmpty()
    .withMessage('password_required')
    .bail()
    .trim()
    .bail()
    .isLength({ min: 4 })
    .withMessage('minimum_4_letters')
    .bail()
    .isLength({ max: 16 })
    .withMessage('maximum_16_letters'),
]

export const userLoginField = [
  check('phone').notEmpty().withMessage('phone_required').bail().trim(),
  check('password')
    .notEmpty()
    .withMessage('password_required')
    .bail()
    .trim()
    .bail()
    .isLength({ min: 4 })
    .withMessage('minimum_4_letters')
    .bail()
    .isLength({ max: 16 })
    .withMessage('maximum_16_letters'),
]

export const clientAddField = [
  check('device'),
  check('drugs'),
  
]
