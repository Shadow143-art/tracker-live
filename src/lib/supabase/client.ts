import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (typeof window === 'undefined') {
    // Return a dummy client on the server during SSG to prevent cookie errors
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: null, error: null }),
        signUp: async () => ({ data: null, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            limit: async () => ({ data: null, error: null }),
            or: async () => ({ data: null, error: null }),
          }),
          neq: () => ({
            eq: () => ({
              limit: async () => ({ data: null, error: null })
            })
          })
        }),
        insert: async () => ({ error: null, data: null }),
        update: () => ({ eq: async () => ({ error: null, data: null }) }),
      })
    } as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
