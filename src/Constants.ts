export type ENVIRONMENT = {
  GRAPHQL_ENDPOINT: string
}

const config: Record<string, ENVIRONMENT> = {
  development: {
    GRAPHQL_ENDPOINT: 'http://localhost:9000/graphql',
  },

  production: {
    GRAPHQL_ENDPOINT: 'https://api.habitualizer.com/graphql',
  },
}

const env = process.env.NODE_ENV === 'development' ? config.development : config.production

export {env}
