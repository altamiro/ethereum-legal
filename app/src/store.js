import Vue from 'vue'
import Vuex from 'vuex'
import nota_legal from '@/api/nota_legal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebar: true,
    loading: false,
  },
  mutations: {
    TOGGLE_SIDEBAR: (state) => {
      state.sidebar = !state.sidebar;
    },
    CLOSE_SIDEBAR: (state) => {
      state.sidebar = false;
    },
    TOGGLE_LOADING: (state) => {
      state.loading = !state.loading;
    },
    CLOSE_LOADING: (state) => {
      state.loading = false;
    },
    updateSidebar(state, payload) {
      state.sidebar = payload;
    }
  },
  actions: {
    criar_usuario(context, data){
      return new Promise((resolve, reject) => {
        nota_legal.methods.criar_usuario(data.address, data.nome, data.cpf, data.senha).send({ from: data.address, gas: 3000000 }).then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    }
  },
  getters: {
    sidebar: state => state.sidebar,
    loading: state => state.loading,
  }
})
