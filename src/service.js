const fetch = require('node-fetch')
const Bull = require('bull')
const myFinishQueue = new Bull('my-finish-queue', 'redis://127.0.0.1:6379')

module.exports = {
    async externo(data) {
        var url = 'http://localhost:3000/externo'

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(async (json) => {
                if (
                    json.length === 9 &&
                    (json[0] === '6' ||
                        json[0] === '7' ||
                        json[0] === '8' ||
                        json[0] === '9')
                ) {
                    console.log(json, 'respuesta de servicio externo')
                    const job = await myFinishQueue.add({
                        content: data,
                    })
                    console.log(
                        job.data.content.content.content,
                        'informacion guardada en cola final'
                    )
                } else {
                    console.log(json, 'no cumple la condiciones de phone')
                }
            })
        return
    },
}
