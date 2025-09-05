import { createContext } from 'react'
import type { AuthContextType } from '../@types/contexts'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
