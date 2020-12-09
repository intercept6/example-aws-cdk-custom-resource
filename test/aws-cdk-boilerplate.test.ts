import { AwsCdkBoilerplateStack } from '../lib/aws-cdk-boilerplate-stack'
import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import { App } from '@aws-cdk/core'

describe('fine-grainded tests', () => {
  const app = new App()
  const stack = new AwsCdkBoilerplateStack(app, 'MyTestStack')
  test('stack has lambda function', () => {
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        Runtime: 'nodejs12.x',
      })
    )
  })

  test('stack has http api', () => {
    expectCDK(stack).to(
      haveResource('AWS::ApiGatewayV2::Api', {
        Name: 'fizzbuzz',
        Description: 'sample fizzbuzz api',
        ProtocolType: 'HTTP',
        CorsConfiguration: {
          AllowHeaders: ['Authorization'],
          AllowMethods: [
            'GET',
            'HEAD',
            'OPTIONS',
            'POST',
            'DELETE',
            'PATCH',
            'PUT',
          ],
          AllowOrigins: ['*'],
          MaxAge: 864000,
        },
      })
    )
  })
})
