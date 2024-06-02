const mongoose = require('mongoose');
const linksSchema = new mongoose.Schema({
    url: String,
    username: String,
    timestamp: { type : Date, default: Date.now }
  });
const Links = mongoose.model('links', linksSchema);

async function connectToDb() {
  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
  console.log("connection established")
}

async function queryUrls(query={}) {
  return (await Links.find(query).select('url -_id')).map(doc => doc.url);
}

async function saveUrls(urls) {
  for (const url of urls) {
    const exists = (await queryUrls({ url })).length !== 0;
    console.log('Checking if', url, 'is present in the DB...', exists);
    if (!exists) {
      const newUrl = new Links({ url });
      await newUrl.save();
      console.log('Inserted', newUrl);
    }
  }
}

module.exports = {
    connectToDb,
    queryUrls,
    saveUrls
}
