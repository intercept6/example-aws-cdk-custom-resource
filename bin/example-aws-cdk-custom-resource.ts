#!/usr/bin/env node
import { ExampleAwsCdkCustomResource } from '../lib/example-aws-cdk-custom-resource'
import { App } from '@aws-cdk/core'
import 'source-map-support/register'

const app = new App()
new ExampleAwsCdkCustomResource(app, 'ExampleAwsCdkCustomResource', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'ap-northeast-1',
  },
  certificateArn: process.env.CERTIFICATE_ARN!,
})
