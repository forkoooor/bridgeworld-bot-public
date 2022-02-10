const Web3 = require('web3');
const track = require('./action-tracker');
const transaction = require('./transaction');
const discord = require('./discord');

const QUESTING_CONTRACT_ADDRESS = process.env.QUESTING_CONTRACT_ADDRESS
const SECRET_KEY = process.env.SECRET_KEY;

const provider = new Web3.providers.HttpProvider(process.env.INFURA);

const web3 = new Web3(provider)

const abi = require('../contracts/Questing.json');
const QuestingContract = new web3.eth.Contract(abi, process.env.QUESTING_CONTRACT_ADDRESS);


const account = web3.eth.accounts.privateKeyToAccount(process.env.SECRET_KEY);
const { address } = account;

const legionIds = [x, y, z]; // Add your Legion IDs

// convert to solidity correct variables
const ids = legionIds.map(id => web3.utils.toBN(id).toString()); 
const difficulty = legionIds.map(index => web3.utils.toBN(0));
const loops = legionIds.map(index => web3.utils.toBN(1));

module.exports = {

    // Run startQuest contract function
    restartTokenQuests: async function(){
        try{
            const action = 'START_QUEST';
            const cooldown = 60 * 60 * 8.5;
            const isAllowedToRun = await track.isAllowedToRun({action, cooldown});

            if(isAllowedToRun){
                const method = await QuestingContract.methods.restartTokenQuests(ids, difficulty, loops)
                await transaction.signTransaction({to: QUESTING_CONTRACT_ADDRESS, method, address});
                await track.saveAction('START_QUEST');
                discord.logDiscord(`🔁 Restarted quest successfully for ${ids.length} Legions`);
            }
        }catch(err){
            return false
        }
    },

    // Run startQuest contract function
    finishQuests: async function(){
        try{
            const action = 'START_QUEST';
            const cooldown = 60 * 60 * 8.2;
            const isAllowedToRun = await track.isAllowedToRun({action, cooldown});
            
            if(isAllowedToRun){
                const method = await QuestingContract.methods.finishTokenQuests(ids)
                await transaction.signTransaction({to: QUESTING_CONTRACT_ADDRESS, method, address})
                await track.saveAction('FINISH_QUEST');
            }
        }catch(err){
            return false
        }
    },

    revealQuests: async function(){
        try{
            const action = 'REVEAL_QUEST';
            const cooldown = 60 * 60 * 8.5;
            const isAllowedToRun = await track.isAllowedToRun({action, cooldown});
            
            if(isAllowedToRun){
                const method = await QuestingContract.methods.revealTokensQuests(ids);
                await transaction.signTransaction({to: QUESTING_CONTRACT_ADDRESS, method, address})
                await track.saveAction('REVEAL_QUEST');
                discord.logDiscord(`🔍 Revealed quest successfully for ${ids.length} Legions`);
            }
        }catch(err){
            return false
        }
    },

   
}