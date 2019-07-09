const localStorageKey = 'loggedIn';

class AuthService {

    localLogin(authResult) {
        localStorage.setItem(localStorageKey, 'true');
        localStorage.setItem('userInfo', JSON.stringify({
            tipo: authResult.tipo,
            nome: authResult.nome,
            descricao: authResult.tipo == 'auditor' ? 'Auditor: ' + authResult.nome : 'Contribuinte: ' + authResult.nome,
            cpf: authResult.cpf,
            senha: authResult.senha,
            address: authResult.address
        }));
    }

    logOut() {
        localStorage.removeItem(localStorageKey);
        localStorage.removeItem('userInfo');
    }

    get() {
        return JSON.parse(localStorage.getItem('userInfo'));
    }

    isAuthenticated() {
        return (localStorage.getItem(localStorageKey) === 'true');
    }
}

export default new AuthService();


