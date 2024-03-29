# Ethereum Legal

Trabalho apresentado ao curso de pós-graduação TECNOLOGIAS DISRUPTIVAS do IESB, para a disciplina IMPLEMENTAR CASES DE MERCADO EM BLOCKCHAIN, professor Flavio Henrique Moura Stakoviak.
<br><br>
Este projeto, com escopo de MVP, demonstra a aplicação da tecnologia BLOCKCHAIN para a persistência de dados para o Programa Nota Legal DF.
<br><br>
Usando uma interface web para a simulação da geração de uma nota fiscal de mercadorias ou de serviços, o sistema calcula os valores dos impostos gerados e os respectivos créditos do contribuinte no Programa Nota Legal (muito embora estes valores não sejam os aplicados na realidade), registrando estes créditos numa Blockchain privada por meio de um Smart Contract Ethereum.
<br><br>
Para cada CPF ou CNPJ de contribuinte é criado um único endereço na Blockchain para registro e recuperação dos valores referentes aos créditos, às utilizações dos mesmos e aos bilhetes gerados para fins de sorteio.

<hr>

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

Dentro da pasta blockchain, execute o seguinte comando: <br>

    parity --config nodes/node00/node.toml

Em um outro terminal, execute os seguintes comandos: <br>

    curl --data '{"method":"parity_newAccountFromPhrase","params":["node00","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

O comando acima retornará um endereço da conta criada, copie este endereço pois o usaremos nos próximos passos. <br>
Para que o parity reconheça a conta pelo seu nome, use o comando abaixo: <br>

    curl --data '{"method":"parity_setAccountName","params":["0x00a1103c941fc2e1ef8177e6d9cc4657643f274b","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

Pare a execução do nó.<br>
Descomente o código no arquivo /nodes/node00/node.toml <br>

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

#### Acesse o app

```
- Endereço: http://localhost:8080
```

<hr>

#### A tela inicial possui 2(dois) módulos:

```
- AUDITOR e CONTRIBUINTE
```

#### Para navegar no módulo AUDITOR:

```
 - Se for o primeiro acesso uma conta deve ser criada.
```

#### CRIANDO UMA CONTA

```
- Na tela inicial o módulo AUDITOR é o principal, clique em CRIAR UMA CONTA
- Preencha os campos Nome, CPF e Senha e clique em CRIAR
```

#### ACESSANDO O SISTEMA

```
- De volta à tela inicial informe o CPF e a Senha e clique em ACESSAR
```

#### EFETUANDO UM LANÇAMENTO

```
- Na tela principal clique no botão Novo Lançamento
- Na tela Lançamento (NF) selecione CPF ou CNPJ do contribuinte, preencha os campos solicitados e clique em SALVAR
```

<br>
        O sistema retornará à tela principal mostrando a conta criada na Blockchain para aquele CPF/CNPJ (criação automática) e os respectivos dados lançados.
<br><br>
A conta criada é única para cada CPF/CNPJ informado no lançamento, garantindo assim que quaisquer créditos lançados para o CPF/CNPJ informado serão atribuídos à sua respectiva conta, independentemente de quantos lançamentos ou quais tipos de documentos fiscais sejam realizados.
<br><br>
A conta criada será acessada no módulo CONTRIBUINTE utilizando o CPF/CNPJ utilizado na criação.

#### Para navegar no módulo CONTRIBUINTE:

```
- Após os lançamentos serem efetuados é possível navegar pelas contas dos contribuintes.
```

#### VISUALIZANDO AS INFORMAÇÕES NO MÓDULO CONTRIBUINTE

```
- Na tela inicial selecione CONTRIBUINTE
- Na tela seguinte selecione CPF ou CNPJ e informe o número e clique em ACESSAR
```

<br>
        Se tiver algum lançamento para o número informado o sistema apresentará as informações, se não, informará que este contribuinte não está cadastrado
<br><br>
        Uma vez tendo uma conta cadastrada para o CPF/CNPJ informado (cadastro feito pelo módulo AUDITOR automaticamente) o sistema apresentará a tela "Informações da sua conta(Crédito) com o saldo disponível, a lista de lançamentos com os respectivos valores e os números dos bilhetes para participação no sorteio do Nota Legal e, também, o botão "Usar Crédito"

#### USAR CRÉDITO

O sistema está programado para utilização total do crédito.<br>

```
- Ao clicar no botão "Usar Crédito" o sistema solicita que informe a destinação do crédito (IPTU,IPVA ou CONTA CORRENTE)
- Clique em OK
- O sistema apresentará na tela o registro da utilização dos créditos e o saldo disponível atualizado
```
