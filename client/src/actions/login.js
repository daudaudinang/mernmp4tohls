export const login = (loginData) => {
    return {
        type: 'LOGIN',
        payload: loginData,
    }
}

export const logout = (logoutData) => {
    return {
        type: 'LOGOUT',
        payload: logoutData
    }
}