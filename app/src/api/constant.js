const httpEndpoint = 'http://localhost:8540';

const blockchain = require('../../../blockchain/chain.json')

const ownerAccount = blockchain['engine']['authorityRound']['params']['validators']['list'][0];

const contrato = require('../../../dapp/build/contracts/NotaLegal.json')

const network = contrato['networks']

const contratoAccountAddress = network['8995'].address;

const contratoAbi = contrato['abi']

export default {
  httpEndpoint,
  contrato,
  contratoAbi,
  contratoAccountAddress,
  ownerAccount
}
