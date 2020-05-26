const generateMsg = (text, username) => {
    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}

const generateLocation = () => {
    return {
        createdAt: new Date().getTime()
    }
}

module.exports = { generateMsg, generateLocation }