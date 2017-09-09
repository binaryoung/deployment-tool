import {
  validateRequest,
  sendBadRequestResponse,
  sendPingEventResponse,
  sendSuccessResponse,
  sendFailedDeployResponse,
  eventPayload
} from './server'
import { redeploySite } from './tasks'

export default async (request, response) => {
  let event =
    request.headers['X-GitHub-Event'] || request.headers['x-github-event']

  if (!await validateRequest(request)) return sendBadRequestResponse(response)
  if (event === 'ping') return sendPingEventResponse(response)

  try {
    let payload = await eventPayload(request)
    redeploySite(payload)
    return sendSuccessResponse(response)
  } catch (error) {
    return sendFailedDeployResponse(response, error)
  }
}
