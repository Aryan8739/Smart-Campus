import { analyticsModule } from './analytics.module'
import { assignmentModule } from './assignment.module'
import { auditComplianceModule } from './auditCompliance.module'
import { billingModule } from './billing.module'
import { complaintIntakeModule } from './complaintIntake.module'
import { customerDashboardAdvancedModule } from './customerDashboardAdvanced.module'
import { feedbackRatingModule } from './feedbackRating.module'
import { inventoryModule } from './inventory.module'
import { notificationEscalationModule } from './notificationEscalation.module'
import { resourceAllocationBookingModule } from './resourceAllocationBooking.module'
import { technicianExecutionModule } from './technicianExecution.module'
import { userAccessModule } from './userAccess.module'

export const moduleCatalog = [
  userAccessModule,
  complaintIntakeModule,
  customerDashboardAdvancedModule,
  assignmentModule,
  technicianExecutionModule,
  notificationEscalationModule,
  inventoryModule,
  resourceAllocationBookingModule,
  billingModule,
  feedbackRatingModule,
  analyticsModule,
  auditComplianceModule,
]
