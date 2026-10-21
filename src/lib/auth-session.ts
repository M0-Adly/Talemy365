export const ADMIN_COOKIE_NAME = 'talemy_admin_session'

interface AdminSessionPayload {
  id: string
  email: string
  name?: string
  exp: number
}

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'talemy-secret-session-key-fallback'

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return atob(base64)
}

export async function createAdminToken(payload: {
  id: string
  email: string
  name?: string
}): Promise<string> {
  const sessionData: AdminSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days expiration
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(sessionData))
  const key = await getCryptoKey()
  const enc = new TextEncoder()
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload))
  const signatureArray = Array.from(new Uint8Array(signatureBuffer))
  const signatureString = String.fromCharCode.apply(null, signatureArray)
  const encodedSignature = base64UrlEncode(signatureString)

  return `${encodedPayload}.${encodedSignature}`
}

export async function verifyAdminToken(
  token: string | undefined | null
): Promise<{ id: string; email: string; name?: string } | null> {
  if (!token || !token.includes('.')) return null

  try {
    const [encodedPayload, encodedSignature] = token.split('.')
    if (!encodedPayload || !encodedSignature) return null

    const key = await getCryptoKey()
    const enc = new TextEncoder()

    const rawSignature = base64UrlDecode(encodedSignature)
    const sigBytes = new Uint8Array(rawSignature.length)
    for (let i = 0; i < rawSignature.length; i++) {
      sigBytes[i] = rawSignature.charCodeAt(i)
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(encodedPayload)
    )

    if (!isValid) return null

    const decoded = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null // Token expired
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    }
  } catch (err) {
    console.error('Failed to verify admin token:', err)
    return null
  }
}
