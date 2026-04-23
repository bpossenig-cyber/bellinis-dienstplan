import { startOfWeek } from 'date-fns'

import { supabase } from '@/lib/supabaseClient'
import type {
  DashboardData,
  Holiday,
  PlanAssignment,
  SickBlock,
  Shift,
  StaffMember,
  UserProfile,
  VacationBlock,
  WeeklyPlan,
} from '@/lib/types'

const requireClient = () => {
  if (!supabase) {
    throw new Error('Supabase ist nicht konfiguriert. Bitte .env setzen.')
  }
  return supabase
}

const handleError = (error: { message: string } | null) => {
  if (error) {
    throw new Error(error.message)
  }
}

export const getCurrentProfile = async (): Promise<UserProfile | null> => {
  const client = requireClient()
  const { data: authResult } = await client.auth.getUser()
  if (!authResult.user) {
    return null
  }
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', authResult.user.id)
    .single()
  handleError(error)
  return data as UserProfile
}

export const loadDashboardData = async (
  organizationId: string,
  weekStartIso: string,
): Promise<DashboardData> => {
  const client = requireClient()
  const weekEnd = new Date(weekStartIso)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const weekEndIso = weekEnd.toISOString().slice(0, 10)

  const [staffRes, shiftsRes, plansRes, assignmentsRes, vacationRes, sickRes, holidayRes] =
    await Promise.all([
      client.from('staff').select('*').eq('organization_id', organizationId).order('full_name'),
      client.from('shifts').select('*').eq('organization_id', organizationId).order('starts_at'),
      client
        .from('weekly_plans')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('week_start', weekStartIso)
        .lte('week_start', weekEndIso)
        .order('week_start', { ascending: true }),
      client
        .from('plan_assignments')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('assignment_date', weekStartIso)
        .lte('assignment_date', weekEndIso),
      client
        .from('vacation_blocks')
        .select('*')
        .eq('organization_id', organizationId)
        .lte('starts_on', weekEndIso)
        .gte('ends_on', weekStartIso),
      client
        .from('sick_blocks')
        .select('*')
        .eq('organization_id', organizationId)
        .lte('starts_on', weekEndIso)
        .gte('ends_on', weekStartIso),
      client
        .from('holidays')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('holiday_date', weekStartIso)
        .lte('holiday_date', weekEndIso),
    ])

  handleError(staffRes.error)
  handleError(shiftsRes.error)
  handleError(plansRes.error)
  handleError(assignmentsRes.error)
  handleError(vacationRes.error)
  handleError(sickRes.error)
  handleError(holidayRes.error)

  return {
    staff: (staffRes.data ?? []) as StaffMember[],
    shifts: (shiftsRes.data ?? []) as Shift[],
    plans: (plansRes.data ?? []) as WeeklyPlan[],
    assignments: (assignmentsRes.data ?? []) as PlanAssignment[],
    vacation: (vacationRes.data ?? []) as VacationBlock[],
    sickness: (sickRes.data ?? []) as SickBlock[],
    holidays: (holidayRes.data ?? []) as Holiday[],
  }
}

export const upsertStaff = async (staff: Partial<StaffMember>) => {
  const client = requireClient()
  const payload = {
    ...staff,
    is_active: staff.is_active ?? true,
    is_core_team: staff.is_core_team ?? false,
  }
  const { error } = await client.from('staff').upsert(payload)
  handleError(error)
}

export const upsertShift = async (shift: Partial<Shift>) => {
  const client = requireClient()
  const { error } = await client.from('shifts').upsert(shift)
  handleError(error)
}

export const upsertVacation = async (item: Partial<VacationBlock>) => {
  const client = requireClient()
  const { error } = await client.from('vacation_blocks').upsert(item)
  handleError(error)
}

export const upsertSick = async (item: Partial<SickBlock>) => {
  const client = requireClient()
  const { error } = await client.from('sick_blocks').upsert(item)
  handleError(error)
}

export const upsertHoliday = async (item: Partial<Holiday>) => {
  const client = requireClient()
  const { error } = await client.from('holidays').upsert(item)
  handleError(error)
}

export const saveWeeklyPlan = async (plan: Partial<WeeklyPlan>) => {
  const client = requireClient()
  const { data, error } = await client.from('weekly_plans').upsert(plan).select('id').single()
  handleError(error)
  if (!data?.id) {
    throw new Error('Wochenplan konnte nicht gespeichert werden.')
  }
  return data.id as string
}

export const replaceAssignments = async (
  organizationId: string,
  weeklyPlanId: string,
  assignments: Omit<PlanAssignment, 'id' | 'created_at' | 'weekly_plan_id'>[],
) => {
  const client = requireClient()
  const { error: deleteError } = await client
    .from('plan_assignments')
    .delete()
    .eq('organization_id', organizationId)
    .eq('weekly_plan_id', weeklyPlanId)
  handleError(deleteError)

  if (assignments.length === 0) {
    return
  }

  const { error: insertError } = await client.from('plan_assignments').insert(
    assignments.map((item) => ({
      ...item,
      weekly_plan_id: weeklyPlanId,
    })),
  )
  handleError(insertError)
}

export const archivePlan = async (weeklyPlanId: string) => {
  const client = requireClient()
  const { error } = await client
    .from('weekly_plans')
    .update({ status: 'archived' })
    .eq('id', weeklyPlanId)
  handleError(error)
}

export const createWeekStartIso = (date: Date): string =>
  startOfWeek(date, { weekStartsOn: 1 }).toISOString().slice(0, 10)
