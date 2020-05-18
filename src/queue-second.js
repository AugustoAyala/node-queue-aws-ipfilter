const Bull = require('bull')
const mySecondQueue = new Bull('my-second-queue', 'redis://127.0.0.1:6379')
module.exports = {
    async end(data) {
        const job = await mySecondQueue.add({
            content: data,
        })
        console.log(job.data.content, 'se agrego en segunda cola')
        return
    },
}
