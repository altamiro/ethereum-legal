const localStorageKey = 'loggedIn';

class AuthService {

    localLogin(authResult) {
        localStorage.setItem(localStorageKey, 'true');
        // localStorage.setItem('userInfo', JSON.stringify({
        //     displayName: this.profile.name,
        //     email: this.profile.email,
        //     photoURL: this.profile.picture,
        //     providerId: this.profile.sub.substr(0, this.profile.sub.indexOf('|')),
        //     uid: this.profile.sub
        // }));
    }

    logOut() {
        localStorage.removeItem(localStorageKey);
        localStorage.removeItem('userInfo');
    }

    isAuthenticated() {
        return (localStorage.getItem(localStorageKey) != (null || undefined) && localStorage.getItem(localStorageKey) === 'true');
    }
}

export default new AuthService();


