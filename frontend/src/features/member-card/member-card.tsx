import { FC, useEffect, useState } from 'react'

import { User, WishlistItem } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'

import { WishlistItemCard } from '../wishlist-item/wishlist-item'

import styles from './member-card.module.scss'

interface MemberCardProps extends User {
    is_user: boolean
}

export const MemberCard: FC<MemberCardProps> = ({ name, role, is_user, id, award_balance, reserved_award_balance }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])

    const getUserWishlist = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist?owner=${id}`)

            const jsonData = await res.json()

            setWishlist(jsonData)
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
                getUserWishlist()
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getUserWishlist()
    }, [])
    return (
        <div className={styles.card}>
            <div>
                <div className='text-xl font-bold'>{is_user ? `${name} (Вы)` : name}</div>
                <div className='text-lg font-medium'>{role === 'parent' ? 'Родитель' : 'Ребенок'}</div>
                {role !== 'parent' && <div>Баланс: {award_balance ?? 0}</div>}
                {/* {role !== 'parent' && <div>На рассмотрении: {reserved_award_balance ?? 0}</div>} */}
            </div>

            {!is_user && (
                <Dialog>
                    <DialogTrigger>
                        <Button>Открыть список желаний</Button>
                    </DialogTrigger>

                    <DialogContent className="w-[90%] h-[50vh] overflow-y-scroll">
                        <DialogTitle>{`Список желаний ${name}`}</DialogTitle>

                        <div>
                            {wishlist.length ? (
                                wishlist.map((item) => {
                                    return (
                                        <WishlistItemCard key={item.id} {...item} reserveItem={reserveWishlistItem} />
                                    )
                                })
                            ) : (
                                <div>Список желаний пуст</div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
