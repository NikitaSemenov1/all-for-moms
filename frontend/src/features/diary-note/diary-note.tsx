import { FC, useState } from 'react'
import dayjs from 'dayjs'
import ruLocale from 'dayjs/locale/ru'
import { Pencil, X } from 'lucide-react'

import { DiaryNoteItem } from '@/shared/types/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'

import styles from './diary-note.module.scss'

interface DiaryNoteProps extends DiaryNoteItem {
    deleteNote: (id: string) => void
    editNote: (id: string, text: string) => void
}

export const DiaryNote: FC<DiaryNoteProps> = ({ id, date, text, deleteNote, editNote }) => {
    const [editText, setEditText] = useState(text)

    const DeleteModal = () => {
        return (
            <Dialog>
                <DialogTrigger>
                    <X className={styles.delete} width={30} height={30} />
                </DialogTrigger>

                <DialogContent>
                    <DialogTitle>Вы уверены, что хотите удалить запись?</DialogTitle>

                    <div className="flex items-center justify-center gap-5">
                        <DialogClose>
                            <Button onClick={() => deleteNote(id)} variant={'accept'}>
                                Да
                            </Button>
                        </DialogClose>

                        <DialogClose>
                            <Button variant={'destructive'}>Отмена</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className={styles.wrapper}>
            <div className="text-[30px] mb-2">{dayjs(date).locale(ruLocale).format('DD MMMM YYYY')}</div>
            <div className="flex justify-between items-start">
                <div className={styles.text}>{text}</div>
                <div className="flex items-center">
                    <Dialog>
                        <DialogTrigger>
                            <Pencil className={styles.edit} width={25} height={25} />
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Редактирование заметки</DialogTitle>
                            <Textarea defaultValue={text} onChange={(e) => setEditText(e.target.value)} />
                            <div className="flex gap-5 items-center justify-between">
                                <DialogClose>
                                    <Button onClick={() => editNote(id, editText)} variant={'accept'}>
                                        Сохранить
                                    </Button>
                                </DialogClose>
                                <DialogClose>
                                    <Button variant={'destructive'}>Отменить</Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <DeleteModal />
                </div>
            </div>
        </div>
    )
}
