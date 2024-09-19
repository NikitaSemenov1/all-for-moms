import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'

import { familyReducer } from '@/features/falimy/slice/family-slice'
import { userReducer } from '@/features/user/slice/user-slice'

export const combinedReducer = combineReducers({
    user: userReducer,
    family: familyReducer,
})

const rootReducer: Reducer = (state, action) => {
    return combinedReducer(state, action)
}

export const store = configureStore({
    reducer: rootReducer,
    devTools: true,
})

export type AppDispatch = typeof store.dispatch
