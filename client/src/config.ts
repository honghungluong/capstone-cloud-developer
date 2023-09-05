// https://g6a9qv9tbl.execute-api.us-east-1.amazonaws.com/dev/items
const apiId = 'g6a9qv9tbl'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-8v64lnuw7rf5862s.us.auth0.com',            // Auth0 domain
  clientId: 'NNUDPu0ZB5oZgY2qLrHFvk641pp355Re',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
