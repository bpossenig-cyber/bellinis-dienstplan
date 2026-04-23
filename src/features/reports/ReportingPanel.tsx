import { jsPDF } from 'jspdf'

import type { PlanAssignment, Shift, StaffMember } from '@/lib/types'

interface Props {
  weekStart: string
  assignments: PlanAssignment[]
  shifts: Shift[]
  staff: StaffMember[]
}

export const ReportingPanel = ({ weekStart, assignments, shifts, staff }: Props) => {
  const hoursPerStaff = assignments.reduce<Record<string, number>>((acc, assignment) => {
    const shift = shifts.find((item) => item.id === assignment.shift_id)
    const person = staff.find((item) => item.id === assignment.staff_id)
    if (!shift || !person) return acc

    const start = Number(shift.starts_at.split(':')[0])
    const end = Number(shift.ends_at.split(':')[0])
    const diff = Math.max(0, end - start)
    acc[person.full_name] = (acc[person.full_name] ?? 0) + diff
    return acc
  }, {})

  const exportPdf = () => {
    const doc = new jsPDF()
    doc.text(`Bellinis Wochenauswertung - ${weekStart}`, 10, 10)
    let y = 20
    Object.entries(hoursPerStaff).forEach(([name, hours]) => {
      doc.text(`${name}: ${hours} h`, 10, y)
      y += 8
    })
    doc.save(`bellinis-auswertung-${weekStart}.pdf`)
  }

  return (
    <section className="card">
      <h2>Grundauswertung</h2>
      <ul>
        {Object.entries(hoursPerStaff).map(([name, hours]) => (
          <li key={name}>
            {name}: {hours} h
          </li>
        ))}
      </ul>
      <button onClick={exportPdf}>PDF Export</button>
    </section>
  )
}
