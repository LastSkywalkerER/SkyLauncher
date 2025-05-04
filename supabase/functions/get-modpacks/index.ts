/**
 * How to test locally:
 * 1. Install Supabase CLI: https://supabase.com/docs/guides/cli
 * 2. Start Supabase locally:
 *    supabase start
 * 3. Link your project:
 *    supabase link --project-ref your-project-ref
 * 4. Deploy the function:
 *    supabase functions deploy get-modpacks
 * 5. Test with curl:
 *    curl -X GET 'http://localhost:54321/functions/v1/get-modpacks' \
 *      -H 'Authorization: Bearer your-anon-key'
 */

import { createClient } from 'jsr:@supabase/supabase-js@2'

import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  console.log('Function started')
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Creating admin client')
    // Create admin client with service role key for database access
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Validate user token if provided
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      console.log('Validating auth token')
      const { error: authError, data: user } = await adminClient.auth.getUser(authHeader)

      console.log('Auth validation result:', { authError, user })
      // if (authError) {
      //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      //     headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      //     status: 401
      //   })
      // }
    }

    console.log('Fetching modpacks')
    // Fetch modpacks with their associated versions
    const { data: modpacks, error } = await adminClient.from('modpacks').select(`
        id,
        name,
        backet_path,
        versions (
          id,
          created_at,
          name,
          title,
          modpack_name,
          modpack_version,
          minecraft_version,
          modloader,
          modloader_version,
          icon,
          cover_image,
          title_image,
          description,
          download_url
        )
      `)

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Modpacks fetched successfully:', modpacks?.length || 0, 'items')

    return new Response(JSON.stringify(modpacks), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
