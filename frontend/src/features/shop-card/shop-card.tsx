import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { Pencil, X } from 'lucide-react'

import { ShopItem } from '@/shared/types/types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'

import { familySelectors } from '../falimy/slice/family-slice'
import { userSelectors } from '../user/slice/user-slice'

import styles from './shop-card.module.scss'

interface ShopCardProps extends ShopItem {
    deleteShopItem: (id: string) => void
    changeStatus: (id: string, status: 'available' | 'reserved' | 'completed') => void
    editItem: (id: string, body: ShopItem) => void
}

export const ShopCard: FC<ShopCardProps> = ({
    title,
    description,
    owner,
    status,
    priority,
    reserved_by,
    id,
    completed_by,
    family_id,
    deleteShopItem,
    changeStatus,
    editItem,
}) => {
    const user = useSelector(userSelectors.selectUser)
    const editable = owner === user?.id
    const ownerInfo = useSelector(familySelectors.selectFamily)?.find(({ id }) => id === owner)
    const reservedBy = useSelector(familySelectors.selectFamily)?.find(({ id }) => id === reserved_by)
    const completedBy = useSelector(familySelectors.selectFamily)?.find(({ id }) => id === completed_by)

    const isUserReserved = reserved_by === user?.id
    const isCompletedByUser = completed_by === user?.id

    const [editItemInfo, setEditItemInfo] = useState<ShopItem>({
        title,
        description,
        priority,
        family_id,
        owner,
        reserved_by,
        status,
        completed_by,
    })

    const getPrioriy = () => {
        switch (priority) {
            case '0':
                return <Badge variant={'destructive'}>Срочно</Badge>
            case '1':
                return <Badge variant={'default'}>Стандартно</Badge>
            case '2':
                return <Badge variant={'approve'}>Не срочно</Badge>
        }
    }

    const getStatusForCheckbox = (): 'available' | 'reserved' | 'completed' => {
        if (status === 'completed' && reserved_by) {
            return 'reserved'
        } else if (status === 'completed' && !reserved_by) {
            return 'available'
        } else if (status === 'reserved' || status === 'available') {
            return 'completed'
        }

        return 'available'
    }

    const changePriority = (val: string) => {
        setEditItemInfo((prev) => {
            return { ...prev, priority: val }
        })
    }
    const changeTitle = (val: string) => {
        setEditItemInfo((prev) => {
            return { ...prev, title: val }
        })
    }
    const changeDescription = (val: string) => {
        setEditItemInfo((prev) => {
            return { ...prev, description: val }
        })
    }

    return (
        <div className={styles.card}>
            {(isUserReserved || isCompletedByUser) && (
                <Checkbox
                    onClick={() => changeStatus(id ?? '', getStatusForCheckbox())}
                    defaultChecked={status === 'completed'}
                    className="mt-[5px]"
                />
            )}
            <div>
                <div className='text-xl font-bold'>{title}</div>
                <div className='font-semibold'>{description}</div>
                <div>Создал(-a): {ownerInfo?.name}</div>
                {reservedBy && !(status === 'completed') && <div>Зарезервировал(-а):{reservedBy.name}</div>}
                {completedBy && <div>Купил(-а): {completedBy.name}</div>}
            </div>

            <div className="ml-auto">{getPrioriy()}</div>

            {status === 'available' && (
                <Button onClick={() => changeStatus(id ?? '', 'reserved')}>Зарезервировать</Button>
            )}

            {status === 'reserved' && reserved_by === user?.id && (
                <Button onClick={() => changeStatus(id ?? '', 'available')}>Отправить в свободные</Button>
            )}

            {editable && (
                <div>
                    <Dialog modal>
                        <DialogTrigger>
                            <Pencil />
                        </DialogTrigger>

                        <DialogContent>
                            <Select defaultValue={priority ?? ''} onValueChange={changePriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Приоритет"></SelectValue>
                                </SelectTrigger>
                                <SelectContent className="z-50">
                                    <SelectItem value="0">Срочно</SelectItem>
                                    <SelectItem value="1">Стандартно</SelectItem>
                                    <SelectItem value="2">Не срочно</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                defaultValue={title}
                                onChange={(e) => changeTitle(e.target.value)}
                                placeholder="Что купить?"
                            />
                            <Textarea
                                defaultValue={description}
                                onChange={(e) => changeDescription(e.target.value)}
                                placeholder="Описание"
                            />

                            <DialogClose>
                                <Button onClick={() => editItem(id ?? '', editItemInfo)}>Сохранить</Button>
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger>
                            <X />
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>{`Вы уверены, что хотите удалить ${title} из списка покупок?`}</DialogTitle>

                            <div className="flex items-center justify-center gap-5">
                                <DialogClose>
                                    <Button onClick={() => deleteShopItem(id ?? '')} variant={'accept'}>
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
