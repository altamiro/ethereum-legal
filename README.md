# Ethereum Legal

Projeto da Pós - IESB

### Dependências necessárias

Os softwares necessários para rodar o app são:

<ol>
    <li> Nodejs/npm: https://nodejs.org/en/</li>
    <li> Truffle Framework (Para fazer deploy e testes do smart contract)</li>
    <li> Curl https://curl.haxx.se/ (Para enviar requisições ao parity pelo terminal) </li>
     <li> Parity https://wiki.parity.io/Setup (Linux / Mac) </li>
    <li> Parity https://github.com/paritytech/parity-ethereum/releases (Windows) </li>
</ol>

Após instalar o Nodejs: <br>

    -> npm install -g truffle

Para usuários Windows, execute o shell como administrador <br>

npm install --global windows-build-tools --unsafe

### Instruções

#### Para rodar a blockchain

dentro da pasta blockchain <br>

Execute o seguinte comando: <br>

    parity --config nodes/node00/node.toml

Em um outro terminal, execute os seguintes comandos: <br>

    curl --data '{"method":"parity_newAccountFromPhrase","params":["node00","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

O comando acima retornará um endereço da conta criada, copie este endereço pois o usaremos nos próximos passos. <br>
Para que o parity reconheça a conta pelo seu nome, use o comando abaixo: <br>

    curl --data '{"method":"parity_setAccountName","params":["0x00a1103c941fc2e1ef8177e6d9cc4657643f274b","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

Pare a execução do nó. Descomente o código no arquivo /nodes/node00/node.toml <br>

Execute o nó com o comando: <br>

    parity --config nodes/node00/node.toml

#### Para fazer o deploy do contrato

Agora que a blockchain esta rodando, em um outro terminal, entre na pasta dapp. Para fazer o deploy do contrato basta executar: <br>

    truffle migrate --reset

Pare a execução do nó. Execute o nó com o comando: <br>

    parity --config nodes/node00/node.toml

#### Para executar o app

Dentro da pasta app <br>

    npm install
    npm run serve

    acesse o app pelo endereço: http://localhost:8080

<br>

A tela inicial possui 2(dois) módulos: AUDITOR e CONTRIBUINTE
<br>

#### Para navegar no módulo AUDITOR:

<br>
   Se for o primeiro acesso uma conta deve ser criada.
    
  * CRIANDO UMA CONTA
    
    - Na tela inicial o módulo AUDITOR é o principal, clique em CRIAR UMA CONTA
    - Preencha os campos Nome, CPF e Senha e clique em CRIAR
    
<br>

#### ACESSANDO O SISTEMA

    - De volta à tela inicial informe o CPF e a Senha e clique em ACESSAR

<br>

#### EFETUANDO UM LANÇAMENTO

    - Na tela principal clique no botão Novo Lançamento
    - Na tela Lançamento (NF) selecione CPF ou CNPJ do contribuinte, preencha os campos solicitados e clique em SALVAR

<br>
        O sistema retornará à tela principal mostrando a conta criada na Blockchain para aquele CPF/CNPJ e os respectivos dados         lançados.
<br>
        A conta criada é única para cada CPF/CNPJ informado no lançamento, garantindo assim que quaisquer créditos lançados para o CPF/CNPJ informado serão atribuídos à sua respectiva conta, independentemente de quantos lançamentos ou quais tipos de documentos fiscais sejam realizados.
<br>
        A conta criada será acessada no módulo CONTRIBUINTE utilizando o CPF/CNPJ utilizado na criação.
<br>

#### Para navegar no módulo CONTRIBUINTE:

<br>
Após os lançamentos serem efetuados é possível navegar pelas contas dos contribuintes.
    
    * VISUALIZANDO AS INFORMAÇÕES NO MÓDULO CONTRIBUINTE
    
    - Na tela inicial selecione CONTRIBUINTE
    - Na tela seguinte selecione CPF ou CNPJ e informe o número e clique em ACESSAR

<br>
        Se tiver algum lançamento para o número informado o sistema apresentará as informações, se não, informará que não este contribuinte está cadastrado
        Uma vez tendo uma conta cadastrada para o CPF/CNPJ informado o sistema apresentará a tela "Informações da sua conta(Crédito) com o saldo disponível, a lista de lançamentos com os respectivos valoress e os números dos bilhetes para participação no sorteio do Nota Legal e, também, o botão "Usar Crédito"

<br>
    * USAR CRÉDITO
     
   O sistema está programado para utilização total do crédito.
   
<br>
    - Ao clicar no botão "Usar Crédito" o sistema solicita que informe a destinação do crédito (IPTU,IPVA ou CONTA CORRENTE)
    - Clique em OK
        O sistema apresentará na tela o registro da utilização dos créditos e o saldo disponível atualizado
