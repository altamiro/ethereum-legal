import Vue from "vue";
import Vuex from "vuex";
import nota_legal from "@/api/nota_legal";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sidebar: true,
    loading: false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar = !state.sidebar;
    },
    CLOSE_SIDEBAR: state => {
      state.sidebar = false;
    },
    TOGGLE_LOADING: state => {
      state.loading = !state.loading;
    },
    CLOSE_LOADING: state => {
      state.loading = false;
    },
    updateSidebar(state, payload) {
      state.sidebar = payload;
    }
  },
  actions: {
    criar_auditor(context, data) {
      return new Promise((resolve, reject) => {
        nota_legal.methods
          .criar_auditor(data.address, data.nome, data.cpf)
          .send({ from: data.address, gas: 3000000 })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    listar_auditor(context, data) {
      return new Promise((resolve, reject) => {
        nota_legal.methods
          .listar_auditor(data.address)
          .call({ from: data.address, gas: 3000000 })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    criar_contribuinte(context, data) {
      return new Promise((resolve, reject) => {
        nota_legal.methods
          .criar_contribuinte(data.address, data.cpf_cnpj)
          .send({ from: data.address, gas: 3000000 })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    atualizar_contribuinte(context, data) {
      return new Promise((resolve, reject) => {
        nota_legal.methods
          .atualizar_contribuinte(
            data.address,
            data.credito,
            data.indicacao,
            data.utilizado
          )
          .send({ from: data.address, gas: 3000000 })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    listar_contribuinte(context, data) {
      return new Promise((resolve, reject) => {
        nota_legal.methods
          .listar_contribuinte(data.address)
          .call({ from: data.address, gas: 3000000 })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    adicionar_compra(context, data) {
      return new Promise((resolve, reject) => {
        nota_legal.methods
          .adicionar_compra(
            data.contribuinte_address,
            data.tipo,
            data.data,
            data.valor,
            data.tributo,
            data.credito,
            data.bilhete
          )
          .send({ from: data.address, gas: 3000000 })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    listar_compras(context, data) {
      return new Promise((resolve, reject) => {
        nota_legal.methods
          .listar_compras()
          .call({ from: data.address, gas: 3000000 })
          .then(response => {
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
    loading: state => state.loading
  }
});
