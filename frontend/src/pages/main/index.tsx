import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import { familyActions, familySelectors } from '@/features/falimy/slice/family-slice'
import { MemberCard } from '@/features/member-card'
import { userActions, userSelectors } from '@/features/user/slice/user-slice'
import { Family, FamilyRequest, User } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { useToast } from '@/shared/ui/use-toast'

interface MainPageProps {}

export const MainPage: FC<MainPageProps> = ({}) => {
    const family = useSelector(familySelectors.selectFamily)
    const dispatch = useDispatch()
    const user = useSelector(userSelectors.selectUser)
    const { toast } = useToast()

    const [familyRequestsToUser, setFamilyRequestsToUser] = useState<FamilyRequest[]>([])
    const [familyRequestsFromUser, setFamilyRequestsFromUser] = useState<FamilyRequest[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [memberId, setMemberId] = useState('')
    const [memberRole, setMemberRole] = useState('child')

    useEffect(() => {
        localStorage.setItem('route', '/')
    }, [])

    const getFamily = async () => {
        try {
            if (!user) return
            const res = await fetch(`${import.meta.env.VITE_API_URL}/familys/${user?.family_id}`)
            const all_users = await fetch(`${import.meta.env.VITE_API_URL}/all_users`)

            const jsonData: Family = await res.json()

            const jsonAllUsers: User[] = await all_users.json()

            const family: (User | undefined)[] = jsonData.members.map((id) => {
                return jsonAllUsers.find(({ id: userId }) => userId === id)
            })

            dispatch(familyActions.setFamily(family as User[]))
        } catch (e) {
            console.log(e)
        }
    }

    const createFamily = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/familys`, {
                method: 'POST',
                body: JSON.stringify({
                    owner: user?.id,
                    members: [user?.id],
                }),
            })

            const jsonData: Family = await res.json()

            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${user?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    family_id: jsonData.id,
                    role: 'parent',
                }),
            })

            const userJson = await userRes.json()

            dispatch(userActions.setUser(userJson))

            getFamily()
        } catch (e) {
            console.log(e)
        }
    }

    const deleteFamily = async () => {
        try {
            family?.forEach(async ({ id }) => {
                if (id !== user?.id) {
                    await fetch(`${import.meta.env.VITE_API_URL}/all_users/${user?.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            family_id: null,
                            role: null,
                        }),
                    })
                }
            })

            await fetch(`${import.meta.env.VITE_API_URL}/familys/${user?.family_id}`, {
                method: 'DELETE',
            })

            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${user?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    family_id: null,
                    role: null,
                }),
            })

            const jsonUser = await userRes.json()

            dispatch(userActions.setUser(jsonUser))
            dispatch(familyActions.setFamily([]))
        } catch (e) {
            console.log(e)
        }
    }

    const addMember = async () => {
        if (!memberId || !memberRole) {
            toast({
                variant: 'destructive',
                title: 'Выберите кого добавить',
            })
            return
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/family_requests`, {
                method: 'POST',
                body: JSON.stringify({
                    request_owner: user,
                    family_id: user?.family_id,
                    request_to: memberId,
                    add_role: memberRole,
                }),
            })

            if (res.status === 200 || res.status === 201) {
                getFamilyRequestsFromUser()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getFamilyRequestsToUser = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/family_requests?request_to=${user?.id}`)

            const jsonData = await res.json()

            setFamilyRequestsToUser(jsonData)
        } catch (e) {
            console.log(e)
        }
    }

    const getFamilyRequestsFromUser = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/family_requests?family_id=${user?.family_id}`)

            const jsonData = await res.json()

            setFamilyRequestsFromUser(jsonData)
        } catch (e) {
            console.log(e)
        }
    }

    const deleteFamilyRequest = async (id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/family_requests/${id}`, {
                method: 'DELETE',
            })

            if (res.status === 200) {
                getFamilyRequestsFromUser()
                getFamilyRequestsToUser()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const acceptFamilyRequest = async (request_id: string, family_id: string, add_role: string) => {
        try {
            const familyRes = await fetch(`${import.meta.env.VITE_API_URL}/familys/${family_id}`)

            const familyJson = await familyRes.json()

            await fetch(`${import.meta.env.VITE_API_URL}/familys/${family_id}`, {
                method: 'PATCH',
                body: JSON.stringify({ ...familyJson, members: [...familyJson.members, user?.id] }),
            })

            const updateUser = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${user?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    family_id: family_id,
                    role: add_role,
                }),
            })

            // const updatedFamilyJson = await updateFamily.json();
            const updatedUserJson = await updateUser.json()

            deleteFamilyRequest(request_id)

            getFamily()
            dispatch(userActions.setUser(updatedUserJson))
        } catch (e) {
            console.log(e)
        }
    }

    const getAllUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/all_users`)
            const jsonData: User[] = await res.json()

            const withoutFamily = jsonData.filter(({ family_id }) => !family_id)

            setAllUsers(withoutFamily)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (user?.family_id) {
            getFamily()
            getAllUsers()
            getFamilyRequestsFromUser()
        } else {
            getFamilyRequestsToUser()
        }
    }, [user])

    return (
        <div>
            <div className="container">
                <div className='text-[30px]'>Семья</div>
                {family &&
                    family.map((item) => {
                        if (!item) return
                        return <MemberCard key={item.id} {...item} is_user={item.id === user?.id} />
                    })}

                {user?.family_id && user.role === 'parent' && (
                    <div>
                        <Dialog>
                            <DialogTrigger>
                                <Button className="mt-3">Добавить члена семьи</Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogTitle>Добавление члена семьи</DialogTitle>

                                <Select onValueChange={(e) => setMemberId(e)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'Выберите из списка'}></SelectValue>
                                    </SelectTrigger>

                                    <SelectContent className="z-50">
                                        {allUsers.map(({ name, email, id }) => {
                                            return (
                                                <SelectItem key={id} value={id}>
                                                    {name + '---' + email}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>

                                <RadioGroup
                                    onValueChange={(e) => setMemberRole(e)}
                                    defaultValue={memberRole}
                                    className="items-start justify-start"
                                >
                                    <label className="flex justify-start items-center">
                                        <RadioGroupItem className="mr-1" value="parent" />
                                        Родитель
                                    </label>
                                    <label className="flex justify-start items-center">
                                        <RadioGroupItem className="mr-1" value="child" />
                                        Ребенок
                                    </label>
                                </RadioGroup>

                                <DialogClose>
                                    <Button onClick={addMember}>Добавить</Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger>
                                <Button className="ml-2">Удалить семью</Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogTitle>Вы уверены, что хотите удалить семью?</DialogTitle>

                                <div className="flex gap-5 items-center justify-center">
                                    <DialogClose>
                                        <Button onClick={deleteFamily} variant={'accept'}>
                                            Да
                                        </Button>
                                    </DialogClose>
                                    <DialogClose>
                                        <Button variant={'destructive'}>Отмена</Button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {user?.family_id && (
                    <div>
                        <div className="text-[30px]">Приглашения в семью</div>
                        <div>
                            {familyRequestsFromUser.length ? (
                                familyRequestsFromUser.map(({ request_to, id, add_role }) => {
                                    const userRquested = allUsers.find(({ id }) => id === request_to)
                                    return (
                                        <div className="card" key={request_to}>
                                            <div>
                                                <div>
                                                    {userRquested?.name} --- {userRquested?.email}
                                                </div>
                                                <div>{add_role === 'parent' ? 'Родитель' : 'Ребенок'}</div>
                                            </div>

                                            <Button onClick={() => deleteFamilyRequest(id ?? '')}>
                                                Отменить приглашение
                                            </Button>
                                        </div>
                                    )
                                })
                            ) : (
                                <>Вы не отправляли приглашений</>
                            )}
                        </div>
                    </div>
                )}

                {!user?.family_id && (
                    <div>
                        <div>
                            <div className="text-[30px]">Приглашения в семью</div>

                            <div>
                                {familyRequestsToUser.length ? (
                                    familyRequestsToUser.map(({ request_owner, add_role, id, family_id }) => {
                                        return (
                                            <div className="card" key={request_owner.id}>
                                                <div>
                                                    <div>
                                                        Приглашение от: {request_owner?.name} --- {request_owner?.email}
                                                    </div>
                                                    <div>
                                                        Ваша роль в семье:
                                                        {add_role === 'parent' ? 'Родитель' : 'Ребенок'}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <Button variant={'accept'}>Принять</Button>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogTitle>
                                                                Вы уверены, что хотите принять приглашение?
                                                            </DialogTitle>

                                                            <div className="flex justify-center gap-4">
                                                                <DialogClose>
                                                                    <Button
                                                                        onClick={() =>
                                                                            acceptFamilyRequest(
                                                                                id ?? '',
                                                                                family_id,
                                                                                add_role,
                                                                            )
                                                                        }
                                                                        variant={'accept'}
                                                                    >
                                                                        Да
                                                                    </Button>
                                                                </DialogClose>

                                                                <DialogClose>
                                                                    <Button variant={'destructive'}>Отмена</Button>
                                                                </DialogClose>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <Button variant={'destructive'}>Отклонить</Button>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogTitle>
                                                                Вы уверены, что хотите отклонить приглашение?
                                                            </DialogTitle>

                                                            <div className="flex justify-center gap-4">
                                                                <DialogClose>
                                                                    <Button
                                                                        onClick={() => deleteFamilyRequest(id ?? '')}
                                                                        variant={'accept'}
                                                                    >
                                                                        Да
                                                                    </Button>
                                                                </DialogClose>

                                                                <DialogClose>
                                                                    <Button variant={'destructive'}>Отмена</Button>
                                                                </DialogClose>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div>Приглашений пока нет...</div>
                                )}
                            </div>
                        </div>

                        <Button className="mt-2" onClick={createFamily}>
                            Создать семью
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
