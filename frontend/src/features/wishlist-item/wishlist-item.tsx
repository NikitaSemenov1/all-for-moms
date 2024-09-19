import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { Pencil, X } from 'lucide-react'

import { WishlistItem } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

import { familySelectors } from '../falimy/slice/family-slice'
import { userSelectors } from '../user/slice/user-slice'

import styles from './wishlist-item.module.scss'

interface WishlistItemProps extends WishlistItem {
    deleteItem?: (id: string) => void
    reserveItem: (id: string, reserveId: string) => void
    editItem?: (id: string, title: string, description: string) => void
}

export const WishlistItemCard: FC<WishlistItemProps> = ({
    title,
    description,
    deleteItem,
    id,
    owner,
    reserved_by,
    reserveItem,
    editItem,
}) => {
    const user = useSelector(userSelectors.selectUser)
    const reservedBy = useSelector(familySelectors.selectFamily)?.find(({ id }) => id === reserved_by)
    const isUserReserved = reserved_by === user?.id
    const editable = owner === user?.id

    const [editedTitle, setEditedTitle] = useState(title)
    const [editedDescription, setEditedDescription] = useState(description ?? '')

    const handleAccept = () => {
        if (!reserved_by) {
            return reserveItem(id, user?.id ?? '')
        } else if (isUserReserved) {
            return reserveItem(id, '')
        }
    }

    return (
        <div className={styles.card}>
            <div className="flex flex-col justify-start items-start">
                <div className='text-xl font-bold'>{title}</div>
                {description && <div>{description}</div>}
                {/* {reservedBy && <div>Зарезервировал(-а): {reservedBy.name}</div>} */}
                {reservedBy && <div>Зарезервировано</div>}
            </div>

            {!editable && (!reserved_by || isUserReserved) && (
                <Dialog>
                    <DialogTrigger>
                        <Button>{isUserReserved ? 'Отправить в свободные' : 'Зарезервировать'}</Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>
                            {isUserReserved
                                ? `Вы уверены, что хотите отправить в свободные ${title}`
                                : `Вы уверены, что хотите зарезервировать ${title}?`}
                        </DialogTitle>

                        <div className="flex gap-5 justify-center">
                            <DialogClose>
                                <Button onClick={handleAccept} variant={'accept'}>
                                    Да
                                </Button>
                            </DialogClose>

                            <DialogClose>
                                <Button variant={'destructive'}>Отмена</Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {editable && (
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger>
                            <Pencil width={20} height={20} />
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Редактирование элемента списка желаний</DialogTitle>

                            <div>
                                <Input
                                    className="mb-2"
                                    defaultValue={title}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <Textarea
                                    className="mb-2"
                                    defaultValue={description}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                />

                                <DialogClose>
                                    <Button onClick={() => editItem && editItem(id, editedTitle, editedDescription)}>
                                        Сохранить
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger>
                            <X />
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>{`Вы уверены, что хотите удалить ${title} из списка желаний?`}</DialogTitle>

                            <div className="flex gap-5 justify-center">
                                <DialogClose>
                                    <Button onClick={() => deleteItem && deleteItem(id)} variant={'accept'}>
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
        </div>
    )
}
