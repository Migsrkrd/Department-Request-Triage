import type { User } from '../types'

export const USERS: User[] = [
  {
    id: 'michael',
    name: 'Michael',
    role: 'employee',
    department: 'Marketing',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'manager',
    department: 'Operations',
  },
]

export function getUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id)
}
