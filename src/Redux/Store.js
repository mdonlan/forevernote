import { createStore } from "redux";

const initialState = {
    userLoggedIn: false,
    userNotebooks: [],
    activeNotebook: 0,
    activeNote: 0, // index in userNotes
    uid: null,
    isLoadingNote: false,
};

function reducer (state = initialState, action) {
    switch (action.type) {
        case "SET_USER_LOGGED_IN": 
            return {
                ...state,
                userLoggedIn: action.payload
            };
        case "SET_USER_NOTEBOOKS": 
            return {
                ...state,
                userNotebooks: action.payload
            };
        case "SET_ACTIVE_NOTEBOOK": 
            return {
                ...state,
                activeNotebook: action.payload
            };
        case "SET_ACTIVE_NOTE": 
            return {
                ...state,
                activeNote: action.payload
            };
        case "UPDATE_NOTE": 
            return {
                ...state,
                activeNote: action.payload
            };
        case "SET_UID": 
            return {
                ...state,
                uid: action.payload
            };
        case "SET_LOADING_NOTE": 
            return {
                ...state,
                isLoadingNote: action.payload
            };
        default:
            return state;
    }
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;