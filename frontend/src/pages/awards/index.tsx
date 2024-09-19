import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { AwardCard } from '@/features/award-card'
import { userSelectors } from '@/features/user/slice/user-slice'
import { AwardItem, AwardRequest } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { familySelectors } from '@/features/falimy/slice/family-slice'
import { Badge } from '@/shared/ui/badge'

interface AwardsPageProps { }

export const AwardsPage: FC<AwardsPageProps> = ({ }) => {
    const user = useSelector(userSelectors.selectUser)
    const family = useSelector(familySelectors.selectFamily)
    const [awards, setAwards] = useState<AwardItem[]>([])
    const [awardTitle, setAwardTitle] = useState('')
    const [awardValue, setAwardValue] = useState(0)
    const [awardDescription, setAwardDescription] = useState('')
    const [awardRequests, setAwardRequests] = useState<AwardRequest[]>([])

    useEffect(() => {
        localStorage.setItem('route', '/awards')
    }, [])

    const getAwards = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/awards?family_id=${user?.family_id}`)

            const jsonData: AwardItem[] = await res.json()

            const filteredData = jsonData.filter(({ hidden }) => !hidden)

            setAwards(filteredData)
        } catch (e) {
            console.log(e)
        }
    }

    const getAwardRequests = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/award_requests?family_id=${user?.family_id}&status=accept`);
            const jsonData: AwardRequest[] = await res.json()
            // const awardId = jsonData.award_id;

            // const awardRes = await fetch(`${import.meta.env.VITE_API_URL}/awards?id=${awardId}`)

            setAwardRequests(jsonData)
        } catch (e) {
            console.log(e)
        }
    }

    const addAward = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/awards`, {
                method: 'POST',
                body: JSON.stringify({
                    title: awardTitle,
                    description: awardDescription,
                    value: awardValue,
                    family_id: user?.family_id,
                    owner: user?.id,
                }),
            })

            if (res.status === 200 || res.status === 201) {
                getAwards()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const deleteAward = async (id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/awards/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    hidden: true
                })
            })

            if (res.status === 200) {
                getAwards()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const editAward = async (id: string, title: string, value: number, description: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/awards/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title,
                    description,
                    value,
                }),
            })

            if (res.status === 200) {
                getAwards()
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getAwards()
        getAwardRequests()
    }, [])

    return (
        <div className="container">
            <div className="text-[30px] mb-5">Таблица наград</div>

            {user?.role === 'parent' && (
                <Dialog>
                    <DialogTrigger>
                        <Button className="mb-2">Создать награду +</Button>
                    </DialogTrigger>

                    <DialogContent>
                        <Input onChange={(e) => setAwardTitle(e.target.value)} placeholder="Название" />
                        <Input
                            onChange={(e) => setAwardValue(Number(e.target.value))}
                            placeholder="Стоимость"
                            type="number"
                        />
                        <Textarea onChange={(e) => setAwardDescription(e.target.value)} placeholder="Описание" />

                        <DialogClose>
                            <Button onClick={addAward}>Сохранить</Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            )}

            <div>
                {awards.length ? (
                    awards.map((item) => {
                        return <AwardCard key={item.id} {...item} deleteAward={deleteAward} editAward={editAward} />
                    })
                ) : (
                    <div>Список наград пуст</div>
                )}

                {
                    awardRequests.length
                        ?
                        <div>
                            <div className='text-2xl mb-2'>Список получения наград</div>
                            {awardRequests.map(({ award_id, child_id, id }) => {
                                const findedAward = awards.find(({ id }) => id === award_id);
                                const child = family?.find(({ id }) => child_id === id)
                                if (!findedAward) return;

                                return <div key={id} className='card flex justify-between'>
                                    <div>
                                        <div className='text-xl font-bold'>{findedAward.title}</div>
                                        {child && <div>Получил(-а): {child.name}</div>}
                                    </div>

                                    <Badge variant={'approve'} className='h-fit'>
                                        Получено
                                    </Badge>
                                </div>
                            })}
                        </div>
                        :
                        <></>
                }
            </div>
        </div>
    )
}
