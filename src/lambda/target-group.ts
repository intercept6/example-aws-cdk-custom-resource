import * as api from './api'
import {
  OnEventRequest,
  OnEventResponse,
} from '@aws-cdk/custom-resources/lib/provider-framework/types'
import { ELBv2 } from 'aws-sdk'

// CFn Docs: https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html

const elbv2 = new ELBv2()

const createTargetGroup = async (
  event: OnEventRequest
): Promise<OnEventResponse> => {
  const name = event.ResourceProperties[api.PROP_TARGET_GROUP_NAME]
  if (!name) {
    throw new Error(`${api.PROP_TARGET_GROUP_NAME} is required`)
  }
  const port = event.ResourceProperties[api.PROP_PORT]
  if (!port) {
    throw new Error(`${api.PROP_PORT} is required`)
  }
  const protocol = event.ResourceProperties[api.PROP_PROTOCOL]
  if (!protocol) {
    throw new Error(`${api.PROP_PROTOCOL} is required`)
  }
  const protocolVersion = event.ResourceProperties[api.PROP_PROTOCOL_VERSION]
  if (!protocolVersion) {
    throw new Error(`${api.PROP_PROTOCOL_VERSION} is required`)
  }
  const vpcID = event.ResourceProperties[api.PROP_VPC_ID]
  if (!vpcID) {
    throw new Error(`${api.PROP_VPC_ID} is required`)
  }
  const targetType = event.ResourceProperties[api.PROP_TARGET_TYPE]
  if (!targetType) {
    throw new Error(`${api.PROP_TARGET_TYPE} is required`)
  }

  const tg = await elbv2
    .createTargetGroup({
      Name: name,
      Port: port,
      Protocol: protocol,
      ProtocolVersion: protocolVersion,
      VpcId: vpcID,
      TargetType: targetType,
    })
    .promise()

  console.log('create response: ', tg.TargetGroups![0])

  return {
    PhysicalResourceId: tg.TargetGroups![0].TargetGroupArn!,
    Data: {
      LoadBalancerArns: tg.TargetGroups![0].LoadBalancerArns,
      TargetGroupName: tg.TargetGroups![0].TargetGroupName,
      TargetGroupFullName: tg.TargetGroups![0].TargetGroupArn!.split(':')[5],
    },
  }
}

const deleteTargetGroup = async (
  event: OnEventRequest
): Promise<OnEventResponse> => {
  await elbv2
    .deleteTargetGroup({ TargetGroupArn: event.PhysicalResourceId! })
    .promise()

  return {}
}

const updateTargetGroup = async (
  event: OnEventRequest
): Promise<OnEventResponse> => {
  await deleteTargetGroup(event)
  return createTargetGroup(event)
}

export const handler = async (
  event: OnEventRequest
): Promise<OnEventResponse> => {
  console.log('event: ', event)

  switch (event.RequestType) {
    case 'Create': {
      return createTargetGroup(event)
    }
    case 'Update': {
      return updateTargetGroup(event)
    }
    case 'Delete': {
      return deleteTargetGroup(event)
    }
  }
}
