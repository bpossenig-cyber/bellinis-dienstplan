import { useState, type FormEvent } from 'react'

import { upsertShift } from '@/lib/api/bellinisApi'
import type { Shift } from '@/lib/types'

interface Props {
  organizationId: string
  shifts: Shift[]
  onChanged: () => Promise<void>
}

export const ShiftManager = ({ organizationId, shifts, onChanged }: Props) => {
  const [name, setName] = useState('')
  const [dayPart, setDayPart] = useState<Shift['day_part']>('morning')
  const [startsAt, setStartsAt] = useState('08:00')
  const [endsAt, setEndsAt] = useState('16:00')
  const [required, setRequired] = useState(1)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await upsertShift({
      organization_id: organizationId,
      name,
      day_part: dayPart,
      starts_at: startsAt,
      ends_at: endsAt,
      required_headcount: required,
    })
    setName('')
    await onChanged()
  }

  return (
    <section className="card">
      <h2>Schichtverwaltung</h2>
      <form className="inline-form" onSubmit={onSubmit}>
        <input value={name} required placeholder="Schichtname" onChange={(e) => setName(e.target.value)} />
        <select value={dayPart} onChange={(e) => setDayPart(e.target.value as Shift['day_part'])}>
          <option value="morning">Morgen</option>
          <option value="midday">Mittag</option>
          <option value="evening">Abend</option>
        </select>
        <input type="time" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        <input type="time" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        <input
          type="number"
          min={1}
          value={required}
          onChange={(e) => setRequired(Number(e.target.value))}
        />
        <button>Speichern</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Zeit</th>
            <th>Typ</th>
            <th>Soll</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id}>
              <td>{shift.name}</td>
              <td>
                {shift.starts_at} - {shift.ends_at}
              </td>
              <td>{shift.day_part}</td>
              <td>{shift.required_headcount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
