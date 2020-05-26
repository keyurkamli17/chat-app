const users = []

const addUser = ({ id, username, room }) => {

    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate user
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //check for existing user
    const existinguser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existinguser) {
        return { error: 'username is alredy exist' }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

// remove user
const removeUser = (id) => {
    const index = users.findIndex((user => user.id === id))

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//get user

const getUser = (id) => {
    const userFind = users.find((user) => user.id === id)
    return userFind
}

const getRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoom
}