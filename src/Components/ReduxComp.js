const initialState = {
    name: '',
    email: '',
    img: ''
};

const rootReducer = (state = initialState, action) => {
    if (action.type == 'LOGGEDIN')
        return ({ ...state, email: action.email, name: action.name, img: action.img });
    return state;
}



export default rootReducer;