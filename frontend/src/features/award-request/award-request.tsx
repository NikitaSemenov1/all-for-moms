import { FC } from 'react'
import { useSelector } from 'react-redux'

import { AwardRequest } from '@/shared/types/types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

import { familySelectors } from '../falimy/slice/family-slice'

import styles from './award-request.module.scss'

interface AwardRequestProps extends AwardRequest {
    title: string
    description: string
    value: number
    getAwardRequests: () => void
}

export const AwardRequestCard: FC<AwardRequestProps> = ({ child_id, status, id, value, getAwardRequests }) => {
    const family = useSelector(familySelectors.selectFamily)
    const childRequested = family?.find(({ id }) => id === child_id)

    const acceptRequest = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/award_requests/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: 'accept',
                }),
            })

            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${childRequested?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    reserved_award_balance: (childRequested?.reserved_award_balance ?? 0) - value,
                }),
            })

            if (res.status === 200 && userRes.status === 200) {
                getAwardRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const rejectRequest = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/award_requests/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: 'reject',
                }),
            })

            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${childRequested?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    reserved_award_balance: (childRequested?.reserved_award_balance ?? 0) - value,
                    award_balance: (childRequested?.award_balance ?? 0) + value,
                }),
            })

            if (res.status === 200 && userRes.status === 200) {
                getAwardRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={styles.card}>
            <div>Запрос от: {childRequested?.name}</div>

            {status === 'send' && (
                <div className="ml-auto flex gap-5">
                    <Button onClick={acceptRequest}>Подтвердить</Button>
                    <Button onClick={rejectRequest}>Отклонить</Button>
                </div>
            )}
            {status === 'accept' && (
                <Badge className="ml-auto" variant={'approve'}>
                    Подтверждено
                </Badge>
            )}
            {status === 'reject' && (
                <Badge className="ml-auto" variant={'destructive'}>
                    Отклонено
                </Badge>
            )}
        </div>
    )
}
