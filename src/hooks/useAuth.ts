// import { useState, useEffect } from 'react'
// import { User } from '@supabase/supabase-js'
// import { supabase } from '../lib/supabase'

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Get initial session
//     const getSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession()
//       setUser(session?.user ?? null)
//       setLoading(false)
//     }

//     getSession()

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setUser(session?.user ?? null)
//         setLoading(false)
//       }
//     )

//     return () => subscription.unsubscribe()
//   }, [])

//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     return { error }
//   }

//   const signUp = async (email: string, password: string, fullName: string) => {
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//         },
//       },
//     })
//     return { error }
//   }

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut()
//     return { error }
//   }

//   return {
//     user,
//     loading,
//     signIn,
//     signUp,
//     signOut,
//   }
// }

const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  const user = data?.user

  // If sign up was successful and user exists, insert into profiles table
  if (user && !error) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      email,
      full_name: fullName,
      created_at: new Date(),
    })

    if (profileError) {
      console.error('Error inserting into profiles:', profileError)
    }
  }

  return { error }
}
