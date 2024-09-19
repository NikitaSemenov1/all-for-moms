import { FC } from 'react'
import { useSelector } from 'react-redux'

import { TaskRequest } from '@/shared/types/types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

import { familySelectors } from '../falimy/slice/family-slice'

import styles from './task-request.module.scss'

interface TaskRequestProps extends TaskRequest {
    award_value: number
    getTaskRequests: () => void
}

export const TaskRequestCard: FC<TaskRequestProps> = ({
    child_id,
    task_id,
    status,
    id,
    award_value,
    getTaskRequests,
}) => {
    const family = useSelector(familySelectors.selectFamily)
    const child = family?.find(({ id }) => id === child_id)

    const submitRequest = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks_requests/${id}`, {
                method: 'DELETE',
            })

            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/all_users/${child_id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    award_balance: Number(child?.award_balance ?? 0) + award_value,
                }),
            })

            const taskRes = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${task_id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: 'done',
                    completed_by: child_id,
                }),
            })

            if (res.status === 200 && userRes.status === 200 && taskRes.status === 200) {
                getTaskRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const rejectRequest = async () => {
        try {
            // const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks_requests/${id}`, {
            //     method: "PATCH",
            //     body: JSON.stringify({
            //         status: 'reject'
            //     })
            // })

            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks_requests/${id}`, {
                method: 'DELETE',
                // body: JSON.stringify({
                //     status: 'reject'
                // })
            })

            if (res.status === 200) {
                getTaskRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={styles.card_req}>
            <div className="mr-2">Пользователь отметил задачу выполненой:</div>

            {status === 'send' && (
                <div className="flex gap-2">
                    <Button onClick={submitRequest}>Подтвердить</Button>
                    <Button onClick={rejectRequest}>Отклонить</Button>
                </div>
            )}

            {status === 'submit' && <Badge variant={'approve'}>Подтверждено</Badge>}
            {status === 'reject' && <Badge variant={'destructive'}>Отклонено</Badge>}
        </div>
    )
}
