const canvas = document.getElementById('canvas')
const main = document.querySelector('main')
const cursorSize = document.querySelector('.cursor__size')

const params = {
    mouseDown: false,
    cursor: localStorage.getItem('cursorType') ? localStorage.getItem('cursorType') : 'pencil',
    color: localStorage.getItem('cursorColor') ? localStorage.getItem('cursorColor') : '#000',
    cursorSize: localStorage.getItem('cursorSize') ? localStorage.getItem('cursorSize') : 2,
    canvas: localStorage.getItem('canvas') ? localStorage.getItem('canvas') : ''
}

const ctx = canvas.getContext('2d')
canvas.width = main.offsetWidth
canvas.height = main.offsetHeight
ctx.strokeStyle = params.color
ctx.lineWidth = params.cursorSize
cursorSize.value = params.cursorSize
main.style = `cursor: url("icons/${params.cursor}.png") 0 25, auto;`

const dataURL = params.canvas
if(dataURL){
    const img = new Image
    img.src = dataURL
    img.onload = () => {
        ctx.drawImage(img, 0, 0)
    }
}
canvas.onmousedown = (e) => {
    params.mouseDown = true
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
    if(params.cursor === 'pencil'){
        ctx.lineTo(e.offsetX + 1, e.offsetY)
    }
    else{
        ctx.clearRect(e.offsetX, e.offsetY, 21, -20);
    }
    ctx.stroke()
}
canvas.onmouseup = (e) => {
    params.mouseDown = false
    ctx.closePath()
    localStorage.setItem('canvas', canvas.toDataURL())
}
canvas.addEventListener('mousemove', (e) => {
    if(params.mouseDown){
        const offsetX = e.offsetX
        const offsetY = e.offsetY
        if(params.cursor === 'pencil'){
            ctx.lineTo(offsetX, offsetY)
            ctx.stroke()
        }
        else{
            ctx.clearRect(offsetX, offsetY, 21, -20);
        }
    }
})
const clearData = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem('canvas')
}
const saveChanges = () => localStorage.setItem('canvas', canvas.toDataURL())

cursorSize.addEventListener('change', (e) => {
    localStorage.setItem('cursorSize', e.target.value)
    ctx.lineWidth = e.target.value
})
document.getElementById('save').addEventListener('click', saveChanges)
document.getElementById('clean').addEventListener('click', clearData)
document.querySelector('.cursors').addEventListener('click', (e) => {
    if(e.target.id){
        const cursor = `cursor: url("icons/${e.target.id}.png") 0 25, auto;`
        main.style = cursor
        localStorage.setItem('cursor', e.target.id)
        params.cursor = e.target.id
    }
})
document.getElementById('download').addEventListener('click', () => {
    const link = document.createElement('a')
    link.download = 'canvas.png'
    link.href = canvas.toDataURL()
    link.click()
})