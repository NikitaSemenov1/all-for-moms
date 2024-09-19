import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User } from '@/shared/types/types'

interface InitialFamilyState {
    familyData?: User[]
}

const initialState: InitialFamilyState = {
    familyData: undefined,
}

export const familySlice = createSlice({
    name: 'family',
    initialState,
    selectors: {
        selectFamily: (state) => state.familyData,
    },
    reducers: {
        setFamily: (state, action: PayloadAction<User[]>) => {
            state.familyData = action.payload
        },
    },
})

export const { actions: familyActions } = familySlice
export const { reducer: familyReducer } = familySlice
export const { selectors: familySelectors } = familySlice
