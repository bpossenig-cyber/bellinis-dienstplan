import { useState } from 'react'

import { upsertStaff } from '@/lib/api/bellinisApi'
import type { StaffMember } from '@/lib/types'

interface Props {
  organizationId: string
  staff: StaffMember[]
  onChanged: () => Promise<void>
}

export const StaffManager = ({ organizationId, staff, onChanged }: Props) => {
  const [name, setName] = useState('')
  const [hours, setHours] = useState(40)
  const [coreTeam, setCoreTeam] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await upsertStaff({
        organization_id: organizationId,
        full_name: name.trim(),
        weekly_hours: Number(hours),
        is_core_team: coreTeam,
        is_active: true,
      })
      setName('')
      setHours(40)
      setCoreTeam(false)
      await onChanged()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card">
      <h2>Mitarbeiterverwaltung</h2>
      <form className="inline-form" onSubmit={onSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Name"
          disabled={saving}
        />
        <input
          type="number"
          min={1}
          max={60}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          disabled={saving}
        />
        <label>
          <input
            type="checkbox"
            checked={coreTeam}
            onChange={(e) => setCoreTeam(e.target.checked)}
            disabled={saving}
          />
          Kern-Team
        </label>
        <button disabled={saving}>{saving ? 'Speichert...' : 'Anlegen'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Std/Woche</th>
            <th>Kern-Team</th>
            <th>Aktiv</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id}>
              <td>{member.full_name}</td>
              <td>{member.weekly_hours}</td>
              <td>{member.is_core_team ? 'Ja' : 'Nein'}</td>
              <td>{member.is_active ? 'Ja' : 'Nein'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
