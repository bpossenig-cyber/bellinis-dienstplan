import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'BELLINIS_ORG_NAME',
  'BELLINIS_ADMIN_EMAIL',
  'BELLINIS_ADMIN_PASSWORD',
  'BELLINIS_ADMIN_NAME',
]

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Fehlende Umgebungsvariable: ${key}`)
  }
}

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const orgName = process.env.BELLINIS_ORG_NAME
const adminEmail = process.env.BELLINIS_ADMIN_EMAIL
const adminPassword = process.env.BELLINIS_ADMIN_PASSWORD
const adminName = process.env.BELLINIS_ADMIN_NAME

const getOrCreateOrganization = async () => {
  const { data: existing, error: selectError } = await client
    .from('organizations')
    .select('id, name')
    .eq('name', orgName)
    .maybeSingle()

  if (selectError) throw selectError
  if (existing) return existing.id

  const { data, error } = await client
    .from('organizations')
    .insert({ name: orgName, timezone: 'Europe/Berlin' })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

const findAuthUserByEmail = async (email) => {
  let page = 1
  const perPage = 200
  while (true) {
    let response
    try {
      response = await client.auth.admin.listUsers({ page, perPage })
    } catch {
      response = await client.auth.admin.listUsers(page, perPage)
    }
    const { data, error } = response
    if (error) throw error
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())
    if (found) return found
    if (data.users.length < perPage) return null
    page += 1
  }
}

const getOrCreateAdminAuthUser = async () => {
  const existing = await findAuthUserByEmail(adminEmail)
  if (existing) return existing.id

  const { data, error } = await client.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: adminName,
    },
  })
  if (error) throw error
  if (!data.user?.id) throw new Error('Admin-Auth-User konnte nicht erstellt werden.')
  return data.user.id
}

const upsertPublicProfile = async (userId, organizationId) => {
  const { error } = await client.from('users').upsert({
    id: userId,
    organization_id: organizationId,
    email: adminEmail,
    full_name: adminName,
    role: 'admin',
  })
  if (error) throw error
}

const ensureStaffRecord = async (userId, organizationId) => {
  const { data: existing, error: selectError } = await client
    .from('staff')
    .select('id')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .maybeSingle()
  if (selectError) throw selectError
  if (existing) return

  const { error } = await client.from('staff').insert({
    organization_id: organizationId,
    user_id: userId,
    full_name: adminName,
    weekly_hours: 40,
    is_core_team: true,
    is_active: true,
  })
  if (error) throw error
}

const main = async () => {
  const organizationId = await getOrCreateOrganization()
  const userId = await getOrCreateAdminAuthUser()
  await upsertPublicProfile(userId, organizationId)
  await ensureStaffRecord(userId, organizationId)

  console.log('Onboarding erfolgreich abgeschlossen.')
  console.log(`Organisation: ${orgName} (${organizationId})`)
  console.log(`Admin: ${adminEmail} (${userId})`)
}

main().catch((error) => {
  console.error('Onboarding fehlgeschlagen:')
  console.error(error.message)
  process.exit(1)
})
