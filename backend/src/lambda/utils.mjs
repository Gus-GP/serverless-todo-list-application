import { parseUserId } from '../auth/utils.mjs'

/**
 * Gets user ID
 * @param event http event
 * @returns parsed User ID
 */
export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
