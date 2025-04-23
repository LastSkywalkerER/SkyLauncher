import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Cloud Supabase configuration
const cloudSupabaseUrl = process.env.SUPABASE_URL
const cloudSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Local Supabase configuration
const localSupabaseUrl = process.env.SUPABASE_LOCAL_URL || 'http://localhost:54321'
const localSupabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

if (!cloudSupabaseUrl || !cloudSupabaseKey) {
  console.error('Missing cloud Supabase configuration')
  process.exit(1)
}

// Initialize clients
const cloudClient = createClient(cloudSupabaseUrl, cloudSupabaseKey)
const localClient = createClient(localSupabaseUrl, localSupabaseKey)

async function syncTable(tableName: string): Promise<void> {
  console.log(`Syncing table: ${tableName}`)

  try {
    // Fetch data from cloud
    const { data: cloudData, error: fetchError } = await cloudClient.from(tableName).select('*')

    if (fetchError) {
      throw fetchError
    }

    if (!cloudData || cloudData.length === 0) {
      console.log(`No data found in cloud for table: ${tableName}`)
      return
    }

    // Clear local table
    const { error: deleteError } = await localClient.from(tableName).delete().neq('id', 0) // Delete all records

    if (deleteError) {
      throw deleteError
    }

    // Insert data into local
    const { error: insertError } = await localClient.from(tableName).insert(cloudData)

    if (insertError) {
      throw insertError
    }

    console.log(`Successfully synced ${cloudData.length} records for table: ${tableName}`)
  } catch (error) {
    console.error(`Error syncing table ${tableName}:`, error)
  }
}

async function main(): Promise<void> {
  console.log('Starting data sync...')

  // List of tables to sync
  const tables = ['modpacks', 'versions']

  for (const table of tables) {
    await syncTable(table)
  }

  console.log('Data sync completed!')
}

main().catch(console.error)
