import * as api from './api'
import {
  OnEventRequest,
  OnEventResponse,
} from '@aws-cdk/custom-resources/lib/provider-framework/types'
import { ELBv2 } from 'aws-sdk'

const elbv2 = new ELBv2()

const createTargetGroup = async (
  event: OnEventRequest
): Promise<OnEventResponse> => {
  console.dir(event)

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

  console.dir(tg.TargetGroups![0])
  return {
    PhysicalResourceId: tg.TargetGroups![0].TargetGroupArn!,
    Data: {
      LoadBalancerArns: tg.TargetGroups![0].LoadBalancerArns,
      TargetGroupName: tg.TargetGroups![0].TargetGroupName,
    },
  }
}

const deleteTargetGroup = async (
  event: OnEventRequest
): Promise<OnEventResponse> => {
  const tg = await elbv2
    .deleteTargetGroup({ TargetGroupArn: event.PhysicalResourceId! })
    .promise()
  if (tg.$response.error instanceof Error) {
    throw tg.$response.error
  }

  return {}
}

export const handler = async (
  event: OnEventRequest
): Promise<OnEventResponse> => {
  switch (event.RequestType) {
    case 'Create': {
      return createTargetGroup(event)
    }
    case 'Update':
    case 'Delete': {
      return deleteTargetGroup(event)
    }
  }
}
