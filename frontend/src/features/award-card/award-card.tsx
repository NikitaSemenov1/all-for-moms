import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Pencil, X } from 'lucide-react'

import { AwardItem, AwardRequest } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

import { AwardRequestCard } from '../award-request'
import { userActions, userSelectors } from '../user/slice/user-slice'

import styles from './award-card.module.scss'

interface AwardCardProps extends AwardItem {
    deleteAward: (id: string) => void
    editAward: (id: string, title: string, value: number, description: string) => void
}

export const AwardCard: FC<AwardCardProps> = ({ title, description, value, owner, deleteAward, id, editAward }) => {
    const user = useSelector(userSelectors.selectUser)
    const isOwner = user?.id === owner
    const isParent = user?.role === 'parent'
    const [awardRequests, setAwardRequests] = useState<AwardRequest[]>([])

    const [editedTitle, setEditedTitle] = useState(title)
    const [editedValue, setEditedValue] = useState(value)
    const [editedDescription, setEditedDescriprion] = useState(description)

    const findRequest = awardRequests.find(({ child_id }) => child_id === user?.id)

    const isEnouthBalance = user?.award_balance ? user?.award_balance >= value : false
    const dispatch = useDispatch()

    const getAwardRequests = async () => {
        try {
            const res = await fetch(
                isParent
                    ? `${import.meta.env.VITE_API_URL}/award_requests?award_id=${id}`
                    : `${import.meta.env.VITE_API_URL}/award_requests?award_id=${id}&child_id=${user?.id}&status=send`,
            )
            const jsonData = await res.json()

            setAwardRequests(jsonData)
        } catch (e) {
            console.log(e)
        }
    }

    const sendAwardRequest = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/award_requests`, {
                method: 'POST',
                body: JSON.stringify({
                    child_id: user?.id,
                    award_id: id,
                    family_id: user?.family_id,
                    status: 'send',
                }),
            })

            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${user?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    award_balance: (user?.award_balance ?? 0) - value,
                    reserved_award_balance: (user?.reserved_award_balance ?? 0) + value,
                }),
            })

            const userJsonData = await userRes.json()

            dispatch(userActions.setUser(userJsonData))

            if ((res.status === 200 || res.status === 201) && userRes.status === 200) {
                getAwardRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const deleteAwardRequest = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/award_requests/${findRequest?.id}`, {
                method: 'DELETE',
            })

            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${user?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    award_balance: (user?.award_balance ?? 0) + value,
                    reserved_award_balance: (user?.reserved_award_balance ?? 0) - value,
                }),
            })

            const userJsonData = await userRes.json()

            dispatch(userActions.setUser(userJsonData))

            if (res.status === 200 && userRes.status === 200) {
                getAwardRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getAwardRequests()
    }, [])

    return (
        <div className={styles.card}>
            <div>
                <div className='text-xl font-bold'>{title}</div>
                {description && <div className='font-semibold'>{description}</div>}
                <div>Стоимость: {value}</div>
            </div>

            <div className="flex gap-3">
                {isParent ? (
                    <Dialog>
                        <DialogTrigger>
                            <Button>Посмотреть запросы на получение награды</Button>
                        </DialogTrigger>

                        <DialogContent className="w-[90%] h-[50vh] overflow-y-scroll">
                            <div>
                                {awardRequests.length ? (
                                    awardRequests.map((item) => {
                                        return (
                                            <AwardRequestCard
                                                key={item.id}
                                                {...item}
                                                title={title}
                                                description={description ?? ''}
                                                value={value}
                                                getAwardRequests={getAwardRequests}
                                            />
                                        )
                                    })
                                ) : (
                                    <div>Нет запросов</div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : isEnouthBalance || findRequest ? (
                    <Dialog>
                        <DialogTrigger>
                            <Button>{findRequest ? 'Отменить запрос' : 'Отправить запрос на получение'}</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>
                                {findRequest
                                    ? `Вы уверены, что хотите отменить запрос на получение награды ${title}`
                                    : `Вы уверены, что хотите отправить запрос на получение награды ${title}`}
                            </DialogTitle>

                            <div className="flex items-center justify-center gap-3">
                                <DialogClose>
                                    <Button
                                        onClick={() => (findRequest ? deleteAwardRequest() : sendAwardRequest())}
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
                ) : (
                    <></>
                )}

                {isOwner && (
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger>
                                <Pencil width={20} height={20} />
                            </DialogTrigger>

                            <DialogContent>
                                <DialogTitle>{`Редактирование ${title}`}</DialogTitle>

                                <Input defaultValue={title} onChange={(e) => setEditedTitle(e.target.value)} />
                                <Input
                                    type="number"
                                    defaultValue={value}
                                    onChange={(e) => setEditedValue(Number(e.target.value))}
                                />
                                <Textarea
                                    defaultValue={description}
                                    onChange={(e) => setEditedDescriprion(e.target.value)}
                                />
                                <DialogClose>
                                    <Button
                                        onClick={() =>
                                            editAward(id ?? '', editedTitle, editedValue, editedDescription ?? '')
                                        }
                                    >
                                        Сохранить
                                    </Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger>
                                <X />
                            </DialogTrigger>

                            <DialogContent>
                                <DialogTitle>{`Вы уверены, что хотите удалить ${title}`}</DialogTitle>

                                <div className="flex items-center justify-center gap-5">
                                    <DialogClose>
                                        <Button onClick={() => deleteAward(id ?? '')} variant={'accept'}>
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
        </div>
    )
}
