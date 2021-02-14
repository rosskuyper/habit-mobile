export type Environment = {
  GRAPHQL_ENDPOINT: string
  FIREBASE_WEB_CLIENT_ID: string
  NODE_ENV: string
  APP_ENV: 'production' | 'development'
  COMMIT_HASH: string
}

const commitHashInjection = '%%COMMIT_HASH_REPLACE%%'

const production: Environment = {
  GRAPHQL_ENDPOINT: 'https://api.habitualizer.com/graphql',
  FIREBASE_WEB_CLIENT_ID:
    '1045305354627-qrc2giuq997glg9u2ds1kvgsb15qjfhc.apps.googleusercontent.com',
  NODE_ENV: process.env.NODE_ENV || 'undefined',
  APP_ENV: 'production',
  COMMIT_HASH: commitHashInjection.startsWith('%%COMMIT_HASH_')
    ? 'base'
    : commitHashInjection.slice(0, 7),
}

const development: Environment = {
  ...production,
  GRAPHQL_ENDPOINT: 'http://localhost:9000/graphql',
  APP_ENV: 'development',
}

const env = process.env.NODE_ENV === 'production' ? production : development

export {env}
