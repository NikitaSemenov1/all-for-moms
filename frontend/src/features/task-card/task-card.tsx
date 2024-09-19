import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Check, Loader, Pencil, X } from 'lucide-react'

import { TaskItem, TaskRequest } from '@/shared/types/types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

import { familySelectors } from '../falimy/slice/family-slice'
import { TaskRequestCard } from '../task-request'
import { userSelectors } from '../user/slice/user-slice'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import styles from './task-card.module.scss'
import dayjs from 'dayjs'
import ruLocale from 'dayjs/locale/ru'

interface TaskCardProps extends TaskItem {
    deleteTask: (id: string) => void
    editTask: (id: string, title: string, description: string, award: number, assignee: string, date: string) => void
    sendTaskOnSubmit: (task_id: string, child_id: string) => void
    getTasks: () => void
}


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const TaskCard: FC<TaskCardProps> = ({
    title,
    description,
    award_value,
    owner,
    deleteTask,
    id,
    editTask,
    assignee,
    status,
    completed_by,
    getTasks,
    date
}) => {
    const user = useSelector(userSelectors.selectUser)
    const family = useSelector(familySelectors.selectFamily)
    const editable = user?.id === owner
    const isParent = user?.role === 'parent'
    const isUserAssignee = assignee === (user?.id ?? '')

    const assigneeItem = family?.find(({ id }) => id === assignee)

    const [startDate, setStartDate] = useState<Value>(date ? new Date(date) : null);

    const [editedAssignee, setEditedAssignee] = useState(assignee)
    // setEditedAssignee(assignee)
    const [editedTitle, setEditedTitle] = useState(title)
    const [editedDescription, setEditedDescription] = useState(description)
    const [editedAward, setEditedAward] = useState(award_value)

    const [taskRequests, setTaskRequests] = useState<TaskRequest[]>([])

    const completedBy = family?.find(({ id }) => completed_by === id)

    const isInRequests = taskRequests.find(({ task_id, child_id }) => task_id === id && child_id === user?.id)

    // const handleChangeAssignee = (id: string) => {
    //     if (editedAssignee.includes(id)) {
    //         // setEditedAssignee((prev) => [...prev.filter(item => item !== id)])
    //     } else {
    //         // setEditedAssignee((prev) => [...prev, id])
    //     }
    // }

    const getTaskRequests = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks_requests?task_id=${id}`)

            const jsonData = await res.json()

            setTaskRequests(jsonData)
            getTasks()
        } catch (e) {
            console.log(e)
        }
    }

    const createTaskRequest = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks_requests`, {
                method: 'POST',
                body: JSON.stringify({
                    child_id: user?.id,
                    task_id: id,
                    status: 'send',
                }),
            })

            if (res.status === 200 || res.status === 201) {
                getTaskRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const deleteTaskRequest = async (id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks_requests/${id}`, {
                method: 'DELETE',
            })

            if (res.status === 200) {
                getTaskRequests()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const completeTask = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    completed_by: user?.id,
                    status: 'done',
                }),
            })

            if (res.status === 200) {
                getTasks()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleSubmit = () => {
        const isInRequests = taskRequests.find(({ task_id, child_id }) => task_id === id && child_id === user?.id)
        if ((isParent && status === 'in_progress') || owner === user?.id) {
            completeTask()
        } else if (!isParent && !isInRequests) {
            createTaskRequest()
        } else if (!isParent && isInRequests) {
            deleteTaskRequest(isInRequests.id ?? '')
        }
    }

    const getTitleText = () => {
        const isInRequests = taskRequests.find(({ task_id, child_id }) => task_id === id && child_id === user?.id)
        if ((isParent && status === 'in_progress') || owner === user?.id) {
            return 'Отметить задачу выполненной?'
        } else if (!isParent && !isInRequests) {
            return 'Отправить задачу на подтверждение выполнения?'
        } else if (!isParent && isInRequests) {
            return 'Отменить отправку на подтверждение?'
        }
    }

    const getButtonVariant = () => {
        const isInRequests = taskRequests.find(({ task_id, child_id }) => task_id === id && child_id === user?.id)
        if (isInRequests) {
            return 'default'
        } else if (!isInRequests && status === 'in_progress') {
            return 'accept'
        }
        // else {
        //     return 'destructive'
        // }
    }

    const getButtonIcon = () => {
        const isInRequests = taskRequests.find(({ task_id, child_id }) => task_id === id && child_id === user?.id)
        if (isInRequests) {
            return <Loader />
        } else if (!isInRequests && status === 'in_progress') {
            return <Check />
        }
        // else {
        //     return <X />
        // }
    }

    const getStatusBadge = () => {
        if (isInRequests) {
            return <Badge variant={'approve'}>Задача на подтверждении</Badge>
        } else if (!isInRequests && status === 'in_progress') {
            return <Badge variant={'pro'}>В процессе</Badge>
        } else {
            return <Badge variant={'destructive'}>Выполнена</Badge>
        }
    }

    useEffect(() => {
        getTaskRequests()
    }, [])

    return (
        <div className={styles.card}>
            <div className="flex items-start gap-5">
                {isUserAssignee && status !== 'done' && (
                    <Dialog>
                        <DialogTrigger>
                            <Button variant={getButtonVariant()}>{getButtonIcon()}</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>{getTitleText()}</DialogTitle>

                            <div className="flex items-center justify-center gap-5">
                                <DialogClose>
                                    <Button variant={'accept'} onClick={handleSubmit}>
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
                <div>
                    {date && <div className='font-semibold text-xl'>{dayjs(date).locale(ruLocale).format('DD MMMM YYYY')}</div>}
                    <div className='font-bold text-lg'>{title}</div>
                    <div>{description}</div>
                    {!(assigneeItem?.role === 'parent') && !!Number(award_value) && <div>Награда: {award_value}</div>}
                    {!completedBy && assignee && <div>Назначено на:</div>}
                    {!completedBy && assigneeItem?.name}

                    {completedBy && <div>Задачу выполнил(-а): {completedBy.name}</div>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {getStatusBadge()}

                {editable && (
                    <div className="flex items-center gap-2">
                        {isParent && !isUserAssignee && !completedBy && (
                            <>
                                {taskRequests.map((item) => {
                                    const child = family?.find(({ id }) => item.child_id === id)
                                    if (child) {
                                        return (
                                            <TaskRequestCard
                                                key={item.id}
                                                {...item}
                                                award_value={award_value}
                                                getTaskRequests={getTaskRequests}
                                            />
                                        )
                                    }
                                })}
                            </>
                        )}

                        {status !== 'done' && (
                            <Dialog>
                                <DialogTrigger>
                                    <Pencil width={20} height={20} />
                                </DialogTrigger>

                                <DialogContent>
                                    {/* <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {family?.map(({ id, name }) => {
                                                    return <CommandItem key={id} onSelect={() => handleChangeAssignee(id)} value={id}>
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                editedAssignee.includes(id)
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {name}</CommandItem>
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command> */}
                                    <Input onChange={(e) => setEditedTitle(e.target.value)} defaultValue={title} />
                                    <Input
                                        onChange={(e) => setEditedAward(Number(e.target.value))}
                                        defaultValue={award_value}
                                    />
                                    
                                    <Textarea
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        defaultValue={description}
                                    />

                                    <DatePicker value={startDate} onChange={setStartDate} minDate={new Date()}/>

                                    <DialogClose>
                                        <Button
                                            onClick={() =>
                                                editTask(
                                                    id ?? '',
                                                    editedTitle,
                                                    editedDescription ?? '',
                                                    editedAward,
                                                    editedAssignee,
                                                    String(startDate ?? '')
                                                )
                                            }
                                        >
                                            Сохранить
                                        </Button>
                                    </DialogClose>
                                </DialogContent>
                            </Dialog>
                        )}

                        <Dialog>
                            <DialogTrigger>
                                <X />
                            </DialogTrigger>

                            <DialogContent>
                                <DialogTitle>{`Вы уверены, что хотите удалить задачу ${title}?`}</DialogTitle>

                                <div className="flex items-center justify-center gap-5">
                                    <DialogClose>
                                        <Button variant={'accept'} onClick={() => deleteTask(id ?? '')}>
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
