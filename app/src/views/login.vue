
<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{ $t('login.title') }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field mask="###.###.###-##" id="cpf" type="text" prepend-icon="person" v-model="form.data.cpf" :rules="[rules.required]" maxlength="14">
                    <template slot="label">{{ $t('label.cpf') }}</template>
                  </v-text-field>
                  <v-text-field id="senha" prepend-icon="lock" v-model="form.data.senha" :rules="[rules.required, rules.counter]" maxlength="8" :append-icon="isVisibled ? 'visibility_off' : 'visibility'" :type="isVisibled ? 'text' : 'password'" @click:append="isVisibled = !isVisibled">
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

import i18n from '@/i18n'
import constant from "@/api/constant";


export default {
  name: 'Login',
  data: () => ({
    isVisibled: false,
    rules: {
      required: value => !!value || i18n.t('erro.obrigatorio'),
      counter: value => value.length >= 6 || i18n.t('erro.min_caractere_6')
    },
    form: {
      data: {
        cpf: '',
        senha: ''
      }
    }
  }),
  methods: {
    acessar() {
      if (this.$refs.form.validate()) {
        console.log(constant.contratoAbi)
      }
    }
  }
}
</script>
