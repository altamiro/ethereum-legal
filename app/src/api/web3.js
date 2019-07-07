import Web3 from 'web3';
import constant from "./constant";

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const web3 = new Web3(constant.httpEndpoint, null, OPTIONS);

export default web3;