const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMsg, generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const pathDir = path.join(__dirname, '../public')
app.use(express.static(pathDir))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('msg', generateMsg('Welcome!', 'Admin'))
        socket.broadcast.to(user.room).emit('msg', generateMsg(`${user.username} has joined this room`))

        io.to(user.room).emit('rooms', {
            room: user.room,
            users: getRoom(user.room)
        })

        callback()
    })

    socket.on('sendmsg', (text, callback) => {

        const user = getUser(socket.id)

        const filter = new Filter()

        if (filter.isProfane(text)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('msg', generateMsg(text, user.username))
        callback()
    })

    socket.on('location', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('LocationMsg', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username)
        callback()
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if (user) {
            io.emit('msg', generateMsg(`${user.username} has left`))
        }

        io.to(user.room).emit('rooms', {
            room: user.room,
            users: getRoom(user.room)
        })
    })
})

server.listen(port, () => {
    console.log('Server is runnig on : ' + port);
})