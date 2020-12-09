import { handler } from './fizzbuzz'
import { APIGatewayProxyResultV2, Context } from 'aws-lambda'

afterAll(() => {
  jest.clearAllMocks()
})

describe('🟢fizzbuzz', () => {
  const context = {} as Context
  test.each([
    [1, ['1']],
    [3, ['1', '2', 'fizz']],
    [5, ['1', '2', 'fizz', '4', 'buzz']],
    [
      15,
      [
        '1',
        '2',
        'fizz',
        '4',
        'buzz',
        'fizz',
        '7',
        '8',
        'fizz',
        'buzz',
        '11',
        'fizz',
        '13',
        '14',
        'fizzbuzz',
      ],
    ],
  ])('normal', (upperLimit, answer) => {
    const callback = jest.fn()
    handler(
      { queryStringParameters: { 'upper-limit': upperLimit } },
      context,
      callback
    )
    const want: APIGatewayProxyResultV2 = {
      statusCode: 200,
      body: JSON.stringify({
        answer,
      }),
    }
    expect(callback).toHaveBeenCalledWith(null, want)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('🔴 When upper-limit is minus, handler returns Bad Request', () => {
    const callback = jest.fn()
    handler(
      { queryStringParameters: { 'upper-limit': -10 } },
      context,
      callback
    )
    const want: APIGatewayProxyResultV2 = {
      statusCode: 400,
      body: JSON.stringify({
        message:
          'invalid parameter: query string parameter "upper-limit" must be a natural number. upper-limit = -10',
      }),
    }
    expect(callback).toHaveBeenCalledWith(null, want)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('🔴 When upper-limit is not number type, handler returns Bad Request', () => {
    const callback = jest.fn()
    handler(
      { queryStringParameters: { 'upper-limit': 'a' as any } },
      context,
      callback
    )
    const want: APIGatewayProxyResultV2 = {
      statusCode: 400,
      body: JSON.stringify({
        message:
          'invalid parameter: query string parameter "upper-limit" is invalid. upper-limit = a',
      }),
    }
    expect(callback).toHaveBeenCalledWith(null, want)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('🔴 When upper-limit is undefined, handler returns Bad Request', () => {
    const callback = jest.fn()
    handler(
      { queryStringParameters: { 'upper-limit': undefined as any } },
      context,
      callback
    )
    const want: APIGatewayProxyResultV2 = {
      statusCode: 400,
      body: JSON.stringify({
        message:
          'invalid parameter: query string parameter "upper-limit" is invalid. upper-limit = undefined',
      }),
    }
    expect(callback).toHaveBeenCalledWith(null, want)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('🔴 When query string parameter is undefined, handler returns Bad Request', () => {
    const callback = jest.fn()
    handler({ queryStringParameters: {} as any }, context, callback)
    const want: APIGatewayProxyResultV2 = {
      statusCode: 400,
      body: JSON.stringify({
        message:
          'invalid parameter: query string parameter "upper-limit" is invalid. upper-limit = undefined',
      }),
    }
    expect(callback).toHaveBeenCalledWith(null, want)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
