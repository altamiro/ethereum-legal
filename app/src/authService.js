import { mascaraCpf, mascaraCnpj } from './utils'

const localStorageKey = "loggedIn";

class AuthService {
  localLogin(authResult) {
    localStorage.setItem(localStorageKey, "true");
    let descricao = ''
    let cpf_cnpj = ''

    if (authResult.tipo == "auditor") {
      descricao = "Auditor: " + authResult.nome
    } else {
      cpf_cnpj = authResult.nome.length == 11 ? mascaraCpf(authResult.nome) : mascaraCnpj(authResult.nome)
      descricao = "Contribuinte: " + cpf_cnpj
    }

    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        tipo: authResult.tipo,
        nome: authResult.nome || authResult.cpf,
        descricao: descricao,
        cpf: authResult.cpf,
        senha: authResult.senha,
        address: authResult.address
      })
    );
  }

  logOut() {
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem("userInfo");
  }

  get() {
    return JSON.parse(localStorage.getItem("userInfo"));
  }

  isAuthenticated() {
    return localStorage.getItem(localStorageKey) === "true";
  }
}

export default new AuthService();
