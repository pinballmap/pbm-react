import { 
    CLEAR_ERROR,
    DISPLAY_ERROR,
} from './types'

export const clearError = () => ({ type: CLEAR_ERROR }) 

export const displayError = (err) => ({ type: DISPLAY_ERROR, err})