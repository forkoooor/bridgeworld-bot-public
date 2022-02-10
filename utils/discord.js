const axios = require('axios');

module.exports = {

    logDiscord: async function (content){
        try{
            axios.post(process.env.DISCORD_WEBHOOK, {content}).then((data) =>{
                return true
            }).catch((error) => {
                return false
            })
        }catch(err){
            return
        }
    },

    logSuccess: async function(content){
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.logDiscord(`💼 ${content} ran successfully at ${date}`);
    }
}