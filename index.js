require('dotenv').config()

const cron = require('node-cron');
const express = require('express')
const app = express()

const questing = require('./utils/questing');
const discord = require('./utils/discord')
const marketplace = require('./utils/marketplace')

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL, () => {}, { useNewUrlParser: true })
.catch(err => {
    console.log(err);
});



discord.logDiscord(`🏁 Node server restarted`);

// Start Questing every 8.5 hours
cron.schedule('*/10 * * * *', async () => {
    try{
        // await questing.startQuestForIds();
        await questing.restartTokenQuests();
        await questing.revealQuests();

        discord.logSuccess('Questing')
        
    }catch(err){
        discord.logDiscord(`Error at ${date}: ${err.message}`);
    }
});



// List all consumables every day at 00:01
cron.schedule('1 0 * * *', async () => {
  try{
    marketplace.listConsumable({name: 'Essence of Starlight'});
    marketplace.listConsumable({name: 'Prism Shards'});

    discord.logSuccess('Marketplace listing')
  }catch(err){
    discord.logDiscord(`Error at ${date}: ${err.message}`);
  }
});

module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })

}





