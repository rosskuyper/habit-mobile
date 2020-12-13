import {GRAPHQL_ENDPOINT} from './src/Constants'

module.exports = {
  client: {
    includes: [__dirname + '/src/**'],
    service: {
      name: 'habit',
      url: GRAPHQL_ENDPOINT,
    },
  },
}
