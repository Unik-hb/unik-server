import type { FastifyInstance } from 'fastify'
import { approvedPropertyRoutes } from './approved-property.routes.ts'
import { authenticateRoutes } from './authenticate.routes.ts'
import { createAdvertiserIndividualRoutes } from './create-advertiser-individual.routes.ts'
import { createAdvertiserLegalRoutes } from './create-advertiser-legal.routes.ts'
import { createPropertiesRoutes } from './create-properties.routes.ts'
import { createUserAdminRoutes } from './create-user-admin.routes.ts'
import { deletePropertyRoutes } from './delete-property.routes.ts'
import { deletePropertyPhotoRoutes } from './delete-property-photo.routes.ts'
import { editReceivedPropertyRoutes } from './edit-received-property.routes.ts'
import { getAllPropertyRoutes } from './get-all-property.routes.ts'
import { getAllPropertApprovedRoutes } from './get-all-property-approved.routes.ts'
import { getAllPropertByUsersRoutes } from './get-all-property-by-users.routes.ts'
import { getDetailsPropertyRoutes } from './get-details-property.ts'
import { getProfileRoutes } from './get-profile.routes.ts'
import { listOfPropertiesSoldRentedRejectedRoute } from './list-of-properties-sold-rented-rejected.routes.ts'
import { logoutRoutes } from './logout.routes.ts'
import { markAsSoldOrRentedRoutes } from './mark-as-sold-or-rented.routes.ts'
import { propertyReviewRoutes } from './property-review.routes.ts'
import { rejectedPropertyRoutes } from './rejected-property.routes.ts'
import { revisionPropertyRoutes } from './revision-property.routes.ts'
import { setFeaturedPhotoRoutes } from './set-featured-photo.routes.ts'
import { statePropertyRoutes } from './state-property.routes.ts'

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
  app.register(deletePropertyRoutes)
  app.register(setFeaturedPhotoRoutes)
  app.register(revisionPropertyRoutes)
  app.register(approvedPropertyRoutes)
  app.register(rejectedPropertyRoutes)
  app.register(getAllPropertApprovedRoutes)
  app.register(getAllPropertByUsersRoutes)
  app.register(statePropertyRoutes)
  app.register(editReceivedPropertyRoutes)
  app.register(listOfPropertiesSoldRentedRejectedRoute)
  app.register(markAsSoldOrRentedRoutes)
  app.register(propertyReviewRoutes)

  // users
  app.register(createUserAdminRoutes)
  app.register(createAdvertiserIndividualRoutes)
  app.register(createAdvertiserLegalRoutes)
}
