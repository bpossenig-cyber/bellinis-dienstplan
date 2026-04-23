import { useState } from 'react'

import { upsertHoliday, upsertShift, upsertSick, upsertStaff, upsertVacation } from '@/lib/api/bellinisApi'
import type { DashboardData } from '@/lib/types'

interface Props {
  organizationId: string
  data: DashboardData
  onChanged: () => Promise<void>
}

interface LegacyImport {
  staff?: Array<{ full_name: string; weekly_hours?: number; is_core_team?: boolean }>
  shifts?: Array<{
    name: string
    day_part: 'morning' | 'midday' | 'evening'
    starts_at: string
    ends_at: string
    required_headcount?: number
  }>
  vacation_blocks?: Array<{ staff_id: string; starts_on: string; ends_on: string }>
  sick_blocks?: Array<{ staff_id: string; starts_on: string; ends_on: string }>
  holidays?: Array<{ holiday_date: string; name: string }>
}

export const DataTransferPanel = ({ organizationId, data, onChanged }: Props) => {
  const [importStatus, setImportStatus] = useState<string>('')

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `bellinis-export-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const onImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImportStatus('Import laeuft...')
    const text = await file.text()
    const parsed = JSON.parse(text) as LegacyImport

    if (parsed.staff) {
      await Promise.all(
        parsed.staff.map((member) =>
          upsertStaff({
            organization_id: organizationId,
            full_name: member.full_name,
            weekly_hours: member.weekly_hours ?? 40,
            is_core_team: member.is_core_team ?? false,
            is_active: true,
          }),
        ),
      )
    }
    if (parsed.shifts) {
      await Promise.all(
        parsed.shifts.map((shift) =>
          upsertShift({
            organization_id: organizationId,
            ...shift,
            required_headcount: shift.required_headcount ?? 1,
          }),
        ),
      )
    }
    if (parsed.vacation_blocks) {
      await Promise.all(
        parsed.vacation_blocks.map((vacation) =>
          upsertVacation({
            organization_id: organizationId,
            ...vacation,
          }),
        ),
      )
    }
    if (parsed.sick_blocks) {
      await Promise.all(
        parsed.sick_blocks.map((sick) =>
          upsertSick({
            organization_id: organizationId,
            ...sick,
          }),
        ),
      )
    }
    if (parsed.holidays) {
      await Promise.all(
        parsed.holidays.map((holiday) =>
          upsertHoliday({
            organization_id: organizationId,
            ...holiday,
          }),
        ),
      )
    }

    await onChanged()
    setImportStatus('Import erfolgreich abgeschlossen.')
  }

  return (
    <section className="card">
      <h2>Migration und Kompatibilitaet</h2>
      <p>JSON-Import fuer Bestandsdaten aus der alten App.</p>
      <div className="inline-actions">
        <button onClick={exportJson}>Aktuelle Daten als JSON exportieren</button>
        <label className="file-label">
          JSON importieren
          <input type="file" accept="application/json" onChange={onImportFile} />
        </label>
      </div>
      {importStatus && <p>{importStatus}</p>}
    </section>
  )
}
