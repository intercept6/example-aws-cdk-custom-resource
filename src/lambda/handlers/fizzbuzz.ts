import { range } from '../../utils/range'
import {
  APIGatewayProxyResultV2,
  Context,
  APIGatewayProxyCallbackV2,
} from 'aws-lambda'

type FizzBuzzEvent = {
  queryStringParameters: {
    'upper-limit': number
  }
}

const getParameters = (event: FizzBuzzEvent) => {
  const rawUpperLimit = event?.queryStringParameters?.['upper-limit']
  const upperLimit = Number(rawUpperLimit)
  if (isNaN(upperLimit)) {
    return new Error(
      `invalid parameter: query string parameter "upper-limit" is invalid. upper-limit = ${rawUpperLimit}`
    )
  }
  if (upperLimit < 1) {
    return new Error(
      `invalid parameter: query string parameter "upper-limit" must be a natural number. upper-limit = ${rawUpperLimit}`
    )
  }

  return { upperLimit }
}

const fizzBuzz = (upperLimit: number): string[] =>
  range(1, upperLimit).map((value) => {
    if (value % 15 === 0) {
      return 'fizzbuzz'
    } else if (value % 5 === 0) {
      return 'buzz'
    } else if (value % 3 === 0) {
      return 'fizz'
    } else {
      return `${value}`
    }
  })

export const handler = (
  event: FizzBuzzEvent,
  _context: Context,
  callback: APIGatewayProxyCallbackV2
): void => {
  const parameters = getParameters(event)
  if (parameters instanceof Error) {
    const errorResult: APIGatewayProxyResultV2 = {
      statusCode: 400,
      body: JSON.stringify({ message: parameters.message }),
    }
    callback(null, errorResult)
    return
  }

  const answer = fizzBuzz(parameters.upperLimit)

  const result: APIGatewayProxyResultV2 = {
    statusCode: 200,
    body: JSON.stringify({
      answer,
    }),
  }
  callback(null, result)
}
