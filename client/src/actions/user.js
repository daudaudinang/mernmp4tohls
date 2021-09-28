export const saveUser = (listFile) => {
    return {
        type: 'SAVE_USER',
        payload: listFile,
    }
}

export const removeUser = (newList) => {
    return {
        type: 'REMOVE_USER',
        payload: newList
    }
}

export const resetListUser = () => {
    return {
        type: 'RESET_LIST_USER',
        payload: []
    }
}