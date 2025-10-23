import type { FastifyInstance } from 'fastify'
import { createPropertyListingRoutes } from './create-property-listing.routes.ts'
import { createUserAdminRoutes } from './create-user-admin.routes.ts'
import { createUserAdvertiserIndividualRoutes } from './create-user-advertiser.individual.routes.ts'
import { createUserAdvertiserLegalRoutes } from './create-user-advertiser.legal.routes.ts'
import { getAllBrokersRoutes } from './get-all-brokers.routes.ts'
import { getAllPropertiesRoutes } from './get-all-properties.routes.ts'
import { getDetailsBrokerRoutes } from './get-details-broker.routes.ts'
import { getDetailsPropertyRoutes } from './get-details-property.routes.ts'
import { searchFeaturedPropertiesRoutes } from './search-fetatured-properties.routes.ts'
import { updateRoleUserBrokerRoutes } from './update-role-user-broker.routes.ts'

export async function routes(app: FastifyInstance) {
  app.register(createUserAdvertiserIndividualRoutes, { prefix: 'users' })
  app.register(createUserAdvertiserLegalRoutes, { prefix: 'users' })
  app.register(createUserAdminRoutes, { prefix: 'users' })
  app.register(getAllBrokersRoutes, { prefix: 'users' })
  app.register(updateRoleUserBrokerRoutes, { prefix: 'users' })
  app.register(getDetailsBrokerRoutes, { prefix: 'users' })

  app.register(createPropertyListingRoutes, { prefix: 'properties' })
  app.register(searchFeaturedPropertiesRoutes, { prefix: 'properties' })
  app.register(getAllPropertiesRoutes, { prefix: 'properties' })
  app.register(getDetailsPropertyRoutes, { prefix: 'properties' })
}
