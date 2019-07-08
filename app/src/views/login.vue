
<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <div class="text-xs-center">
            <v-dialog v-model="loading" persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  {{ $t('app.logging') }}
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>

          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{ $t('login.title') }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    mask="###.###.###-##"
                    id="cpf"
                    type="text"
                    prepend-icon="person"
                    v-model="form.data.cpf"
                    :rules="[rules.required]"
                    maxlength="14"
                  >
                    <template slot="label">{{ $t('label.cpf') }}</template>
                  </v-text-field>
                  <v-text-field
                    id="senha"
                    prepend-icon="lock"
                    v-model="form.data.senha"
                    :rules="[rules.required, rules.counter]"
                    maxlength="8"
                    :append-icon="isVisibled ? 'visibility_off' : 'visibility'"
                    :type="isVisibled ? 'text' : 'password'"
                    @click:append="isVisibled = !isVisibled"
                  >
                    <template slot="label">{{ $t('login.senha') }}</template>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn to="/registrar" right small flat color="info">{{ $t('login.novo_registro') }}</v-btn>
                <v-btn color="primary" @click="acessar">{{ $t('login.acessar') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import swal from "sweetalert";
import i18n from "@/i18n";
import auth from '@/authService'
import { desbloquear, listar_contas } from "@/api/conta";

export default {
  name: "Login",
  data: () => ({
    isVisibled: false,
    rules: {
      required: value => !!value || i18n.t("erro.obrigatorio"),
      counter: value => value.length >= 6 || i18n.t("erro.min_caractere_6")
    },
    form: {
      data: {
        cpf: '',
        senha: '',
        address: null
      }
    }
  }),
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    acessar() {
      if (this.$refs.form.validate()) {
        this.$store.commit('TOGGLE_LOADING');
        listar_contas()
          .then(response => {
            if (response.status == 200) {
              const result = response.data.result;
              Object.entries(result).forEach(([key, value]) => {
                if (this.form.data.cpf.trim() === value.name.trim()) {
                  this.form.data.address = key
                } // end iF;
              });

              if (this.form.data.address == null){
                let msg = 'Não existe conta cadastrada para esse CPF: ' + this.form.data.cpf + '. Deseja criar uma conta?';
                swal(i18n.t("erro.title"), msg, "error", { closeOnEsc: false }).then((value) => {
                  this.$store.commit('CLOSE_LOADING');
                  this.$router.push({ path: '/registrar' });
                });   
              } else {
                desbloquear(this.form.data).then(response => {
                  if (response) {
                    this.$store.dispatch("listar_usuario", this.form.data).then(response => {
                      this.$store.commit('CLOSE_LOADING');
                      auth.localLogin(this.form.data);
                      this.$router.push({ path: '/' });
                    }).catch(() => {
                      this.$store.commit('CLOSE_LOADING');
                      swal(i18n.t("erro.title"), 'Não foi possível efetuar autentição. Favor verificar!', "error", { closeOnEsc: false });
                    });
                  } // end iF response;
                }).catch(() => {
                  this.$store.commit('CLOSE_LOADING');
                  swal(i18n.t("erro.title"), 'Não foi possível efetuar autentição. Favor verificar!', "error", { closeOnEsc: false });
                });
              } // end iF
            } else {
              this.$store.commit('CLOSE_LOADING');
              swal(i18n.t("erro.title"), 'Não foi possível efetuar autentição. Favor verificar!', "error", { closeOnEsc: false });
            } // end iF;
          })
          .catch(() => {
            this.$store.commit('CLOSE_LOADING');
            swal(i18n.t("erro.title"), 'Não foi possível efetuar autentição. Favor verificar!', "error", { closeOnEsc: false });
          });
      } // end iF;
    }
  }
};
</script>
