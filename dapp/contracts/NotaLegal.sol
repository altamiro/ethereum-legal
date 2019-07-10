pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract NotaLegal {

    // evento para notificar o cliente que o auditor foi criado
    event auditorRegistrado(address _addr, string message);
    // evento para notificar o cliente que o contribuinte foi criado
    event contribuinteRegistrado(address _addr, string message);
    // evento para notificar o cliente que a compra foi registrada
    event compraRegistrado(uint id);

    // estrutura para manter dados do Auditor
    struct Auditor {
        string nome; // nome do auditor
        string cpf; // cpf do auditor (o mesmo usado para criar a conta na rede)
    }

    // estrutura para manter dados do Contribuinte
    struct Contribuinte {
        string cpf_cnpj; // cpf ou cnpj do contribuinte (o mesmo usado para criar a conta na rede)
        string credito; // valor do credito recebido
        string indicacao; // descrição da indicação para usar o credito
        string utilizado; // valor do utilizado na indicação
    }

    struct Compra {
        uint id; // id gerado automaticamente
        address contribuinteOwner; // endereço da conta do contribuinte
        string tipo; // tipo da compra. (ICMS ou ISS)
        string data; // data da compra
        string valor; // valor da compra
        string tributo; // valor do tributo calculado
        string credito; // valor do credito calculado
        string bilhete; // numero do bilhete gerado para essa compra
        address auditorOwner; // endereço da conta do auditor
    }

    // mapeia endereço do Auditor a sua estrutura
    mapping (address => Auditor) auditores;

    // mapeia endereço do Contribuinte a sua estrutura
    mapping (address => Contribuinte) contribuintes;

    // mapeia um id a uma compra
    mapping (uint => Compra) compras;
    uint[] public comprasIds;

    // seta variaveis
    uint256 private compraId = 0;

    // função para cadastrar auditor
    function criar_auditor(address _addr, string memory _nome, string memory _cpf) public {
        Auditor storage auditor = auditores[_addr];
        auditor.nome = _nome;
        auditor.cpf = _cpf;

        // notifica o cliente através do evento
        emit auditorRegistrado(_addr, "Auditor criado com sucesso!");
    }

    // função para resgatar dados
    function listar_auditor(address _addr) public view returns(Auditor memory) {
        Auditor memory auditor = auditores[_addr];
        return auditor;
    }

    // função para cadastrar contribuinte
    function criar_contribuinte(address _addr, string memory _cpf_cnpj, string memory _credito) public {
        Contribuinte storage contribuinte = contribuintes[_addr];
        contribuinte.cpf_cnpj = _cpf_cnpj;
        contribuinte.credito = _credito;

        // notifica o cliente através do evento
        emit contribuinteRegistrado(_addr, "Contribuinte criado com sucesso!");
    }

    function atualizar_contribuinte(address _addr, string memory _credito, string memory _indicacao, string memory _utilizado) public {
        Contribuinte storage contribuinte = contribuintes[_addr];
        contribuinte.credito = _credito;
        contribuinte.indicacao = _indicacao;
        contribuinte.utilizado = _utilizado;

        // notifica o cliente através do evento
        emit contribuinteRegistrado(_addr, "Contribuinte atualizado com sucesso!");
    }

    // função para resgatar dados
    function listar_contribuinte(address _addr) public view returns(Contribuinte memory) {
        Contribuinte memory contribuinte = contribuintes[_addr];
        return contribuinte;
    }

    // função para cadastrar uma compra
    function adicionar_compra(address _addr, string memory _tipo, string memory _data, string memory _valor, string memory _tributo, string memory _credito, string memory _bilhete) public {
        compras[compraId] = Compra(compraId, _addr, _tipo, _data, _valor, _tributo, _credito, _bilhete, msg.sender);
        comprasIds.push(compraId);
        compraId++;
        emit compraRegistrado(compraId);
    }

    // função para resgatar info de uma compra
    function compra_info(uint _id) public view returns(address contribuinte, string memory tipo, string memory data, string memory valor, string memory tributo, string memory credito, string memory bilhete) {
        Compra memory compra = compras[_id];

        return (
            compra.contribuinteOwner,
            compra.tipo,
            compra.data,
            compra.valor,
            compra.tributo,
            compra.credito,
            compra.bilhete
        );
    }

    // função que retorna todos as compras de um usuário
    function listar_compras() public view returns(address[] memory, string[] memory, string[] memory, string[] memory, string[] memory, string[] memory, string[] memory) {

        uint[] memory ids = comprasIds;

        // uint[] memory idsCompras = new uint[](ids.length);
        address[] memory contribuinteOwners = new address[](ids.length);
        string[] memory tipos = new string[](ids.length);
        string[] memory datas = new string[](ids.length);
        string[] memory valores = new string[](ids.length);
        string[] memory tributos = new string[](ids.length);
        string[] memory creditos = new string[](ids.length);
        string[] memory bilhetes = new string[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (contribuinteOwners[i], tipos[i], datas[i], valores[i], tributos[i], creditos[i], bilhetes[i]) = compra_info(i);
        }

        return (contribuinteOwners, tipos, datas, valores, tributos, creditos, bilhetes);
    }

}

