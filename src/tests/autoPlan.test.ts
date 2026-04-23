import { describe, expect, it } from 'vitest'

import { generateCoreTeamPlan } from '@/lib/planning/autoPlan'

describe('generateCoreTeamPlan', () => {
  it('erstellt Rotation fuer Kern-Team ueber 7 Tage', () => {
    const output = generateCoreTeamPlan({
      organizationId: 'org-1',
      weekStart: '2026-04-20',
      shifts: [
        {
          id: 'shift-1',
          organization_id: 'org-1',
          name: 'Morgen',
          day_part: 'morning',
          starts_at: '08:00',
          ends_at: '12:00',
          required_headcount: 1,
          created_at: '',
        },
      ],
      coreTeam: [
        {
          id: 'a',
          organization_id: 'org-1',
          user_id: null,
          full_name: 'A',
          weekly_hours: 40,
          is_core_team: true,
          is_active: true,
          created_at: '',
        },
        {
          id: 'b',
          organization_id: 'org-1',
          user_id: null,
          full_name: 'B',
          weekly_hours: 40,
          is_core_team: true,
          is_active: true,
          created_at: '',
        },
      ],
    })

    expect(output).toHaveLength(7)
    expect(output[0].staff_id).toBe('a')
    expect(output[1].staff_id).toBe('b')
    expect(output[2].staff_id).toBe('a')
  })
})
