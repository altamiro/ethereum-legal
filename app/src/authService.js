const localStorageKey = 'loggedIn';

class AuthService {

    localLogin(authResult) {
        localStorage.setItem(localStorageKey, 'true');
        localStorage.setItem('userInfo', JSON.stringify({
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


