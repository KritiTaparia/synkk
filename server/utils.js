const db = require('./db')

const setDifference = (setA, setB) => new Set([...setA].filter(elem => !setB.has(elem)));

async function sync(clientUrls, clientUserId) {
    const clientSet = new Set(clientUrls);

    const databaseUrls = await db.queryUrls();
    const databaseSet = new Set(databaseUrls);

    const databaseUrlsByUserId = await db.queryUrls({userId : clientUserId});
    const databaseUrlsByUserIdSet = new Set(databaseUrlsByUserId);
    
    const databaseDiffSet = setDifference(databaseSet, databaseUrlsByUserIdSet)
    const urlsToOpen = setDifference(databaseDiffSet, clientSet)

    const urlsToSave = new Set([...setDifference(clientSet, databaseUrlsByUserIdSet), ...urlsToOpen])
    await db.saveUrls(urlsToSave, clientUserId);
    return Array.from(urlsToOpen);
}

module.exports = {
    sync
}