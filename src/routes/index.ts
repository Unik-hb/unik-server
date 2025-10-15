import { FastifyInstance } from 'fastify'
import { createUserAdvertiserIndividualRoutes } from './create-user-advertiser.individual.routes'
import { createUserAdminRoutes } from './create-user-admin.routes'
import { createUserBrokerRoutes } from './create-user-broker.routes'
import { createUserAdvertiserLegalRoutes } from './create-user-advertiser.legal.routes'
import { createPropertyListingRoutes } from './create-property-listing.routes'
import { searchFeaturedPropertiesRoutes } from './search-fetatured-properties.routes'
import { getAllPropertiesRoutes } from './get-all-properties.routes'

export async function routes(app: FastifyInstance) {
  app.register(createUserAdvertiserIndividualRoutes, { prefix: 'users' })
  app.register(createUserAdvertiserLegalRoutes, { prefix: 'users' })
  app.register(createUserAdminRoutes, { prefix: 'users' })
  app.register(createUserBrokerRoutes, { prefix: 'users' })

  app.register(createPropertyListingRoutes, { prefix: 'properties' })
  app.register(searchFeaturedPropertiesRoutes, { prefix: 'properties' })
  app.register(getAllPropertiesRoutes, { prefix: 'properties' })
}
