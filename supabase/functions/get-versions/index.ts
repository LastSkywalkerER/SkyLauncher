import { createClient } from 'jsr:@supabase/supabase-js@2'

import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! }
      }
    })

    // And we can run queries in the context of our authenticated user
    const { data: versions, error } = await supabase.from('versions').select('*')
    if (error) throw error

    const mappedVersions = versions.map((version) => ({
      downloadUrl: version.download_url,
      version: version.minecraft_version,
      modloader: version.modloader,
      modloaderVersion: version.modloader_version,
      name: version.name,
      icon: version.icon,
      coverImage: version.cover_image,
      titleImage: version.title_image,
      description: version.description
    }))

    return new Response(JSON.stringify(mappedVersions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-versions' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
