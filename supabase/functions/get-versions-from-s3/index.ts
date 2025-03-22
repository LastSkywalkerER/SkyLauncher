import { GetObjectCommand, S3Client } from 'https://esm.sh/@aws-sdk/client-s3@3.596.0'
import { getSignedUrl } from 'https://esm.sh/@aws-sdk/s3-request-presigner@3.596.0'
import { createClient } from 'jsr:@supabase/supabase-js@2'

import { corsHeaders } from '../_shared/cors.ts'

const s3 = new S3Client({
  region: Deno.env.get('AWS_REGION'),
  credentials: {
    accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
    secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!
  },
  endpoint: 'https://storage.yandexcloud.net',
  forcePathStyle: true
})

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! }
        }
      }
    )

    const { data: versions, error } = await supabase.from('versions').select('*')
    if (error) throw error

    const signedUrls = await Promise.all(
      versions.map(async (version) => {
        const key = `modpacks/${version.modpack_name}/${version.name}`

        const command = new GetObjectCommand({
          Bucket: Deno.env.get('S3_BUCKET_NAME'),
          Key: key
        })

        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }) // 1 hour
        return {
          ...version,
          downloadUrl: url
        }
      })
    )

    const mappedVersions = signedUrls.map((version) => ({
      downloadUrl: version.downloadUrl,
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
