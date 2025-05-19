jest.mock('@/shared/services/logger.service', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    })),
  }
})
