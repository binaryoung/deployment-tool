import {
  validateRequest,
  sendBadRequestResponse,
  sendPingEventResponse,
  sendSuccessResponse
} from './server'
import { notifyViaEmail } from './tasks'

export default async (request, response) => {
  let event =
    request.headers['X-GitHub-Event'] || request.headers['x-github-event']

  if (!await validateRequest(request)) return sendBadRequestResponse(response)
  if (event === 'ping') return sendPingEventResponse(response)
  //TODO task logic
  return sendSuccessResponse(response)
}
