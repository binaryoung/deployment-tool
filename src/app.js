import url from 'url'
import crypto from 'crypto'
import { buffer, text, json, send } from 'micro'
import { notifyViaEmail } from 'tasks'

async function validateRequest(request) {
  let requestUrl = url.parse(request.url)
  let secret = process.env.GITHUB_WEBHOOK_SECRET || 'secretKey'
  let payload = await text(request)
  let signature =
    request.headers['X-Hub-Signature'] || request.headers['x-hub-signature']
  let event =
    request.headers['X-GitHub-Event'] || request.headers['x-github-event']

  if (
    requestUrl.pathname === '/deploy' &&
    request.method === 'POST' &&
    (event === 'push' || event === 'ping') &&
    verifySignature(payload, signature, secret)
  ) {
    return true
  }
  return false
}

function verifySignature(payload, signature, secret) {
  let hash =
    'sha1=' +
    crypto
      .createHmac('sha1', secret)
      .update(payload)
      .digest('hex')

  return hash === signature
}

function sendPingEventResponse(response) {
  send(response, 200, { success: true, event: 'ping' })
}

function sendBadRequestResponse(response) {
  send(response, 400, { error: 'Bad request' })
}

export default async (request, response) => {
  let event =
    request.headers['X-GitHub-Event'] || request.headers['x-github-event']

  if (!await validateRequest(request)) return sendBadRequestResponse(response)
  if (event === 'ping') return sendPingEventResponse(response)
  //TODO task logic
  return
}