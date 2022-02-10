const axios = require('axios');
const Web3 = require('web3');

const { CONSUMABLE_CONTRACT_ADDRESS } = process.env;

const provider = new Web3.providers.HttpProvider(process.env.INFURA);
const web3 = new Web3(provider)
const abi = require('../contracts/Consumable.json');
const ConsumableContract = new web3.eth.Contract(abi, CONSUMABLE_CONTRACT_ADDRESS);

module.exports = {

    getConsumableItemCount: async function({address, tokenId}){
        try{
            const itemCount = await ConsumableContract.methods.balanceOf(address, tokenId).call();
            return itemCount
        }catch(err){
            return 0
        }
    },

    getConsumablesListings: async function(){
        try{
            var query = {
            "query":"query getCollectionStats($id: ID!) {\n  collection(id: $id) {\n    name\n    floorPrice\n    totalListings\n    totalVolume\n    listings(where: {status: Active}) {\n      token {\n        floorPrice\n        tokenId\n        name\n      }\n    }\n  }\n}","variables":{"id":"0xf3d00a2559d84de7ac093443bcaada5f4ee4165c"},"operationName":"getCollectionStats"
            };
            var options = {
            'method' : 'post',
            'contentType': 'application/json',
            'payload' : JSON.stringify(query)
            };
        
            
            const { data } =  await axios.post('https://api.thegraph.com/subgraphs/name/treasureproject/marketplace', query);
            const listings = data.data.collection.listings;
            const sortedListing = listings.sort((a, b) => parseFloat(a.token.floorPrice) - parseFloat(b.token.floorPrice));

            let uniqueItemNames = [];
            let itemPrices = [];
            sortedListing.forEach((item) => {
            if(!uniqueItemNames.includes(item.token.name)){
                uniqueItemNames.push(item.token.name)
                itemPrices.push({
                    name: item.token.name, 
                    price: item.token.floorPrice,
                    tokenId: item.token.tokenId
                })
            }
            })
            return itemPrices;
        }catch(err){
            return []
        }
        // return sortedListing;
      }
}