import { Rule } from 'antd/lib/form'

import {
  whitespace,
  required,
  alphabetLetters,
  email,
  confirmPassword,
} from './helpers'

export const emailValidationRules = [
  required('Please enter an email'),
  email,
]

export const userNameValidationRules = [
  required('Please enter a username'),
]

export const passwordValidationRules = [
  required('Please enter a password'),
]

export const confirmPasswordValidationRules = [
  required('Please confirm your password'),
  confirmPassword,
]

export const getCommonValidationRules = (text: string): Rule[] => [
  required(text),
  whitespace,
]

export const getAlphabetValidationRules = (text: string): Rule[] => [
  required(text),
  alphabetLetters,
  whitespace,
]
