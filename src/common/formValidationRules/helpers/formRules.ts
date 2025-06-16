import { Rule } from 'antd/lib/form'

const alphabetRegex = /^[a-zA-Zñ @~`!@#$%^&*()_=+\\\\';:"\\/?>.<,-]+$/i

export const whitespace: Rule = { whitespace: true }
export const required = (message: string): Rule => ({
  required: true,
  message,
})
export const alphabetLetters: Rule = {
  pattern: alphabetRegex,
  message: 'Field does not accept numbers',
}
export const email: Rule = {
  type: 'email',
  message: 'Please enter a valid email',
}
export const confirmPassword:Rule = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || getFieldValue('password') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Passwords do not match'))
  },
})
