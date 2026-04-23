import { useState } from 'react'

import { AbsenceManager } from '@/features/absences/AbsenceManager'
import { ArchivePanel } from '@/features/archive/ArchivePanel'
import { WeeklyPlanManager } from '@/features/plans/WeeklyPlanManager'
import { ReportingPanel } from '@/features/reports/ReportingPanel'
import { ShiftManager } from '@/features/shifts/ShiftManager'
import { StaffManager } from '@/features/staff/StaffManager'
import { DataTransferPanel } from '@/features/transfer/DataTransferPanel'
import { roleLabel } from '@/lib/permissions'
import type { UserProfile } from '@/lib/types'

import { useDashboardData } from './useDashboardData'

interface Props {
  profile: UserProfile
  onSignOut: () => Promise<void>
}

const tabs = [
  { id: 'staff', label: 'Mitarbeiter' },
  { id: 'shifts', label: 'Schichten' },
  { id: 'plans', label: 'Wochenplan' },
  { id: 'absences', label: 'Abwesenheiten' },
  { id: 'reports', label: 'Auswertung' },
  { id: 'archive', label: 'Archiv' },
  { id: 'transfer', label: 'Import/Export' },
] as const

type TabId = (typeof tabs)[number]['id']

export const DashboardPage = ({ profile, onSignOut }: Props) => {
  const [activeTab, setActiveTab] = useState<TabId>('staff')
  const [resettingClient, setResettingClient] = useState(false)
  const { weekStart, setWeekStart, data, loading, error, reload } = useDashboardData(
    profile.organization_id,
  )

  const resetLocalClientData = async () => {
    const confirmed = window.confirm(
      'Lokale Browser-Daten werden geloescht und die Seite neu geladen. Fortfahren?',
    )
    if (!confirmed) return

    setResettingClient(true)
    try {
      localStorage.clear()
      sessionStorage.clear()

      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((registration) => registration.unregister()))
      }
    } finally {
      window.location.reload()
    }
  }

  return (
    <main className="dashboard">
      <header className="app-header">
        <div>
          <h1>Bellinis Planung</h1>
          <p>
            {profile.full_name} ({roleLabel[profile.role]})
          </p>
        </div>
        <div className="inline-actions">
          <input
            type="date"
            value={weekStart}
            onChange={(event) => setWeekStart(event.target.value)}
            aria-label="Woche"
          />
          <button onClick={() => void reload()}>Neu laden</button>
          <button
            className="danger-button"
            onClick={() => void resetLocalClientData()}
            disabled={resettingClient}
          >
            {resettingClient ? 'Setzt zurueck...' : 'Lokale Daten zuruecksetzen'}
          </button>
          <button onClick={() => void onSignOut()}>Logout</button>
        </div>
      </header>

      <nav className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeTab ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {loading && <p>Lade Daten...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (
        <>
          {activeTab === 'staff' && (
            <StaffManager
              organizationId={profile.organization_id}
              staff={data.staff}
              onChanged={reload}
            />
          )}
          {activeTab === 'shifts' && (
            <ShiftManager
              organizationId={profile.organization_id}
              shifts={data.shifts}
              onChanged={reload}
            />
          )}
          {activeTab === 'plans' && (
            <WeeklyPlanManager
              organizationId={profile.organization_id}
              userId={profile.id}
              weekStart={weekStart}
              plans={data.plans}
              assignments={data.assignments}
              shifts={data.shifts}
              staff={data.staff}
              onChanged={reload}
            />
          )}
          {activeTab === 'absences' && (
            <AbsenceManager
              organizationId={profile.organization_id}
              staff={data.staff}
              vacation={data.vacation}
              sickness={data.sickness}
              holidays={data.holidays}
              onChanged={reload}
            />
          )}
          {activeTab === 'reports' && (
            <ReportingPanel
              weekStart={weekStart}
              assignments={data.assignments}
              shifts={data.shifts}
              staff={data.staff}
            />
          )}
          {activeTab === 'archive' && <ArchivePanel plans={data.plans} onChanged={reload} />}
          {activeTab === 'transfer' && (
            <DataTransferPanel
              organizationId={profile.organization_id}
              data={data}
              onChanged={reload}
            />
          )}
        </>
      )}
    </main>
  )
}
