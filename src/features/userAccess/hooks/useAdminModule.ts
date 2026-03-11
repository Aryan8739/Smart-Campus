import { useOutletContext } from 'react-router-dom'
import type { AdminModuleContextValue } from '../types'

export function useAdminModule() {
  return useOutletContext<AdminModuleContextValue>()
}
