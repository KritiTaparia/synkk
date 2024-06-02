const db = require('./db')

const setDifference = (setA, setB) => new Set([...setA].filter(elem => !setB.has(elem)));

async function sync(clientUrls) {
    const clientSet = new Set(clientUrls);
    const databaseUrls = await db.queryUrls();
    const databaseSet = new Set(databaseUrls);
    await db.saveUrls(setDifference(clientSet, databaseSet));
    return Array.from(setDifference(databaseSet, clientSet));
}

module.exports = {
    sync
}