const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(process.env.INFURA);

const { SECRET_KEY } = process.env;

const web3 = new Web3(provider)

module.exports = {
    signTransaction: async function({to, method, address}){
        // define CONTRACT_ADDRESS
            const options = {
                to: to,
                data: method.encodeABI(),
                gas: await method.estimateGas({from: address}),
                gasPrice: await web3.eth.getGasPrice() // or use some predefined value
            };
    
            const signed  = await web3.eth.accounts.signTransaction(options, SECRET_KEY);
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            return receipt;
        }
}