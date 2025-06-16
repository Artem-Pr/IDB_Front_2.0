import { errorMessage } from "src/app/common/notifications"

import { APIInstance } from "../api-instance"

import { login } from "./login"


jest.spyOn(console, "error")
  .mockImplementation(() => {})

jest.mock('src/app/common/notifications', () => ({
  errorMessage: jest.fn(),
}))

jest.mock('../api-instance', () => ({
  APIInstance: {
    post: jest.fn()
  }
}))

const mockedAPIInstance = APIInstance as jest.Mocked<typeof APIInstance>

describe('login', () => {
  beforeEach(() => {
    mockedAPIInstance.post.mockResolvedValue({ data: 'mocked data' })
  })

  it('should return mocked data', async () => { 
    const response = await login('username', 'password')
    expect(response)
      .toBe('mocked data')
  })

  it('should call APIInstance.post', async () => {
    await login('username', 'password')
    expect(mockedAPIInstance.post)
      .toHaveBeenCalled()
  })

  it('should call APIInstance.post with parameters ("/auth/login", params, config)', async () => {
    const params = new URLSearchParams({ 'username': 'username', 'password': 'password' })
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    await login('username', 'password')
    expect(mockedAPIInstance.post)
      .toHaveBeenCalledWith('/auth/login', params, config)
  })

  it('should call errorNotification with parameters (Error, "Login Error")', async () => {
    mockedAPIInstance.post.mockRejectedValue(new Error('Error'))

    await login('username', 'password')
    expect(errorMessage)
      .toHaveBeenCalledWith(new Error('Error'), 'Login Error')
  })
})
