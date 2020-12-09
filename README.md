# Welcome to your CDK TypeScript project!

This is a boilerplate project for TypeScript development with CDK.


## Change require

- cdk.json
  - change entry file name
- .vscode/setting.json
  - change envrionment variables
- bin/aws-cdk-boilerplate.ts
  - change file name and stack name
- lib/aws-cdk-boilerplate-stack.ts
  - change file name and class
- test/aws-cdk-boilerplate.ts
  - change file name and test methods
- package.json
  - change project name
- src/**/*
  - change functions

## Useful commands

- `yarn fmt` reformat files
- `yarn test` peform the jest unit tests
- `yarn diff` compare deployed stack with current state
- `yarn deploy` deploy this stack to your default AWS account/region
- `yarn deploy [--profile $PROFILE_NAME]` deploy this stack to your $PROFILE_NAME AWS account/region
- `yarn cdk synth` emits the synthesized CloudFormation template
