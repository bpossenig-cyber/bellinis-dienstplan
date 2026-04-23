import { useState, type FormEvent } from 'react'

import { upsertHoliday, upsertSick, upsertVacation } from '@/lib/api/bellinisApi'
import type { Holiday, SickBlock, StaffMember, VacationBlock } from '@/lib/types'

interface Props {
  organizationId: string
  staff: StaffMember[]
  vacation: VacationBlock[]
  sickness: SickBlock[]
  holidays: Holiday[]
  onChanged: () => Promise<void>
}

export const AbsenceManager = ({
  organizationId,
  staff,
  vacation,
  sickness,
  holidays,
  onChanged,
}: Props) => {
  const [staffId, setStaffId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [holidayDate, setHolidayDate] = useState('')
  const [holidayName, setHolidayName] = useState('')

  const createVacation = async (event: FormEvent) => {
    event.preventDefault()
    await upsertVacation({
      organization_id: organizationId,
      staff_id: staffId,
      starts_on: start,
      ends_on: end,
    })
    await onChanged()
  }

  const createSick = async () => {
    await upsertSick({
      organization_id: organizationId,
      staff_id: staffId,
      starts_on: start,
      ends_on: end,
    })
    await onChanged()
  }

  const createHoliday = async (event: FormEvent) => {
    event.preventDefault()
    await upsertHoliday({
      organization_id: organizationId,
      holiday_date: holidayDate,
      name: holidayName,
    })
    setHolidayName('')
    setHolidayDate('')
    await onChanged()
  }

  return (
    <section className="card">
      <h2>Urlaub, Krank und Feiertage</h2>
      <form className="inline-form" onSubmit={createVacation}>
        <select value={staffId} onChange={(e) => setStaffId(e.target.value)} required>
          <option value="">Mitarbeiter wählen</option>
          {staff.map((person) => (
            <option key={person.id} value={person.id}>
              {person.full_name}
            </option>
          ))}
        </select>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} required />
        <button>Urlaub speichern</button>
        <button type="button" onClick={createSick}>
          Krank speichern
        </button>
      </form>

      <form className="inline-form" onSubmit={createHoliday}>
        <input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} required />
        <input
          value={holidayName}
          placeholder="Feiertag"
          onChange={(e) => setHolidayName(e.target.value)}
          required
        />
        <button>Feiertag speichern</button>
      </form>

      <div className="columns">
        <div>
          <h3>Urlaub</h3>
          <ul>{vacation.map((v) => <li key={v.id}>{v.starts_on} bis {v.ends_on}</li>)}</ul>
        </div>
        <div>
          <h3>Krank</h3>
          <ul>{sickness.map((s) => <li key={s.id}>{s.starts_on} bis {s.ends_on}</li>)}</ul>
        </div>
        <div>
          <h3>Feiertage</h3>
          <ul>{holidays.map((h) => <li key={h.id}>{h.holiday_date}: {h.name}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
