import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { userSelectors } from '@/features/user/slice/user-slice'
import { WishlistItemCard } from '@/features/wishlist-item/wishlist-item'
import { WishlistItem } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

interface WishlistProps {}

export const WishlistPage: FC<WishlistProps> = ({}) => {
    {
        /*eslint-disable no-empty-pattern */
    }
    const user = useSelector(userSelectors.selectUser)
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>()
    const [itemTitle, setItemTitle] = useState('')
    const [itemDescription, setItemDescription] = useState('')

    useEffect(() => {
        localStorage.setItem('route', '/wishlist')
    }, [])

    const getWishlist = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist?owner=${user?.id}`)

            const jsonData: WishlistItem[] = await res.json()
            setWishlistItems(jsonData)
        } catch (e) {
            console.log(e)
        }
    }

    const addWishlistItem = async () => {
        try {
            const body = {
                owner: user?.id,
                title: itemTitle,
                description: itemDescription,
                is_done: false,
                reserved_by: '',
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`, {
                method: 'POST',
                body: JSON.stringify(body),
            })

            if (res.status === 200 || res.status === 201) {
                setItemDescription('')
                setItemTitle('')
                getWishlist()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const deleteWishlistItem = async (id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {
                method: 'DELETE',
            })

            if (res.status === 200 || res.status === 201) {
                getWishlist()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const reserveWishlistItem = async (id: string, reserveId: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    reserved_by: reserveId,
                }),
            })

            if (res.status === 200) {
                getWishlist()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const editWishlistItem = async (id: string, title: string, description: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title,
                    description,
                }),
            })

            if (res.status === 200) {
                getWishlist()
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getWishlist()
    }, [])

    return (
        <div className="container">
            <div className="text-[30px]">Список желаний</div>

            <Dialog>
                <DialogTrigger>
                    <Button className="mb-2">Добавить +</Button>
                </DialogTrigger>

                <DialogContent>
                    <Input onChange={(e) => setItemTitle(e.target.value)} placeholder="Название" />
                    <Textarea onChange={(e) => setItemDescription(e.target.value)} placeholder="Описание" />
                    <DialogClose>
                        <Button onClick={addWishlistItem}>Добавить</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col">
                {wishlistItems?.length ? (
                    wishlistItems.map((item) => {
                        return (
                            <WishlistItemCard
                                key={item.id}
                                {...item}
                                deleteItem={deleteWishlistItem}
                                reserveItem={reserveWishlistItem}
                                editItem={editWishlistItem}
                            />
                        )
                    })
                ) : (
                    <div>Список желаний пуст</div>
                )}
            </div>
        </div>
    )
}
