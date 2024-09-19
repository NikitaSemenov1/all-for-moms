import { ThunkConfig, ThunkExtraArg } from './config/state-schema.ts'
import { AppDispatch } from './config/store.ts'
import { StoreProvider } from './ui/store-provider.tsx'

export { StoreProvider }

export type { AppDispatch, ThunkConfig, ThunkExtraArg }
