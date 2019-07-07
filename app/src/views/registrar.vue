
<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="info">
                <v-toolbar-title>{{ $t('label.titulo_registar') }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field id="nome" type="text" v-model="form.data.nome" :rules="[rules.required]" maxlength="30">
                    <template slot="label">{{ $t('label.nome') }}</template>
                  </v-text-field>
                  <v-text-field mask="###.###.###-##" id="cpf" type="text" v-model="form.data.cpf" :rules="[rules.required]" maxlength="14">
                    <template slot="label">{{ $t('label.cpf') }}</template>
                  </v-text-field>
                  <v-text-field id="senha" v-model="form.data.senha" :rules="[rules.required, rules.counter]" maxlength="8" :append-icon="isVisibled ? 'visibility_off' : 'visibility'" :type="isVisibled ? 'text' : 'password'" @click:append="isVisibled = !isVisibled">
                    <template slot="label">{{ $t('login.senha') }}</template>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn to="/login" right small flat color="info">{{ $t('label.voltar') }}</v-btn>
                <v-btn color="success" @click="salvar">{{ $t('label.criar') }}</v-btn>
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
import { nova, registrar, desbloquear, transferir } from '@/api/conta'
import i18n from '@/i18n'

export default {
  name: 'Registrar',
  data: () => ({
    isVisibled: false,
    rules: {
      required: value => !!value || i18n.t('erro.obrigatorio'),
      counter: value => value.length >= 6 || i18n.t('erro.min_caractere_6')
    },
    form: {
      data: {
        nome: '',
        cpf: '',
        senha: '',
        address: null
      }
    }
  }),
  methods: {
    salvar() {
      if (this.$refs.form.validate()) {

        this.splash()
       
        // chama a função que cria a conta(endereco)
        nova(this.form.data).then(response => {

          if (response.status == 200) {
            
            // adiciona o endereco criado no objeto data
            this.form.data.address = response.data.result

            // registra o endereço no parity
            registrar(this.form.data).then(response => {

              if (response.status == 200) {

                desbloquear(this.form.data).then(response => {
                  if (response) {
                    transferir(this.form.data).then(response => {
                      
                      if (response) {
                      
                      // cria o novo usuario para acesso.
                        this.$store.dispatch("criar_usuario", this.form.data).then(response => {
                        
                          if (response.status == 200) {
                            swal(i18n.t("message.title"), i18n.t("message.create"), "success", { closeOnEsc: false, buttons: false,
                            timer: 2000 }).then(() => {
                              this.$router.push({ path: '/login' });
                            });
                          } else {
                            this.splash()
                            swal(i18n.t("erro.title"), i18n.t("erro.conta"), "error", { closeOnEsc: false });
                          } // end iF response;
                        
                        }).catch(() => {
                          this.splash()
                          swal(i18n.t("erro.title"), i18n.t("erro.conta"), "error", { closeOnEsc: false });
                        });

                      } // end iF response;
                    
                    }).catch(() => {
                      this.splash()
                      swal(i18n.t("erro.title"), 'Não foi possível efetuar a transferencia.', "error", { closeOnEsc: false });    
                    });

                  } // end iF response;

                }).catch(() => {
                  this.splash()
                  swal(i18n.t("erro.title"), 'Não foi possível desbloquear a conta.', "error", { closeOnEsc: false });    
                });
          
              } else {
                this.splash()
                swal(i18n.t("erro.title"), i18n.t("erro.registrar"), "error", { closeOnEsc: false });  
              }
          
            }).catch(() => {
              this.splash()
              swal(i18n.t("erro.title"), i18n.t("erro.registrar"), "error", { closeOnEsc: false });
            });
          
          } else {
            this.splash()
            swal(i18n.t("erro.title"), i18n.t("erro.conta"), "error", { closeOnEsc: false });
          } // end iF

        }).catch(() => {
          this.splash()
          swal(i18n.t("erro.title"), i18n.t("erro.conta"), "error", { closeOnEsc: false });
        });

      } // end iF;
    }
  }
}
</script>
