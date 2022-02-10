const Web3 = require('web3');

const consumable = require('./consumable');
const transaction = require('./transaction');
const discord = require('./discord');

const MARKETPLACE_CONTRACT_ADDRESS = process.env.MARKETPLACE_CONTRACT_ADDRESS;

const provider = new Web3.providers.HttpProvider(process.env.INFURA);
const web3 = new Web3(provider)
const abi = require('../contracts/Marketplace.json');
const MarketplaceContract = new web3.eth.Contract(abi, MARKETPLACE_CONTRACT_ADDRESS);

const account = web3.eth.accounts.privateKeyToAccount(process.env.SECRET_KEY);
const { address } = account;

module.exports = {

    listConsumable: async function({name}){
        try{
            // Get all consumable listings
            const listings = await consumable.getConsumablesListings();
            if(!listings || listings.length === 0) return false;
            
            // Filter out the selected item by name
            const item = listings.filter(item => item.name === name)[0];
            if(!item || !item.name) return false; 
            
            const amountOwnedOfToken = await consumable.getConsumableItemCount({address, tokenId: item.tokenId});

            if(amountOwnedOfToken > 0){
                const nftAddress = '0xf3d00a2559d84de7ac093443bcaada5f4ee4165c'; // Consumable Contract
                const tokenId = item.tokenId;
                const quantity = amountOwnedOfToken;
                const pricePerItem = item.price;
                const expirationTime = Math.floor(Date.now() + 15552000000);

                // Only list if price if higher than 1 $MAGIC
                if(pricePerItem > 1000000000000000000){
                    try{
                        // Check if item is listed
                        const method = await MarketplaceContract.methods.createListing(nftAddress, tokenId, quantity, pricePerItem, expirationTime)
                        await transaction.signTransaction({to: MARKETPLACE_CONTRACT_ADDRESS, method, address});
                    }catch(err){
                        // Update listing with new values
                        if(err.message === 'Returned error: execution reverted: already listed'){
                            try{
                                const method = await MarketplaceContract.methods.updateListing(nftAddress, tokenId, quantity, pricePerItem, expirationTime)
                                await transaction.signTransaction({to: MARKETPLACE_CONTRACT_ADDRESS, method, address});
                            }catch(err){
                                return false;
                            }
                        }
                    }

                    discord.logDiscord(`💰 Listed ${quantity}x ${name} for ${pricePerItem / 1000000000000000000} $MAGIC`);
                }else{
                    discord.logDiscord(`🚨 Price too low for ${name} (${pricePerItem / 1000000000000000000} $MAGIC). Did not list.`);
                }
            }
        }catch(err){
            console.log(err)
        }
    },

    

}