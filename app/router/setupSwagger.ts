import { SwaggerRouter } from 'koa-swagger-decorator'
import pkg from '../../package.json'

export default function setupSwagger (router: SwaggerRouter) {
    router.swagger({
        title: pkg.name,
        description: pkg.description,
        version: pkg.version,

        // [optional] default is /swagger-html
        swaggerHtmlEndpoint: '/doc',

        // [optional] default is /swagger-json
        swaggerJsonEndpoint: '/doc-json',

        // [optional] additional options for building swagger doc
        // eg. add api_key as shown below
        swaggerOptions: {
            securityDefinitions: {
                token: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-custom-token'
                }
            }
        },

        // [optional] additional configuration for config how to show swagger view
        swaggerConfiguration: {
            display: {
                defaultModelsExpandDepth: 4, // The default expansion depth for models (set to -1 completely hide the models).
                defaultModelExpandDepth: 3, // The default expansion depth for the model on the model-example section.
                docExpansion: 'list', // Controls the default expansion setting for the operations and tags.
                defaultModelRendering: 'model' // Controls how the model is shown when the API is first rendered.
            }
        }
    })
}
