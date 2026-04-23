import { archivePlan } from '@/lib/api/bellinisApi'
import type { WeeklyPlan } from '@/lib/types'

interface Props {
  plans: WeeklyPlan[]
  onChanged: () => Promise<void>
}

export const ArchivePanel = ({ plans, onChanged }: Props) => {
  const openPlans = plans.filter((plan) => plan.status !== 'archived')
  const archived = plans.filter((plan) => plan.status === 'archived')

  const onArchive = async (planId: string) => {
    await archivePlan(planId)
    await onChanged()
  }

  return (
    <section className="card">
      <h2>Archiv</h2>
      <ul>
        {openPlans.map((plan) => (
          <li key={plan.id}>
            {plan.week_start} ({plan.status}){' '}
            <button onClick={() => onArchive(plan.id)}>Archivieren</button>
          </li>
        ))}
      </ul>
      <h3>Archivierte Pläne</h3>
      <ul>
        {archived.map((plan) => (
          <li key={plan.id}>{plan.week_start}</li>
        ))}
      </ul>
    </section>
  )
}
