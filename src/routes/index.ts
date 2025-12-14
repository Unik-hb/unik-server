import type { FastifyInstance } from 'fastify'
import { approvedPropertyRoutes } from './approved-property.routes.ts'
import { authenticateRoutes } from './authenticate.routes.ts'
import { createAdvertiserIndividualRoutes } from './create-advertiser-individual.routes.ts'
import { createAdvertiserLegalRoutes } from './create-advertiser-legal.routes.ts'
import { createPropertiesRoutes } from './create-properties.routes.ts'
import { createUserAdminRoutes } from './create-user-admin.routes.ts'
import { deletePropertyPhotoRoutes } from './delete-property-photo.routes.ts'
import { getAllPropertyRoutes } from './get-all-property.routes.ts'
import { getAllPropertApprovedRoutes } from './get-all-property-approved.routes.ts'
import { getAllPropertByUsersRoutes } from './get-all-property-by-users.routes.ts'
import { getDetailsPropertyRoutes } from './get-details-property.ts'
import { getProfileRoutes } from './get-profile.routes.ts'
import { rejectedPropertyRoutes } from './rejected-property.routes.ts'
import { revisionPropertyRoutes } from './revision-property.routes.ts'
import { setFeaturedPhotoRoutes } from './set-featured-photo.routes.ts'
import { statePropertyRoutes } from './state-property.routes.ts'
import { logoutRoutes } from './logout.routes.ts'

export async function routes(app: FastifyInstance) {
  // authenticate
  app.register(authenticateRoutes)
  app.register(getProfileRoutes)
  app.register(logoutRoutes)

  // properties
  app.register(createPropertiesRoutes)
  app.register(getAllPropertyRoutes)
  app.register(getDetailsPropertyRoutes)
  app.register(deletePropertyPhotoRoutes)
  app.register(setFeaturedPhotoRoutes)
  app.register(revisionPropertyRoutes)
  app.register(approvedPropertyRoutes)
  app.register(rejectedPropertyRoutes)
  app.register(getAllPropertApprovedRoutes)
  app.register(getAllPropertByUsersRoutes)
  app.register(statePropertyRoutes)

  // users
  app.register(createUserAdminRoutes)
  app.register(createAdvertiserIndividualRoutes)
  app.register(createAdvertiserLegalRoutes)
}
