pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract NotaLegal {

    // evento para notificar o cliente que a conta foi atualizada
    event usuarioRegistrado(address _addr, string message);

    // estrutura para manter dados do usuário
    struct Usuario {
        string nome;
        string cpf;
        string senha;
    }

    // mapeia endereço do usuário a sua estrutura
    mapping (address => Usuario) usuarios;

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
    function listar_usuario(address _addr) public view returns(string memory nome, string memory cpf) {
        Usuario memory usuario = usuarios[_addr];
        return (usuario.nome, usuario.cpf);
    }

}