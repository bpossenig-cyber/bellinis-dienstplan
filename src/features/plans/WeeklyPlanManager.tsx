import { useMemo, useState } from 'react'

import { replaceAssignments, saveWeeklyPlan } from '@/lib/api/bellinisApi'
import { generateCoreTeamPlan } from '@/lib/planning/autoPlan'
import type { PlanAssignment, Shift, StaffMember, WeeklyPlan } from '@/lib/types'

interface Props {
  organizationId: string
  userId: string
  weekStart: string
  plans: WeeklyPlan[]
  assignments: PlanAssignment[]
  shifts: Shift[]
  staff: StaffMember[]
  onChanged: () => Promise<void>
}

export const WeeklyPlanManager = ({
  organizationId,
  userId,
  weekStart,
  plans,
  assignments,
  shifts,
  staff,
  onChanged,
}: Props) => {
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const planInWeek = useMemo(
    () => plans.find((plan) => plan.week_start === weekStart),
    [plans, weekStart],
  )

  const coreTeam = useMemo(() => staff.filter((item) => item.is_core_team), [staff])

  const saveDraft = async () => {
    setSaving(true)
    const planId = await saveWeeklyPlan({
      id: planInWeek?.id,
      organization_id: organizationId,
      week_start: weekStart,
      status: 'draft',
      notes,
      created_by: userId,
    })
    await replaceAssignments(
      organizationId,
      planId,
      assignments.map((a) => ({
        organization_id: a.organization_id,
        assignment_date: a.assignment_date,
        shift_id: a.shift_id,
        staff_id: a.staff_id,
        source: a.source,
      })),
    )
    await onChanged()
    setSaving(false)
  }

  const autoPlanCoreTeam = async () => {
    const planId = await saveWeeklyPlan({
      id: planInWeek?.id,
      organization_id: organizationId,
      week_start: weekStart,
      status: 'draft',
      notes: `${notes}\nAuto-Plan Kern-Team`,
      created_by: userId,
    })
    const autoAssignments = generateCoreTeamPlan({
      organizationId,
      weekStart,
      shifts,
      coreTeam,
    })
    await replaceAssignments(organizationId, planId, autoAssignments)
    await onChanged()
  }

  return (
    <section className="card">
      <h2>Wochenplan</h2>
      <p>Woche ab: {weekStart}</p>
      <textarea
        placeholder="Notizen zum Plan"
        rows={3}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <div className="inline-actions">
        <button onClick={saveDraft} disabled={saving}>
          {saving ? 'Speichert...' : 'Plan speichern'}
        </button>
        <button onClick={autoPlanCoreTeam}>Auto-Plan (nur Kern-Team)</button>
      </div>
      <p>Zuordnungen in dieser Woche: {assignments.length}</p>
    </section>
  )
}
