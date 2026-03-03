/* ============================================================
   QUICKFOUND — TypeScript Type Definitions
   ============================================================ */

/* ---------- AUTH & USER ---------- */
export interface User {
  _id: string
  name: string
  email: string
  universityRollNumber: string
  studentId: string
  role: 'student' | 'admin'
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  universityRollNumber: string
  studentId: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

/* ---------- ITEMS ---------- */
export type ItemType = 'lost' | 'found'
export type ItemStatus = 'active' | 'claimed' | 'resolved'
export type ItemCategory =
  | 'electronics' | 'clothing' | 'accessories'
  | 'documents' | 'keys' | 'bags' | 'stationery'
  | 'sports' | 'other'

export interface Item {
  _id: string
  type: ItemType
  status: ItemStatus
  title: string
  description: string
  category: ItemCategory
  location: string
  date: string
  imageUrl?: string
  postedBy: User | string
  securityQuestion?: string
  extraAttributes?: Record<string, string>
  claimRequests?: ClaimRequest[]
  createdAt: string
  updatedAt: string
}

export interface ItemFormValues {
  type: ItemType
  title: string
  description: string
  category: ItemCategory
  location: string
  date: string
  image?: File
  securityQuestion?: string
  securityAnswer?: string
  extraAttributes?: Record<string, string>
}

/* ---------- CLAIMS ---------- */
export interface ClaimRequest {
  _id: string
  item: Item | string
  claimedBy: User | string
  securityAnswer: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  createdAt: string
}


export interface ClaimPayload {
  itemId: string
  securityAnswer: string
  message?: string
}

/* ---------- SEARCH & FILTER ---------- */
export interface ItemFilters {
  type?: ItemType | 'all'
  category?: ItemCategory | 'all'
  status?: ItemStatus | 'all'
  location?: string
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/* ---------- API ---------- */
export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string>
}

/* ---------- UI ---------- */
export type Theme = 'light' | 'dark' | 'system'