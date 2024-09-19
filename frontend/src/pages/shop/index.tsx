import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { ShopCard } from '@/features/shop-card'
import { userSelectors } from '@/features/user/slice/user-slice'
import { ShopItem } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Textarea } from '@/shared/ui/textarea'

interface ShopPageProps {}

const initialShopItemInfo: ShopItem = {
    title: '',
    description: '',
    priority: null,
    family_id: '',
    owner: '',
    reserved_by: '',
    status: 'available',
    completed_by: '',
}

export const ShopPage: FC<ShopPageProps> = ({}) => {
    const user = useSelector(userSelectors.selectUser)
    const [shopItems, setShopItems] = useState<ShopItem[]>([])
    const [createItemInfo, setCreateItemInfo] = useState<ShopItem>(initialShopItemInfo)

    useEffect(() => {
        localStorage.setItem('route', '/shop')
    }, [])

    const getShopList = async () => {
        if (!user?.family_id) return
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/shop?family_id=${user.family_id}`)

            const jsonData: ShopItem[] = await res.json()

            jsonData.sort((a, b) => Number(a.priority) - Number(b.priority))

            setShopItems(jsonData)
        } catch (e) {}
    }

    const addShopItem = async () => {
        try {
            const body = {
                ...createItemInfo,
                family_id: user?.family_id,
                owner: user?.id,
                priority: createItemInfo.priority ? createItemInfo.priority : '1',
                status: 'available',
            }

            await fetch(`${import.meta.env.VITE_API_URL}/shop`, {
                method: 'POST',
                body: JSON.stringify(body),
            })

            getShopList()
        } catch (e) {}
    }

    const deleteShopItem = async (id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${id}`, {
                method: 'DELETE',
            })

            if (res.status === 200) {
                getShopList()
            }
        } catch (e) {
            console.log(e)
        }
    }

    // const deleteAllCompleted = async () => {
    //     try {
    //         const res = await fetch(`${import.meta.env.VITE_API_URL}/shop?status=completed`, {
    //             method: 'DELETE',
    //         })

    //         if (res.status === 200) {
    //             getShopList()
    //         }
    //     } catch (e) {}
    // }

    const changeStatus = async (id: string, status: 'available' | 'reserved' | 'completed') => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status,
                    completed_by: status === 'completed' ? user?.id : null,
                    reserved_by: status === 'reserved' ? user?.id : null,
                }),
            })

            if (res.status === 200) {
                getShopList()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const editItem = async (id: string, body: ShopItem) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(body),
            })

            if (res.status === 200) {
                getShopList()
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getShopList()
    }, [user])

    const changePriority = (val: string) => {
        setCreateItemInfo((prev) => {
            return { ...prev, priority: val }
        })
    }
    // const changeAssignee = (val: string) => {
    //     setCreateItemInfo((prev) => {
    //         return { ...prev, assignee: val }
    //     })
    // }
    const changeTitle = (val: string) => {
        setCreateItemInfo((prev) => {
            return { ...prev, title: val }
        })
    }
    const changeDescription = (val: string) => {
        setCreateItemInfo((prev) => {
            return { ...prev, description: val }
        })
    }

    return (
        <div className="container">
            <div className="text-[25px]">Список покупок</div>

            <Dialog modal>
                <DialogTrigger>
                    <Button className="mb-2">Добавить товар +</Button>
                </DialogTrigger>

                <DialogContent>
                    {/* <Select onValueChange={changeAssignee}>
                        <SelectTrigger>
                            <SelectValue placeholder='Выберите кто купит'></SelectValue>
                        </SelectTrigger>
                        <SelectContent className='z-50'>
                            {family?.map(({ id, name }) => {
                                return <SelectItem value={id}>
                                    {name}
                                </SelectItem>
                            })}
                        </SelectContent>
                    </Select> */}

                    <Select onValueChange={changePriority}>
                        <SelectTrigger>
                            <SelectValue placeholder="Приоритет"></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-50">
                            <SelectItem value="0">Срочно</SelectItem>
                            <SelectItem value="1">Стандартно</SelectItem>
                            <SelectItem value="2">Не срочно</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input onChange={(e) => changeTitle(e.target.value)} placeholder="Что купить?" />
                    <Textarea onChange={(e) => changeDescription(e.target.value)} placeholder="Описание" />

                    <DialogClose>
                        <Button onClick={addShopItem}>Создать</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            <Tabs defaultValue="available">
                <TabsList>
                    <TabsTrigger value="available">Свободно</TabsTrigger>
                    <TabsTrigger value="reserved">Зарезервировано</TabsTrigger>
                    <TabsTrigger value="completed">Куплено</TabsTrigger>
                </TabsList>

                <TabsContent value="available">
                    <div>
                        {shopItems.length ? (
                            shopItems
                                .filter(({ status }) => status === 'available')
                                .map((item) => {
                                    return (
                                        <ShopCard
                                            key={item.id}
                                            {...item}
                                            deleteShopItem={deleteShopItem}
                                            changeStatus={changeStatus}
                                            editItem={editItem}
                                        />
                                    )
                                })
                        ) : (
                            <div>Список покупок пуст</div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="reserved">
                    <div>
                        {shopItems.length ? (
                            shopItems
                                .filter(({ status }) => status === 'reserved')
                                .map((item) => {
                                    return (
                                        <ShopCard
                                            key={item.id}
                                            {...item}
                                            deleteShopItem={deleteShopItem}
                                            changeStatus={changeStatus}
                                            editItem={editItem}
                                        />
                                    )
                                })
                        ) : (
                            <div>Список покупок пуст</div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="completed">
                    <div>
                        {shopItems.length ? (
                            shopItems
                                .filter(({ status }) => status === 'completed')
                                .sort((a, b) => Number(a.priority) - Number(b.priority))
                                .map((item) => {
                                    return (
                                        <ShopCard
                                            key={item.id}
                                            {...item}
                                            deleteShopItem={deleteShopItem}
                                            changeStatus={changeStatus}
                                            editItem={editItem}
                                        />
                                    )
                                })
                        ) : (
                            <div>Список покупок пуст</div>
                        )}
                    </div>
                    {/* <Button onClick={deleteAllCompleted}>
                        Удалить все выполненные
                    </Button> */}
                </TabsContent>
            </Tabs>
        </div>
    )
}
