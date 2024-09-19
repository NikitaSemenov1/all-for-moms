export interface User {
    id: string
    name: string
    role?: string
    email: string
    password: string
    family_id: string
    award_balance?: number
    reserved_award_balance?: number
}

export interface WishlistItem {
    id: string
    title: string
    description?: string
    reserved_by?: string
    is_done: boolean
    owner: string
}

export interface Family {
    id: string
    owner: string
    members: string[]
}

export interface DiaryNoteItem {
    id: string
    date: string
    text: string
}

export interface ShopItem {
    id?: string
    title: string
    description?: string
    priority: string | null
    family_id: string
    reserved_by?: string
    completed_by: string | null
    owner: string
    status: 'available' | 'reserved' | 'completed'
}

export interface AwardItem {
    id?: string
    title: string
    description?: string
    value: number
    family_id: string
    owner: string
    hidden?: boolean
}

export interface AwardRequest {
    id?: string
    award_id: string
    child_id: string
    status: string
}

export interface TaskItem {
    id?: string
    title: string
    description?: string
    award_value: number
    owner: string
    assignee: string
    date: string
    family_id: string
    status: string
    completed_by: string
    visability: string
}

export interface TaskRequest {
    id?: string
    child_id: string
    task_id: string
    status: string
}

export interface FamilyRequest {
    id?: string
    request_owner: User
    family_id: string
    request_to: string
    add_role: string
}
