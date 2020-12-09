#!/usr/bin/env node
import { AwsCdkBoilerplateStack } from '../lib/aws-cdk-boilerplate-stack'
import { App } from '@aws-cdk/core'
import 'source-map-support/register'

const app = new App()
new AwsCdkBoilerplateStack(app, 'AwsCdkBoilerplateStack')
