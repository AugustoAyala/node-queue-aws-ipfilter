const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Bull = require('bull');
const myFirstQueue = new Bull('my-first-queue', 'redis://127.0.0.1:6379');

router.post('/url', async (req, res) => {
    res.json({ status: 'se recibio con exito' });
});
router.post('/externo', async (req, res) => {
    res.json(req.body.content.content.phone);
});

router.get('/api/:firstname/:lastname/:email/:zipcode/:phone', (req, res) => {
    if (Number(req.params.zipcode) == 08456) {
        var code = 'CO1234';
    } else if (Number(req.params.zipcode) == 09789) {
        var code = 'CO5678';
    } else {
        var code = 'ES3456';
    }
    var data = {
        firstname: req.params.firstname,
        lastname: req.params.lastname,
        email: req.params.email,
        zipcode: code,
        phone: req.params.phone,
    };
    //Cambiar por la url que corresponda en este caso para pruba local llama a esta ruta
    var url = 'http://localhost:3000/url';
    //var url = 'https://beeceptor.com';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(checkStatus)
        .catch((err) => console.error(err));

    async function checkStatus(res) {
        if (res.ok) {
            console.log(res.ok);
            const job = await myFirstQueue.add({
                content: data,
            });
            console.log(job.data.content);
        }
    }
    res.json(data);
});

module.exports = router;  
