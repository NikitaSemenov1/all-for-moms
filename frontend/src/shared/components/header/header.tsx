import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { userSelectors } from '@/features/user/slice/user-slice'

import styles from './header.module.scss'

const routes = [
    {
        name: 'Главная',
        route: '/',
    },
    {
        name: 'Список покупок',
        route: '/shop',
    },
    {
        name: 'Таблица наград',
        route: '/awards',
    },
    {
        name: 'Ежедневник',
        route: '/tasks',
    },
    {
        name: 'Список желаний',
        route: '/wishlist',
    },
    {
        name: 'Дневник',
        route: '/diary',
    },
]

{
    /**eslint-disable i18next/no-literal-string*/
}
export const Header: FC = () => {
    const user = useSelector(userSelectors.selectUser)
    return (
        <header className={styles.header}>
            <div className="container">
                <nav className="flex items-center justify-between">
                    {user?.family_id ? (
                        routes.map(({ name, route }) => {
                            return (
                                <Link className={styles.link} key={name} to={route}>
                                    {name}
                                </Link>
                            )
                        })
                    ) : (
                        <Link className={styles.link} to={'/'}>
                            Главная
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}
