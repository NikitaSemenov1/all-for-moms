import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User } from '@/shared/types/types'

interface InitialUserState {
    userData?: User
}

const initialState: InitialUserState = {
    userData: undefined,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    selectors: {
        selectUser: (state) => state.userData,
    },
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.userData = action.payload
        },
    },
})

export const { actions: userActions } = userSlice
export const { reducer: userReducer } = userSlice
export const { selectors: userSelectors } = userSlice
