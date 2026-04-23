import { useCallback, useEffect, useMemo, useState } from 'react'

import { createWeekStartIso, loadDashboardData } from '@/lib/api/bellinisApi'
import type { DashboardData } from '@/lib/types'

const emptyData: DashboardData = {
  staff: [],
  shifts: [],
  plans: [],
  assignments: [],
  vacation: [],
  sickness: [],
  holidays: [],
}

export const useDashboardData = (organizationId?: string) => {
  const [weekStart, setWeekStart] = useState(() => createWeekStartIso(new Date()))
  const [data, setData] = useState<DashboardData>(emptyData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!organizationId) return
    setLoading(true)
    setError(null)
    try {
      const loaded = await loadDashboardData(organizationId, weekStart)
      setData(loaded)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unbekannter Ladefehler')
    } finally {
      setLoading(false)
    }
  }, [organizationId, weekStart])

  useEffect(() => {
    void reload()
  }, [reload])

  return useMemo(
    () => ({
      weekStart,
      setWeekStart,
      data,
      loading,
      error,
      reload,
    }),
    [weekStart, data, loading, error, reload],
  )
}
