// different environment variables will be defined here for development purposes.

let development = {
  //"REACT_APP_GORESY_BACKEND_URL": "http://localhost:8092",
  "REACT_APP_GORESY_BACKEND_URL": "https://dev-api.goresy.com",
  "REACT_APP_GORESY_OAUTH_URL": "https://dev-oauth.goresy.com",
  //"REACT_APP_GORESY_OAUTH_URL": "http://localhost:8096",
  "REACT_APP_GORESY_OAUTH_AUTH_HEADER": "Basic Z29yZXN5UHJvamVjdENsaWVudDpnb3Jlc3lQcm9qZWN0T2F1dGhTZWNyZXQyMDIyLg==",
  "REACT_APP_GORESY_GOOGLE_CLIENT_ID": "API_KEY.apps.googleusercontent.com"
}

window.env = development;
