const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./db')
const utils = require('./utils')

const app = express();
const port = 4200;

app.use(cors());
app.use(bodyParser.json());

db.connectToDb().catch(err => console.log(err));

app.get('/link', async (req, res) => {
    const urls = await db.queryUrls()
    res.json(urls.map(doc => ({ url: doc.url })));
});

app.post('/sync', async (req, res) => {
    const clientUrls = req.body.urls;
    const clientUserId = req.body.userId;
    console.log("Client urls = ", clientUrls)
    console.log("Client user Id = ", clientUserId)
    try {
        const data = await utils.sync(clientUrls, clientUserId);
        res.json({ success: true, data });
    } catch (e) {
        res.json({ error: e });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
