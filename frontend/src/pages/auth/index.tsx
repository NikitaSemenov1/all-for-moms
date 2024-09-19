import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { userActions } from '@/features/user/slice/user-slice'
import { User } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useToast } from '@/shared/ui/use-toast'

interface AuthPageProps {}

export const AuthPage: FC<AuthPageProps> = ({}) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passcheck, setPasscheck] = useState('')
    const [name, setName] = useState('')
    const { toast } = useToast()
    const dispatch = useDispatch()

    useEffect(() => {
        const access_token = localStorage.getItem('access_token')

        if (access_token) {
            navigate('/')
        }
    }, [])

    const onTabChange = () => {
        setEmail('')
        setPassword('')
        setPasscheck('')
        setName('')
    }

    const handleAuth = async () => {
        if (!email || !password) {
            toast({
                variant: 'destructive',
                title: 'Введите email и пароль',
            })
            return
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/all_users`)

            const jsonData: User[] = await res.json()

            const member = jsonData.find(({ email: memberEmail }) => memberEmail === email)

            const checkPassword = member?.password === password

            if (!member) {
                throw new Error('Пользователь с таким email не найден')
            } else if (!checkPassword) {
                throw new Error('Неверный пароль')
            } else {
                localStorage.setItem('access_token', String(member.id))
                dispatch(userActions.setUser(member))
                navigate('/')
                toast({
                    variant: 'success',
                    title: 'Успешно!',
                })
            }
        } catch (e) {
            toast({
                variant: 'destructive',
                title: (e as Error).message,
            })
        }
    }

    const handleRegister = async () => {
        try {
            if (!name || !email || !password || !passcheck) {
                toast({
                    variant: 'destructive',
                    title: 'Заполните все поля',
                })
                return
            }

            if (password !== passcheck) {
                toast({
                    variant: 'destructive',
                    title: 'Пароли не совпадают',
                })
                return
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/all_users`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            })

            const jsonData: User = await res.json()

            localStorage.setItem('access_token', jsonData.id)

            dispatch(userActions.setUser(jsonData))

            navigate('/')
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div className="container">
            <Tabs defaultValue="auth" onValueChange={onTabChange} className="max-w-[600px] mx-auto mt-10">
                <TabsList>
                    <TabsTrigger value="auth">Войти</TabsTrigger>
                    <TabsTrigger value="register">Регистрация</TabsTrigger>
                </TabsList>

                <TabsContent value="auth">
                    <label>
                        Email
                        <Input
                            className="mb-2"
                            placeholder="Введите почту"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        Пароль
                        <Input
                            type="password"
                            placeholder="Введите пароль"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <Button className="mt-3" onClick={handleAuth}>
                        Войти
                    </Button>
                </TabsContent>
                <TabsContent value="register">
                    <label>
                        Имя
                        <Input className="mb-2" placeholder="Введите имя" onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                        Email
                        <Input
                            className="mb-2"
                            placeholder="Введите почту"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        Пароль
                        <Input
                            className="mb-2"
                            type="password"
                            placeholder="Введите пароль"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <label>
                        Повторите пароль
                        <Input
                            type="password"
                            placeholder="Повторите пароль"
                            onChange={(e) => setPasscheck(e.target.value)}
                        />
                    </label>

                    <Button className="mt-3" onClick={handleRegister}>
                        Зарегистрироваться
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    )
}
