import { createContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(() => sessionStorage.getItem('common-goods-username') || '')

  const value = useMemo(() => ({
    username,
    signIn: (nextUsername) => {
      const normalizedUsername = nextUsername.trim()
      sessionStorage.setItem('common-goods-username', normalizedUsername)
      setUsername(normalizedUsername)
    },
    signOut: () => {
      sessionStorage.removeItem('common-goods-username')
      setUsername('')
    },
  }), [username])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext