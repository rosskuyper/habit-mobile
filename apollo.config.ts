import {env} from './src/Constants'

const config = {
  client: {
    includes: [__dirname + '/src/**'],
    service: {
      name: 'habit',
      url: env.GRAPHQL_ENDPOINT,
    },
  },
}

export default config
