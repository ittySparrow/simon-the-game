export default (id) => new Audio(require(`../assets/sounds/${id}.mp3`)).play()
