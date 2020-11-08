export const initialState = {
    user: null,
    togglerState:1,
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_TOGGLER:"SET_TOGGLER"
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            };
        case actionTypes.SET_TOGGLER:
            return {
                ...state,
                togglerState:action.togglerState
            }

        default:
            return state;
    }
}

export default reducer