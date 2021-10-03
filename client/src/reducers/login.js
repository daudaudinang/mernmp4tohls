const initialState = {
    isLogin: (localStorage.getItem('isLogin')) ? localStorage.getItem('isLogin') : false,
}

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':{
            const newState = {...state, isLogin: true};
            return newState;
        }

        case 'LOGOUT': {
            const newState = {...state, isLogin: false};
            return newState;
        }
        
        default:
            return state;
    }
}

export default loginReducer;