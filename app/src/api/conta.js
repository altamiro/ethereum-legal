import axios from "axios";
import constant from "./constant";
import web3 from './web3'

const headers = { 
  'Content-Type': 'application/json'
};

// cria uma conta do usuário
export async function nova(data) {
  let newAccountRequest = { "method": "parity_newAccountFromPhrase", "params": [data.nome, data.senha], "id": 1, "jsonrpc": "2.0" };
  return await axios.post(constant.httpEndpoint, newAccountRequest, { 'headers': headers, mode: 'no-cors' });
}

// registra essa conta no parity
export async function registrar(data) {
  let setAccountNameRequest = { "method": "parity_setAccountName", "params": [data.address, data.nome], "id": 1, "jsonrpc": "2.0" };
  return await axios.post(constant.httpEndpoint, setAccountNameRequest, { 'headers': headers, mode: 'no-cors' });
}

// desbloqueia conta
export async function desbloquear(data) {
  return await web3.eth.personal.unlockAccount(data.address, data.senha, null);
}

// tranfere 1 ether para a conta do usuário
export async function transferir(data) {
  return await web3.eth.sendTransaction({from: constant.ownerAccount, to: data.address, value: web3.utils.toWei("1", "ether")})
}