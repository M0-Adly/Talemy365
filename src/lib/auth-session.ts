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

function bufferToBase64Url(uint8Array: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToUint8Array(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function utf8ToBase64Url(str: string): string {
  const enc = new TextEncoder()
  return bufferToBase64Url(enc.encode(str))
}

function base64UrlToUtf8(str: string): string {
  const dec = new TextDecoder()
  return dec.decode(base64UrlToUint8Array(str))
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

  const encodedPayload = utf8ToBase64Url(JSON.stringify(sessionData))
  const key = await getCryptoKey()
  const enc = new TextEncoder()
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload))
  const encodedSignature = bufferToBase64Url(new Uint8Array(signatureBuffer))

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
    const sigBytes = base64UrlToUint8Array(encodedSignature)

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(encodedPayload)
    )

    if (!isValid) {
      console.warn('Admin token HMAC verification failed')
      return null
    }

    const decoded = JSON.parse(base64UrlToUtf8(encodedPayload)) as AdminSessionPayload
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      console.warn('Admin token expired')
      return null
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
