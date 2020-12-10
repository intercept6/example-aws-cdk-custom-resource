import {
  TargetGroupProperties,
  ATTR_LOAD_BALANCER_ARNS,
  ATTR_TARGET_GROUP_FULL_NAME,
  ATTR_TARGET_GROUP_NAME,
} from './api'
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
  const properties = event.ResourceProperties as TargetGroupProperties

  if (!properties.Name) {
    throw new Error(`Name is required`)
  }
  if (!properties.Port) {
    throw new Error(`Port is required`)
  }
  if (!properties.ProtocolVersion) {
    throw new Error(`ProtocolVersion is required`)
  }
  if (!properties.VpcId) {
    throw new Error(`VpcId is required`)
  }
  if (!properties.TargetType) {
    throw new Error(`TargetType is required`)
  }

  const tg = await elbv2
    .createTargetGroup({
      Name: properties.Name,
      Port: properties.Port,
      Protocol: properties.Protocol,
      ProtocolVersion: properties.ProtocolVersion,
      VpcId: properties.VpcId,
      TargetType: properties.TargetType,
    })
    .promise()

  console.log('create response: ', tg.TargetGroups![0])

  return {
    PhysicalResourceId: tg.TargetGroups![0].TargetGroupArn!,
    Data: {
      [ATTR_LOAD_BALANCER_ARNS]: tg.TargetGroups![0].LoadBalancerArns,
      [ATTR_TARGET_GROUP_NAME]: tg.TargetGroups![0].TargetGroupName,
      [ATTR_TARGET_GROUP_FULL_NAME]: tg.TargetGroups![0].TargetGroupArn!.split(
        ':'
      )[5],
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
