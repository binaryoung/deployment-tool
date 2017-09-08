import {
  validateRequest,
  sendBadRequestResponse,
  sendPingEventResponse,
  sendSuccessResponse,
  sendFailedDeployResponse
} from './server'
import { redeploySite, log } from './tasks'

export default async (request, response) => {
  let event =
    request.headers['X-GitHub-Event'] || request.headers['x-github-event']

  if (!await validateRequest(request)) return sendBadRequestResponse(response)
  if (event === 'ping') return sendPingEventResponse(response)

  try {
    redeploySite()
    return sendSuccessResponse(response)
  } catch (error) {
    return sendFailedDeployResponse(response, error)
  }
}
