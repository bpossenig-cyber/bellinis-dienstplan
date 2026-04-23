import { addDays, formatISO, parseISO } from 'date-fns'

import type { PlanAssignment, Shift, StaffMember, UUID } from '@/lib/types'

interface AutoPlanInput {
  organizationId: UUID
  weekStart: string
  shifts: Shift[]
  coreTeam: StaffMember[]
}

export const generateCoreTeamPlan = ({
  organizationId,
  weekStart,
  shifts,
  coreTeam,
}: AutoPlanInput): Omit<PlanAssignment, 'id' | 'created_at' | 'weekly_plan_id'>[] => {
  if (coreTeam.length === 0 || shifts.length === 0) {
    return []
  }

  const weekStartDate = parseISO(weekStart)
  const result: Omit<PlanAssignment, 'id' | 'created_at' | 'weekly_plan_id'>[] = []
  let cursor = 0

  for (let day = 0; day < 7; day += 1) {
    const assignmentDate = formatISO(addDays(weekStartDate, day), { representation: 'date' })

    for (const shift of shifts) {
      const required = Math.max(1, shift.required_headcount)
      for (let slot = 0; slot < required; slot += 1) {
        const person = coreTeam[cursor % coreTeam.length]
        cursor += 1
        result.push({
          organization_id: organizationId,
          assignment_date: assignmentDate,
          shift_id: shift.id,
          staff_id: person.id,
          source: 'auto',
        })
      }
    }
  }

  return result
}
