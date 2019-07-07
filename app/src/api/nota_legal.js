import constant from "./constant";
import web3 from './web3'

const instance = new web3.eth.Contract(constant.contratoAbi, constant.contratoAccountAddress);

export default instance;
