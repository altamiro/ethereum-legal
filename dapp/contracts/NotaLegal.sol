pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract NotaLegal {

    // evento para notificar o cliente que a conta foi atualizada
    event usuarioRegistrado(address _addr, string message);
    // evento para notificar o cliente que a compra foi registrada
    event compraRegistrado(uint id);

    // estrutura para manter dados do usuário
    struct Usuario {
        string nome;
        string cpf;
        string senha;
    }

    struct Compra {
        uint id;
        string tipo;
        string data;
        uint valor;
        uint tributo;
        uint credito;
        address usuario;
    }

    // mapeia endereço do usuário a sua estrutura
    mapping (address => Usuario) usuarios;

    // mapeia um id a uma compra
    mapping (uint => Compra) compras;
    uint[] public comprasIds;

    // seta variaveis
    uint256 private compraId = 0;

    // função para cadastrar conta do usuário
    function criar_usuario(address _addr, string memory _nome, string memory _cpf, string memory _senha) public {
        Usuario storage usuario = usuarios[_addr];
        usuario.nome = _nome;
        usuario.cpf = _cpf;
        usuario.senha = _senha;

        // notifica o cliente através do evento
        emit usuarioRegistrado(_addr, "Conta criada com sucesso!");
    }

    // função para resgatar dados do usuário
    function listar_usuario(address _addr) public view returns(Usuario memory) {
        Usuario memory usuario = usuarios[_addr];
        return usuario;
    }

    // função para cadastrar uma compra
    function adicionar_compra(string memory _tipo, string memory _data, uint _valor, uint _tributo, uint _credito) public {
        compras[compraId] = Compra(compraId, _tipo, _data, _valor, _tributo, _credito, msg.sender);
        comprasIds.push(compraId);
        compraId++;
        emit compraRegistrado(compraId);
    }

    // função para resgatar info de um produto
    function compraInfo(uint _id) public view returns(uint, string memory, string memory, uint, uint, uint, address) {
        Compra memory compra = compras[_id];

        return (
            compra.id,
            compra.tipo,
            compra.data,
            compra.valor,
            compra.tributo,
            compra.credito,
            compra.usuario
        );
    }

    // função que retorna todos os produtos de um usuário
    function getCompras() public view returns(uint[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, uint[] memory, address[] memory) {

        uint[] memory ids = comprasIds;

        uint[] memory idsCompras = new uint[](ids.length);
        string[] memory tipos = new string[](ids.length);
        string[] memory datas = new string[](ids.length);
        uint[] memory valores = new uint[](ids.length);
        uint[] memory tributos = new uint[](ids.length);
        uint[] memory creditos = new uint[](ids.length);
        address[] memory owners = new address[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (idsCompras[i], tipos[i], datas[i], valores[i], tributos[i], creditos[i], owners[i]) = compraInfo(i);
        }

        return (idsCompras, tipos, datas, valores, tributos, creditos, owners);
    }

}

