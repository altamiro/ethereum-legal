
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

                <v-flex xs12>
                  <v-tabs v-model="active" show-arrows>
                    <v-tab key="auditor">Auditor</v-tab>
                    <v-tab key="contribuinte">Contribuinte</v-tab>

                    <v-tabs-items v-model="active">
                      
                      <v-tab-item key="auditor">
                        
                        <v-form ref="formAuditor">
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

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn to="/registrar" right small flat color="info">{{ $t('login.novo_registro') }}</v-btn>
                          <v-btn color="primary" @click="login_auditor">{{ $t('login.acessar') }}</v-btn>
                        </v-card-actions>

                      </v-tab-item>
                      <!-- /v-tab-item auditor -->

                      <v-tab-item key="contribuinte">
                        
                        <v-form ref="formContribuinte">
                        <v-radio-group v-model="radio" row>
                          <v-radio :label="label.cpf" value="cpf"></v-radio>
                          <v-radio :label="label.cnpj" value="cnpj"></v-radio>
                        </v-radio-group>
                        <v-text-field
                            v-if="radio == 'cpf'"
                            mask="###.###.###-##"
                            id="cpf_cnpj"
                            type="text"
                            prepend-icon="person"
                            v-model="form.data.cpf_cnpj"
                            :rules="[rules.required]"
                            maxlength="14"
                          >
                            <template slot="label">{{ $t('label.cpf') }}</template>
                          </v-text-field>
                          <v-text-field
                            v-else 
                            mask="##.###.###/####-##"
                            id="cpf_cnpj"
                            type="text"
                            prepend-icon="person"
                            v-model="form.data.cpf_cnpj"
                            :rules="[rules.required]"
                            maxlength="18"
                          >
                            <template slot="label">{{ $t('label.cnpj') }}</template>
                          </v-text-field>
                        </v-form>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="login_contribuinte">{{ $t('login.acessar') }}</v-btn>
                        </v-card-actions>
                        
                      </v-tab-item>
                      <!-- /v-tab-item contribuinte -->

                    </v-tabs-items>
                    <!-- /v-tabs-items -->
                  </v-tabs>
                  <!-- /v-tabs -->
                </v-flex>
                <!-- /v-flex -->

              </v-card-text>
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
    label: {
      cpf: i18n.t("label.cpf"),
      cnpj: i18n.t("label.cnpj"),
    },
    active: null,
    isVisibled: false,
    rules: {
      required: value => !!value || i18n.t("erro.obrigatorio"),
      counter: value => value.length >= 6 || i18n.t("erro.min_caractere_6")
    },
    radio: 'cpf',
    form: {
      data: {
        tipo: null,
        nome: null,
        cpf: '',
        cpf_cnpj: '',
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
  watch: {
    radio: function (val) {
      this.form.data.cpf_cnpj = ''
    }
  },
  methods: {
    login_auditor() {
      if (this.$refs.formAuditor.validate()) {
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
                swal(i18n.t("erro.title"), msg, "error", { closeOnEsc: false }).then(() => {
                  this.$store.commit('CLOSE_LOADING');
                  this.$router.push({ path: '/registrar' });
                });   
              } else {
                desbloquear(this.form.data).then(response => {
                  if (response) {
                    this.$store.dispatch("listar_auditor", this.form.data).then(response => {
                      this.form.data.tipo = 'auditor'
                      this.form.data.nome = response[0]
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
    }, // end function login_auditor
    login_contribuinte() {
      if (this.$refs.formContribuinte.validate()) {
        this.$store.commit('TOGGLE_LOADING');
        listar_contas()
          .then(response => {
            if (response.status == 200) {
              const result = response.data.result;
              Object.entries(result).forEach(([key, value]) => {
                if (this.form.data.cpf_cnpj.trim() === value.name.trim()) {
                  this.form.data.address = key
                } // end iF;
              });

              if (this.form.data.address == null){
                let msg = 'Não existe esse contribuinte cadastrado: ' + this.form.data.cpf_cnpj;
                swal(i18n.t("erro.title"), msg, "error", { closeOnEsc: false }).then(() => {
                  this.$store.commit('CLOSE_LOADING');
                });   
              } else {
                desbloquear(this.form.data).then(response => {
                  if (response) {
                    this.$store.dispatch("listar_contribuinte", this.form.data).then(response => {
                      this.form.data.tipo = 'contribuinte'
                      this.form.data.nome = this.form.data.cpf_cnpj
                      this.form.data.senha = this.form.data.cpf_cnpj
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
    } // end function login_contribuinte
  }
};
</script>
