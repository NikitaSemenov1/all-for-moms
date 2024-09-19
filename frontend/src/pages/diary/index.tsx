import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { DiaryNote } from '@/features/diary-note'
import { userSelectors } from '@/features/user/slice/user-slice'
import { DiaryNoteItem } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Textarea } from '@/shared/ui/textarea'

interface DiaryProps { }

export const DiaryPage: FC<DiaryProps> = ({ }) => {
    const user = useSelector(userSelectors.selectUser)
    const [notes, setNotes] = useState<DiaryNoteItem[]>([])
    const [text, setText] = useState('')
    const [todayNote, setTodayNote] = useState<DiaryNoteItem | null>(null)
    useEffect(() => {
        localStorage.setItem('route', '/diary')
    }, [])

    const getNotes = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/diary_notes?owner=${user?.id}`)

            const jsonData: DiaryNoteItem[] = await res.json()

            if (jsonData.length) {
                jsonData.sort((a, b) => {
                    return +new Date(b.date) - +new Date(a.date)
                })

                if (new Date(jsonData[0].date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
                    setTodayNote(jsonData[0])
                } else {
                    setTodayNote(null)
                }

                setNotes(jsonData)
            } else {
                setTodayNote(null)
                setNotes([])
            }
        } catch (e) {
            console.log(e)
        }
    }

    const deleteNote = async (id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/diary_notes/${id}`, {
                method: 'DELETE',
            })

            if (res.status === 200 || res.status === 201) {
                getNotes()
            }
        } catch (e) { }
    }

    const editNote = async (id: string, text: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/diary_notes/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ text }),
            })

            if (res.status === 200) {
                getNotes()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const addNote = async () => {
        if (!text) return
        try {
            const body = {
                owner: user?.id,
                text,
                date: new Date(),
            }

            await fetch(`${import.meta.env.VITE_API_URL}/diary_notes`, {
                method: 'POST',
                body: JSON.stringify(body),
            })

            setText('')
            getNotes()
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getNotes()
    }, [])
    return (
        <div className="container">
            <div className="text-[30px] mb-5">Дневник</div>

            {notes.length ? (
                notes.map((item) => {
                    return <DiaryNote key={item.id} {...item} deleteNote={deleteNote} editNote={editNote} />
                })
            ) : (
                <div>Нет записей</div>
            )}

            {!todayNote &&
                <>
                    <div>Сегодня вы еще не делали заметку</div>
                    <Textarea
                        className="mt-5"
                        placeholder="Введите заметку"
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Button onClick={addNote} className="mt-2">
                        Отправить
                    </Button>
                </>
            }

            {/* <Tabs defaultValue="today">
                <TabsList>
                    <TabsTrigger value="today">Сегодня</TabsTrigger>
                    <TabsTrigger value="all">Все заметки</TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                    {todayNote ? (
                        <DiaryNote {...todayNote} deleteNote={deleteNote} editNote={editNote} />
                    ) : (
                        <>
                            <div>Сегодня вы еще не делали заметку</div>
                            <Textarea
                                className="mt-5"
                                placeholder="Введите заметку"
                                onChange={(e) => setText(e.target.value)}
                            />
                            <Button onClick={addNote} className="mt-2">
                                Отправить
                            </Button>
                        </>
                    )}
                </TabsContent>
                <TabsContent value="all">
                    {notes.length ? (
                        notes.map((item) => {
                            return <DiaryNote key={item.id} {...item} deleteNote={deleteNote} editNote={editNote} />
                        })
                    ) : (
                        <div>Нет записей</div>
                    )}
                </TabsContent>
            </Tabs> */}

            {/* <div className='h-[50vh] overflow-y-scroll'>
                {notes.length ?
                    notes.map((item) => {
                        return <DiaryNote key={item.id} {...item} deleteNote={deleteNote} editNote={editNote} />
                    })
                    :
                    <>Нет записей</>
                }
            </div> */}
        </div>
    )
}
