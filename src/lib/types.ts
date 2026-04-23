export type UserRole = 'admin' | 'manager' | 'employee'

export type UUID = string

export interface UserProfile {
  id: UUID
  organization_id: UUID
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

export interface Organization {
  id: UUID
  name: string
  timezone: string
  created_at: string
}

export interface StaffMember {
  id: UUID
  organization_id: UUID
  user_id: UUID | null
  full_name: string
  weekly_hours: number
  is_core_team: boolean
  is_active: boolean
  created_at: string
}

export interface Shift {
  id: UUID
  organization_id: UUID
  name: string
  day_part: 'morning' | 'midday' | 'evening'
  starts_at: string
  ends_at: string
  required_headcount: number
  created_at: string
}

export interface WeeklyPlan {
  id: UUID
  organization_id: UUID
  week_start: string
  status: 'draft' | 'published' | 'archived'
  notes: string | null
  created_by: UUID
  created_at: string
}

export interface PlanAssignment {
  id: UUID
  organization_id: UUID
  weekly_plan_id: UUID
  staff_id: UUID
  shift_id: UUID
  assignment_date: string
  source: 'manual' | 'auto'
  created_at: string
}

export interface VacationBlock {
  id: UUID
  organization_id: UUID
  staff_id: UUID
  starts_on: string
  ends_on: string
  note: string | null
  created_at: string
}

export interface SickBlock {
  id: UUID
  organization_id: UUID
  staff_id: UUID
  starts_on: string
  ends_on: string
  note: string | null
  created_at: string
}

export interface Holiday {
  id: UUID
  organization_id: UUID
  holiday_date: string
  name: string
  created_at: string
}

export interface AppSetting {
  id: UUID
  organization_id: UUID
  key: string
  value: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: UUID
  organization_id: UUID
  actor_user_id: UUID
  action: string
  entity_type: string
  entity_id: UUID
  payload: Record<string, unknown> | null
  created_at: string
}

export interface PlanSnapshot {
  id: UUID
  organization_id: UUID
  weekly_plan_id: UUID
  exported_at: string
  json_payload: string
}

export interface DashboardData {
  staff: StaffMember[]
  shifts: Shift[]
  plans: WeeklyPlan[]
  assignments: PlanAssignment[]
  vacation: VacationBlock[]
  sickness: SickBlock[]
  holidays: Holiday[]
}
