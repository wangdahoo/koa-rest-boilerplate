import path from 'path'
import { SwaggerRouter } from 'koa-swagger-decorator'
import setupSwagger from './setupSwagger'

const router = new SwaggerRouter()

// Swagger endpoint
setupSwagger(router)

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(path.resolve(__dirname, '..'), {
    doValidation: false
})

export default router
