import { errorMessage } from "src/app/common/notifications"

import { APIInstance } from "../api-instance"

import { getPermissions } from "./getPermissions"

jest.spyOn(console, "error")
  .mockImplementation(() => {})

jest.mock('../api-instance', () => ({
  APIInstance: {
    get: jest.fn()
  }
}))

jest.mock('src/app/common/notifications', () => ({
  errorMessage: jest.fn(),
}))

const mockedAPIInstance = APIInstance as jest.Mocked<typeof APIInstance>

describe('getPermissions', () => {
  beforeEach(() => {
    mockedAPIInstance.get.mockResolvedValue({ data: 'mocked data' })
  })

  it('should return mocked data', async () => {
    const response = await getPermissions()
    expect(response)
      .toBe('mocked data')
  })

  it('should call APIInstance.get', async () => {
    await getPermissions()
    expect(APIInstance.get)
      .toHaveBeenCalled()
  })

  it('should call APIInstance.get with parameter "/auth/permissions"', async () => {
    await getPermissions()
    expect(APIInstance.get)
      .toHaveBeenCalledWith('/auth/permissions')
  })

  it('should call errorNotification with parameters (Error, "Get permissions Error")', async () => {
    mockedAPIInstance.get.mockRejectedValue({
      message: 'Error',
    })
    await getPermissions()
    expect(errorMessage)
      .toHaveBeenCalledWith(new Error('Error'), 'Get permissions Error')
  })
})
