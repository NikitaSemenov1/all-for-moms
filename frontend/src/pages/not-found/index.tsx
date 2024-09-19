import { useTranslation } from 'react-i18next'

const NotFound = () => {
    const { t } = useTranslation()

    return <div>{t('common.notFound')}</div>
}

export default NotFound
