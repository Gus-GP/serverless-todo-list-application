import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-3h5xwckw0u5te1qx.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  // TODO: Implement token verification
  //request JSON web key set from auth0 deployed service
  const response = await Axios.get(jwksUrl);
  // The logic below is prescribed by https://auth0.com/blog/navigating-rs256-and-jwks/
  // especifically the "Finding the exact signature verification key" section
  const keys = res.data.keys;
  const signKeys = keys.find(key => key.kid === jwt.header.kid);
  if (!signKeys) {
    logger.error('the JWT supplied with the request was signed with a key that is not supported by Auth0')
    throw new Error("Incorrect Keys");
  }
  //retireve the the x509 certificate chain
  const certificate = signKeys.x5c[0];
  //wrap in header and footer
  certificate = `-----BEGIN CERTIFICATE-----\n${certificate}\n-----END CERTIFICATE-----\n`;
  
  return jsonwebtoken.verify(token, certificate, {algorithms: ['RS256']});
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
