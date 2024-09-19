import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { Toaster } from '@/shared/ui/toaster.tsx'

import { familyActions } from './features/falimy/slice/family-slice'
import { userActions, userSelectors } from './features/user/slice/user-slice'
import { AuthPage } from './pages/auth'
import { AwardsPage } from './pages/awards'
import { DiaryPage } from './pages/diary'
import { MainPage } from './pages/main'
import { ShopPage } from './pages/shop'
import { TasksPage } from './pages/tasks'
import { WishlistPage } from './pages/wishlist'
import { Layout } from './shared/providers/layout'
import { User } from './shared/types/types'

export const App = () => {
    const navigate = useNavigate()
    const access_token = localStorage.getItem('access_token')
    const dispatch = useDispatch()
    const user = useSelector(userSelectors.selectUser)
    const [familyId, setFamilyId] = useState('')

    const getUser = async (user_id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${user_id}`)

            const jsonData: User = await res.json()

            if (!familyId) {
                setFamilyId(jsonData.family_id)
            }
            dispatch(userActions.setUser(jsonData))
        } catch (e) {
            console.log(e)
        }
    }

    const getFamily = async () => {
        try {
            if (!user?.family_id) return
            const res = await fetch(`${import.meta.env.VITE_API_URL}/all_users?family_id=${user?.family_id}`)

            const jsonData = await res.json()

            dispatch(familyActions.setFamily(jsonData))
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!access_token) {
            navigate('/auth')
        } else {
            const route = localStorage.getItem('route')
            getUser(access_token)
            getFamily()
            if (route) {
                navigate(route)
            } else {
                navigate('/')
            }
        }
    }, [familyId])

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<MainPage />} />

                {user?.family_id && (
                    <>
                        <Route path="/diary" element={<DiaryPage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/awards" element={<AwardsPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                    </>
                )}
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
            <Toaster />
        </Layout>
    )
}
