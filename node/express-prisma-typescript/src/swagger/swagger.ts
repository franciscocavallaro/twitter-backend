const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['../src/index.ts']

const doc = {
  info: {
    version: '1.0.0',
    title: 'My API',
    description: 'Documentation of my API'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      Bearer: []
    }
  ]
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../src/index.ts')
})
