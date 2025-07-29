'use client'
import { useContext,createContext,useState,useEffect } from "react";
import api from '@/utils/api.js'

const AuthContext = createContext()

export const AuthProvider = ({children})=>{
      const [isLoggedIn, setIsLoggedIn] = useState(false)


      useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get('/profile')  // your token-check route
                setIsLoggedIn(true)
            } catch (error) {
                setIsLoggedIn(false)
            }
        }
        checkAuth()
    }, [])


 return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)