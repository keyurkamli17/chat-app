const socket = io()

const $msgform = document.querySelector('form')
const $msgformInput = $msgform.querySelector('input')
const $msgformButton = $msgform.querySelector('button')
const $locationbutton = document.querySelector('#sendlocation')
const $message = document.querySelector('#message')
$msgformInput.focus()


//template
const messageTemp = document.querySelector("#msg").innerHTML
const LocationTemp = document.querySelector("#Location_msg").innerHTML
const roomData = document.querySelector('#roomData').innerHTML

//option
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {

    const $newMessage = $message.lastElementChild

    const newMessageHeight = getComputedStyle($newMessage)
    const newMessageargin = parseInt(newMessageHeight.marginBottom)
    const newEhieght = $newMessage.offsetHeight + newMessageargin

    const visibleHeight = $message.offsetHeight

    const messageHeight = $message.scrollHeight

    const scrolloffset = $message.scrollTop + visibleHeight

    if (messageHeight - newMessageHeight <= scrolloffset) {
        $message.scrollTop = $message.scrollHeight
    }
}

socket.on('msg', (message) => {

    console.log(message.text)
    const html = Mustache.render(messageTemp, { username: message.username, message: message.text, createdAt: moment(message.createdAt).format('h:m a') })
    $message.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('rooms', ({ room, users }) => {
    const html = Mustache.render(roomData, {
        room,
        users
    })
    document.querySelector('#sidebarTemp').innerHTML = html
})

socket.on('LocationMsg', (LocationMsg, username) => {

    console.log(LocationMsg);
    const LOChtml = Mustache.render(LocationTemp, { username: username, LocationMsg: LocationMsg, createdAt: moment(LocationMsg.createdAt).format('h:m a') })
    $message.insertAdjacentHTML('beforeend', LOChtml)
    autoscroll()
})

$msgform.addEventListener('submit', (e) => {
    e.preventDefault()

    $msgformButton.setAttribute('disabled', 'disabled')

    const sendMsg = $msgformInput.value

    socket.emit('sendmsg', sendMsg, (error) => {

        $msgformButton.removeAttribute('disabled')
        $msgformInput.value = ''
        $msgformInput.focus()

        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!');
    })
})

$locationbutton.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Your broweser is not support geolocation')
    }

    $locationbutton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        socket.emit('location', { latitude, longitude, }, (error) => {

            $locationbutton.removeAttribute('disabled')
            if (error) {
                return console.log(error);
            }

            console.log('Location shared!');

        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert('Username is already exist')
        location.href = '/'
    }
})