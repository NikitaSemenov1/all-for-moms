import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Check } from 'lucide-react'

import { familySelectors } from '@/features/falimy/slice/family-slice'
import { TaskCard } from '@/features/task-card'
import { userSelectors } from '@/features/user/slice/user-slice'
import { TaskItem } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/shared/ui/command'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Textarea } from '@/shared/ui/textarea'
import DatePicker from 'react-date-picker'
import { cn } from '@/shared/ui/utils'
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'

interface TasksPageProps { }

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const TasksPage: FC<TasksPageProps> = ({ }) => {
    const family = useSelector(familySelectors.selectFamily)
    const user = useSelector(userSelectors.selectUser)
    const isParent = user?.role === 'parent'

    const [todayTasks, setTodayTasks] = useState<TaskItem[]>([])
    const [futureTasks, setFutureTasks] = useState<TaskItem[]>([])
    const [otherTasks, setOtherTasks] = useState<TaskItem[]>([])
    const [completeTasks, setCompleteTasks] = useState<TaskItem[]>([])
    const [startDate, setStartDate] = useState<Value>(new Date());
    const [isPrivate, setIsPrivate] = useState<string>('private')

    const [assignee, setAssignee] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [awardValue, setAwardValue] = useState(0)

    useEffect(() => {
        localStorage.setItem('route', '/tasks')
    }, [])

    const handleChangeAssignee = (id: string) => {
        if (assignee.includes(id)) {
            setAssignee((prev) => [...prev.filter((item) => item !== id)])
        } else {
            setAssignee((prev) => [...prev, id])
        }
    }

    const getTasks = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks?family_id=${user?.family_id}`)

            const jsonDataRes: TaskItem[] = await res.json()

            const jsonData = jsonDataRes.filter(({ assignee, owner, visability }) => {
                return visability === 'public' || (visability === 'private' && (assignee === user?.id || owner === user?.id))
            }).sort((a: TaskItem, b: TaskItem) => {
                return Number(new Date(b.date)) - Number(new Date(a.date))
            })

            const today: TaskItem[] = []
            const future: TaskItem[] = []
            const other: TaskItem[] = []
            const complete: TaskItem[] = []

            jsonData.forEach((item) => {
                if (item.status === 'done') {
                    complete.push(item)
                } else if (new Date(item.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
                    today.push(item)
                } else if (new Date(item.date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
                    future.push(item)
                } else {
                    other.push(item)
                }
            })

            setTodayTasks(today)
            setFutureTasks(future)
            setCompleteTasks(complete)
            setOtherTasks(other)
        } catch (e) {
            console.log(e)
        }
    }

    const createTask = async () => {
        try {
            if (!isParent) {
                await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                    method: 'POST',
                    body: JSON.stringify({
                        title,
                        description,
                        award_value: awardValue,
                        owner: user?.id,
                        assignee: user?.id,
                        date: startDate,
                        family_id: user?.family_id,
                        status: 'in_progress',
                        visability: isPrivate
                    }),
                })
            } else {
                if (!assignee.length) return
                assignee.forEach(async (item) => {
                    await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                        method: 'POST',
                        body: JSON.stringify({
                            title,
                            description,
                            award_value: awardValue,
                            owner: user?.id,
                            assignee: item,
                            date: startDate,
                            family_id: user?.family_id,
                            status: 'in_progress',
                            visability: isPrivate
                        }),
                    })
                })
            }

            // const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
            //     method: "POST",
            //     body: JSON.stringify({
            //         title,
            //         description,
            //         award_value: awardValue,
            //         owner: user?.id,
            //         assignee,
            //         date: new Date(),
            //         family_id: user?.family_id,
            //         status: "in_progress"
            //     })
            // })

            getTasks()
        } catch (e) {
            console.log(e)
        }
    }

    const deleteTask = async (id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                method: 'DELETE',
            })

            if (res.status === 200) {
                getTasks()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const editTask = async (id: string, title: string, description: string, award: number, assignee: string, date: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title,
                    description,
                    award_value: award,
                    date: date
                }),
            })

            if (res.status === 200) {
                getTasks()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const sendTaskOnSubmit = async (task_id: string, child_id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks_requests`, {
                method: 'POST',
                body: JSON.stringify({
                    child_id,
                    task_id,
                    status: 'send',
                }),
            })

            if (res.status === 200) {
                getTasks()
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getTasks()
    }, [])

    return (
        <div className="container">
            <div className="text-[30px]">Ежедневник</div>

            <Dialog>
                <DialogTrigger>
                    <Button className="mb-2">Создать задачу +</Button>
                </DialogTrigger>

                <DialogContent>
                    {isParent &&
                        <>
                            <div>Исполнитель</div>
                            <Command>
                                <CommandList>
                                    <CommandGroup>
                                        {family?.map(({ id, name }) => {
                                            return (
                                                <CommandItem key={id} onSelect={() => handleChangeAssignee(id)} value={id}>
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            assignee.includes(id) ? 'opacity-100' : 'opacity-0',
                                                        )}
                                                    />
                                                    {name}
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </>
                    }
                    <RadioGroup defaultValue='private' onValueChange={(val) => setIsPrivate(val)}>
                        <label className='flex flex-row-reverse items-center justify-end gap-2'>
                            Приватная
                            <RadioGroupItem value={'private'}></RadioGroupItem>
                        </label>
                        <label className='flex flex-row-reverse items-center justify-end gap-2'>
                            Публичная
                            <RadioGroupItem value={'public'}></RadioGroupItem>
                        </label>
                    </RadioGroup>
                    <Input onChange={(e) => setTitle(e.target.value)} placeholder="Название" />
                    {isParent && (
                        <Input onChange={(e) => setAwardValue(Number(e.target.value))} placeholder="Стоимость" />
                    )}
                    <Textarea onChange={(e) => setDescription(e.target.value)} placeholder="Описание" />
                    <DatePicker value={startDate} onChange={setStartDate} minDate={new Date()} />
                    <DialogClose>
                        <Button onClick={createTask}>Сохранить</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            <Tabs defaultValue="today">
                <TabsList>
                    <TabsTrigger value="today">Сегодня</TabsTrigger>
                    <TabsTrigger value="future">Предстоящие</TabsTrigger>
                    <TabsTrigger value="other">Остальные</TabsTrigger>
                    <TabsTrigger value="done">Выполненные</TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                    {todayTasks.length ? (
                        todayTasks.map((item) => {
                            return (
                                <TaskCard
                                    key={item.id}
                                    {...item}
                                    deleteTask={deleteTask}
                                    editTask={editTask}
                                    sendTaskOnSubmit={sendTaskOnSubmit}
                                    getTasks={getTasks}
                                />
                            )
                        })
                    ) : (
                        <div>На сегодня заданий нет</div>
                    )}
                </TabsContent>
                <TabsContent value="future">
                    {futureTasks.length ? (
                        futureTasks.map((item) => {
                            return (
                                <TaskCard
                                    key={item.id}
                                    {...item}
                                    deleteTask={deleteTask}
                                    editTask={editTask}
                                    sendTaskOnSubmit={sendTaskOnSubmit}
                                    getTasks={getTasks}
                                />
                            )
                        })
                    ) : (
                        <div>Заданий нет</div>
                    )}
                </TabsContent>
                <TabsContent value="done">
                    {completeTasks.length ? (
                        completeTasks.map((item) => {
                            return (
                                <TaskCard
                                    key={item.id}
                                    {...item}
                                    deleteTask={deleteTask}
                                    editTask={editTask}
                                    sendTaskOnSubmit={sendTaskOnSubmit}
                                    getTasks={getTasks}
                                />
                            )
                        })
                    ) : (
                        <div>Заданий нет</div>
                    )}
                </TabsContent>
                <TabsContent value="other">
                    {otherTasks.length ? (
                        otherTasks.map((item) => {
                            return (
                                <TaskCard
                                    key={item.id}
                                    {...item}
                                    deleteTask={deleteTask}
                                    editTask={editTask}
                                    sendTaskOnSubmit={sendTaskOnSubmit}
                                    getTasks={getTasks}
                                />
                            )
                        })
                    ) : (
                        <div>Заданий нет</div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
