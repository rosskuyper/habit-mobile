export type Environment = {
  GRAPHQL_ENDPOINT: string
  FIREBASE_WEB_CLIENT_ID: string
}

const production: Environment = {
  GRAPHQL_ENDPOINT: 'https://api.habitualizer.com/graphql',
  FIREBASE_WEB_CLIENT_ID: '1045305354627-qrc2giuq997glg9u2ds1kvgsb15qjfhc.apps.googleusercontent.com',
}

const development: Environment = {
  ...production,
  GRAPHQL_ENDPOINT: 'http://localhost:9000/graphql',
}

const env = process.env.NODE_ENV === 'development' ? development : production

export {env}
