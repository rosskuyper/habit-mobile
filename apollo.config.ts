import {env} from './src/Constants'

const config = {
  client: {
    includes: [__dirname + '/src/**'],
    service: {
      name: `habit-${env.APP_ENV}`,
      url: env.GRAPHQL_ENDPOINT,
    },
  },
}

export default config
