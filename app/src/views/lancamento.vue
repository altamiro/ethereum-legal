<template>
  <v-container fluid fill-height grid-list-xl>
    <v-layout row wrap>


    <v-flex xs12 v-if="tipo_acesso == 'contribuinte'">
      <v-card>
        <v-card-title class="secondary">
          <span class="headline white--text">Informações da sua conta (Crédito)</span>
        </v-card-title>

        <v-list>

          <v-list-tile>

            <v-list-tile-action>
              <span class="text-success">Disponível: &nbsp;&nbsp;&nbsp;</span>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                <span class="text-secondary strong">R$ {{ dados_contribuinte.credito }}</span>
              </v-list-tile-title>
            </v-list-tile-content>
    
            <v-list-tile-action v-if="dados_contribuinte.credito != '0.00'">
              <b-btn class="btn-shadow d-inline-flex align-items-center btn btn-success p-2"
              variant="success" @click="usar_credito"
              >Usar Crédito</b-btn>
            </v-list-tile-action>

          </v-list-tile>
          
          <v-divider v-if="dados_contribuinte.utilizado.length > 0"></v-divider>

          <v-list-tile v-if="dados_contribuinte.utilizado.length > 0">
  
            <v-list-tile-action>
            <span class="text-danger">Utilizado: &nbsp;&nbsp;&nbsp;</span>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                <span class="text-secondary strong">R$ {{ dados_contribuinte.utilizado }}</span>
              </v-list-tile-title>
            </v-list-tile-content>
    
            <v-list-tile-content>
              <v-list-tile-title>
              <span class="text-danger">{{ dados_contribuinte.indicacao }}</span>
              </v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>

        </v-list>
      </v-card>
    </v-flex>


      <v-flex xs12>
        <v-card>
          <v-card-title>
            <span class="text-primary strong">{{ $t('label.lancamento') }} </span>
            <v-spacer></v-spacer>
            <b-btn v-if="tipo_acesso == 'auditor'"
              class="btn-shadow d-inline-flex align-items-center btn btn-primary p-2"
              variant="primary"
              @click="add"
            >Novo Lançamento</b-btn>
            <!-- /b-btn -->
            &nbsp;&nbsp;&nbsp;&nbsp;
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Pesquisar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" :headers="columns" :items="row" :search="search">
            <template v-slot:items="props">
              <td>{{ props.item.conta }}</td>
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.data }}</td>
              <td class="text-xs-right">{{ props.item.valor }}</td>
              <td class="text-xs-right">{{ props.item.tributo }}</td>
              <td class="text-xs-right">{{ props.item.credito }}</td>
              <td v-if="tipo_acesso == 'contribuinte'">{{ props.item.bilhete }}</td>
            </template>
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
              >Your search for "{{ search }}" found no results.</v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
      <!-- /v-flex -->

      <v-flex xs12>
        <v-card>
          <v-card-title class="secondary">
            <span class="headline white--text">Gráfico</span>
          </v-card-title>
          <v-card-text>
            <graficos></graficos>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-dialog v-if="dialog" v-model="dialog" persistent max-width="70%">
        <v-card>
          <v-card-title>
            <span class="headline strong text-primary">Lançamento (NF)</span>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-form ref="form">
              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-radio-group v-model="radio" row>
                        <v-radio :label="label.cpf" value="cpf"></v-radio>
                        <v-radio :label="label.cnpj" value="cnpj"></v-radio>
                      </v-radio-group>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-text-field
                        v-if="radio == 'cpf'"
                        mask="###.###.###-##"
                        id="cpf_cnpj"
                        type="text"
                        v-model="form.data.cpf_cnpj"
                        :rules="[() => !!form.data.cpf_cnpj || label.obrigatorio]"
                        maxlength="14"
                        label="Contribuinte (CPF)"
                        placeholder="Contribuinte (CPF)"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-else
                        mask="##.###.###/####-##"
                        id="cpf_cnpj"
                        type="text"
                        v-model="form.data.cpf_cnpj"
                        :rules="[() => !!form.data.cpf_cnpj || label.obrigatorio]"
                        maxlength="18"
                        label="Contribuinte (CNPJ)"
                        placeholder="Contribuinte (CNPJ)"
                        required
                      ></v-text-field>
                    </div>
                  </div>
                </div>
              </v-flex>
              <!-- /v-flex -->

              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-select
                        label="Tipo de Nota Fiscal"
                        @change="calcular"
                        placeholder="Tipo de Nota Fiscal"
                        v-model="form.data.tipo"
                        :items="form.imposto"
                        item-text="text"
                        item-value="value"
                        :rules="[() => !!form.data.tipo || label.obrigatorio]"
                        required
                      ></v-select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-text-field
                        type="text"
                        return-masked-value
                        mask="##/##/####"
                        v-model="form.data.data"
                        :rules="[() => !!form.data.data || label.obrigatorio]"
                        label="Data da Nota Fiscal"
                        placeholder="Data da Nota Fiscal"
                        required
                      ></v-text-field>
                    </div>
                  </div>
                </div>
              </v-flex>
              <!-- /v-flex -->

              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-12">
                    <div class="position-relative form-group">
                      <v-text-field
                        type="text"
                        v-on:keyup="formatarValor"
                        v-model="form.data.valor"
                        :rules="[() => !!form.data.valor || label.obrigatorio]"
                        label="Valor da Nota Fiscal"
                        placeholder="Valor da Nota Fiscal"
                        required
                      ></v-text-field>
                    </div>
                  </div>
                </div>
              </v-flex>
              <!-- /v-flex -->

              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-text-field
                        type="text"
                        readonly
                        v-model="form.data.tributo"
                        :rules="[() => !!form.data.tributo || label.obrigatorio]"
                        label="Valor do Tributo (ICMS: 18% / ISS: 5%)"
                        placeholder="Valor do Tributo (ICMS: 18% / ISS: 5%)"
                        required
                      ></v-text-field>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-text-field
                        type="text"
                        readonly
                        v-model="form.data.credito"
                        :rules="[() => !!form.data.credito || label.obrigatorio]"
                        label="Valor do Crédito (ICMS: 7.5% / ISS: 1.5%)"
                        placeholder="Valor do Crédito (ICMS: 7.5% / ISS: 1.5%)"
                        required
                      ></v-text-field>
                    </div>
                  </div>
                </div>
              </v-flex>
              <!-- /v-flex -->
            </v-form>
            <!-- /v-form -->
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <b-btn
              class="btn-shadow d-inline-flex align-items-center btn btn-success p-2"
              variant="success"
              size="lg"
              @click="save_close"
            >Salvar</b-btn>&nbsp;&nbsp;&nbsp;
            <b-btn
              class="btn-shadow d-inline-flex align-items-center btn btn-primary p-2"
              variant="primary"
              size="lg"
              @click="save_add"
            >Salvar e adicionar outro(a)</b-btn>&nbsp;&nbsp;&nbsp;
            <b-btn
              class="btn-shadow d-inline-flex align-items-center btn btn-link p-2"
              variant="link"
              size="lg"
              @click="close"
            >Cancelar</b-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- /v-layout -->
  </v-container>
  <!-- /v-container -->
</template>
<!-- /template -->

<script>
import swal from "sweetalert";
import auth from "@/authService";
import { desbloquear } from "@/api/conta";
import { validar } from "@/api/contribuinte";
import i18n from "@/i18n";

import Graficos from "./components/Graficos";

export default {
  name: "NotaFiscal",
  components: {
    'graficos': Graficos
  },
  data() {
    return {
      label: {
        cpf: i18n.t("label.cpf"),
        cnpj: i18n.t("label.cnpj"),
        obrigatorio: i18n.t("erro.obrigatorio")
      },
      dados_contribuinte: {
        credito: '',
        indicacao: '',
        utilizado: '',
      },
      dialog: false,
      radio: "cpf",
      form: {
        imposto: [
          { text: i18n.t("label.icms"), value: "icms" },
          { text: i18n.t("label.iss"), value: "iss" }
        ],
        add_novo: false,
        data: {
          cpf_cnpj: "",
          contribuinte_address: null,
          tipo: "icms",
          data: null,
          valor: null,
          tributo: null,
          credito: null,
          bilhete: null,
          senha: null,
          address: null
        }
      },
      pagination: {
        rowsPerPage: 20
      },
      rowsPerPageItems: [20,30,40,50,{"text":"Todos","value":-1}],
      search: "",
      columns: [
        { text: "Conta", value: "conta" },
        { text: "Tipo", value: "tipo" },
        { text: "DT. Compra", value: "data" },
        { text: "Vlr. Compra", value: "valor", align: 'right' },
        { text: "Vlr. Tributo", value: "tributo", align: 'right' },
        { text: "Vlr. Crédito", value: "credito", align: 'right' }
      ],
      row: []
    };
  },
  computed: {
    tipo_acesso() {
      return auth.get().tipo;
    }
  },
  watch: {
    "form.data.valor": function(newVal) {
      if (newVal != null && newVal.length > 0) {
        let valor = parseInt(newVal);
        if (this.form.data.tipo == "icms") {
          this.form.data.tributo = ((valor * 18) / 100).toFixed(2);
          this.form.data.credito = ((valor * 7.5) / 100).toFixed(2);
        } else {
          this.form.data.tributo = ((valor * 5) / 100).toFixed(2);
          this.form.data.credito = ((valor * 1.5) / 100).toFixed(2);
        } // end iF;
      } else {
        this.form.data.tributo = null;
        this.form.data.credito = null;
      } // end iF;
    }
  },
  mounted() {
    this.get();
    this.get_contribuinte();
  },
  methods: {
    formatarValor() {
      if (this.form.data.valor != null) {
        this.form.data.valor = this.form.data.valor.replace(/\D/g, "");
        this.form.data.valor = this.form.data.valor.replace(
          /(\d)(\d{2})$/,
          "$1.$2"
        );
      } // end iF.
    },
    calcular() {
      if (this.form.data.valor != null) {
        let valor = parseInt(this.form.data.valor);
        if (this.form.data.tipo == "icms") {
          this.form.data.tributo = ((valor * 18) / 100).toFixed(2);
          this.form.data.credito = ((valor * 7.5) / 100).toFixed(2);
        } else {
          this.form.data.tributo = ((valor * 5) / 100).toFixed(2);
          this.form.data.credito = ((valor * 1.5) / 100).toFixed(2);
        } // end iF;
      } // end iF;
    },

    add() {
      this.dialog = true;
    },
    reload() {
      this.close()
      this.form.data = {
        cpf_cnpj: "",
        contribuinte_address: null,
        tipo: "icms",
        data: null,
        valor: null,
        tributo: null,
        credito: null,
        bilhete: null,
        senha: null,
        address: null
      }
    },
    close() {
      this.dialog = false;
    },
    save_add() {
      this.form.add_novo = true;
      this.save();
    },
    save_close() {
      this.form.add_novo = false;
      this.save();
    },
    save() {
      if (this.$refs.form.validate()) {
        this.$store.commit('TOGGLE_LOADING');
        this.form.data.address = auth.get().address;
        this.form.data.senha = auth.get().senha;
        this.form.data.bilhete = Date.now()
          .toString()
          .substring(
            Date.now().toString().length,
            Date.now().toString().length - 6
          );

        validar(this.form.data)
          .then(data => {
            this.form.data.contribuinte_address = data.address;
            desbloquear(this.form.data)
              .then(response => {
                if (response) {
                  this.$store
                    .dispatch("adicionar_compra", this.form.data)
                    .then(() => {
                      this.$store.commit('CLOSE_LOADING');
                      swal(i18n.t("message.title"), 'Lançamento do contribuinte, efetuado com sucesso.', "success", { closeOnEsc: false, buttons: false,
                      timer: 2000 }).then(() => {
                        this.get()
                        this.reload()
                        if (this.form.add_novo) {
                          this.dialog = true;
                        }
                      });
                    })
                    .catch(error => {
                      console.log(error)
                      this.$store.commit('CLOSE_LOADING');
                      swal(
                        i18n.t("erro.title"),
                        "Não foi possível efetuar esse lançamento. Favor verificar!",
                        "error",
                        { closeOnEsc: false }
                      );
                    });
                } // end iF response;
              })
              .catch(error => {
                console.log(error)
                this.$store.commit('CLOSE_LOADING');
                swal(
                  i18n.t("erro.title"),
                  "Não foi possível desbloquear sua conta. Favor verificar!",
                  "error",
                  { closeOnEsc: false }
                );
              });
          })
          .catch(error => {
            console.log(error)
            this.$store.commit('CLOSE_LOADING');
            swal(
              i18n.t("erro.title"),
              "Não foi possível efetuar esse lançamento. Favor verificar!",
              "error",
              { closeOnEsc: false }
            );
          });
      } // end this.$refs.form.validate
    },
    get_contribuinte() {
      this.form.data.address = auth.get().address;
      this.form.data.senha = auth.get().senha;
      if (auth.get().tipo == 'contribuinte') {
        this.$store.dispatch("listar_contribuinte", this.form.data).then(response => {
          this.dados_contribuinte.credito = response.credito
          this.dados_contribuinte.indicacao = response.indicacao
          this.dados_contribuinte.utilizado = response.utilizado != 'NaN' ? response.utilizado : ''
        }).catch(error => {
          console.log(error)
          swal(
            i18n.t("erro.title"),
            "Ocorreu um erro ao carregar as informações do contribuinte.",
            "error",
            { closeOnEsc: false }
          );
        })
      } // end iF;
    },
    get() {
      if (auth.get().tipo == 'contribuinte') {
        this.columns.push({ text: "Bilhete", value: "bilhete" })
      } // end iF;
      this.$store.commit('TOGGLE_LOADING');
      this.form.data.address = auth.get().address;
      this.form.data.senha = auth.get().senha;
      this.$store
        .dispatch("listar_compras", this.form.data)
        .then(response => {
          this.$store.commit('CLOSE_LOADING');
          if (response != null) {
            this.row = []
            for (let i = 0; i < response['0'].length; i++) {

              if (auth.get().tipo == 'contribuinte') {
                if (response['0'][i].toLowerCase() === auth.get().address.toLowerCase()) {
                  this.row.push({
                    conta: response['0'][i],
                    tipo: response['1'][i] == 'icms' ? i18n.t("label.icms") : i18n.t("label.iss"),
                    data: response['2'][i],
                    valor: response['3'][i],
                    tributo: response['4'][i],
                    credito: response['5'][i],
                    bilhete: response['6'][i]
                  })  
                } // end iF;

              } else {
                this.row.push({
                  conta: response['0'][i],
                  tipo: response['1'][i] == 'icms' ? i18n.t("label.icms") : i18n.t("label.iss"),
                  data: response['2'][i],
                  valor: response['3'][i],
                  tributo: response['4'][i],
                  credito: response['5'][i]
                })
              } // end iF;
              
            } // end iF
          }
        })
        .catch(error => {
          console.log(error)
          this.$store.commit('CLOSE_LOADING');
          swal(
              i18n.t("erro.title"),
              "Ocorreu um erro ao carregar os lançamentos.",
              "error",
              { closeOnEsc: false }
            );
        });
    },
    usar_credito() {
      const data = {
        address: auth.get().address,
        credito: '0.00',
        indicacao: '',
        utilizado: this.dados_contribuinte.credito
      }

      swal("Informe pra onde vai a indicação desse crédito: R$ " + this.dados_contribuinte.credito, {
        content: "input",
        closeOnEsc: false,
        closeOnClickOutside: false
      })
      .then((value) => {
        if (value != null && value.length > 0) {
          this.$store.commit('TOGGLE_LOADING');
          if (this.dados_contribuinte.utilizado.length > 0) {
            data.indicacao = this.dados_contribuinte.indicacao + ', ' + value
            data.utilizado = (parseFloat(this.dados_contribuinte.utilizado) + parseFloat(data.utilizado)).toFixed(2).toString()
          } else {
            data.indicacao = value
          }
          this.$store.dispatch('atualizar_contribuinte', data).then(() => {
            this.$store.commit('CLOSE_LOADING');
            swal(i18n.t("message.title"), 'Sua indicação foi processada com sucesso.', "success", { closeOnEsc: false, buttons: false,
            timer: 2000 }).then(() => {
              this.get_contribuinte()
            });
          }).catch(error => {
              console.log(error)
            this.$store.commit('CLOSE_LOADING');
            swal(
              i18n.t("erro.title"),
              "Ocorreu um erro ao processar sua indicação. Tente novamente!",
              "error",
              { closeOnEsc: false }
            );
          })
        } else {
          this.$store.commit('CLOSE_LOADING');
          swal("Aviso", "Você precisa informar a indicação", "warning", { closeOnEsc: false });
        }
      });
    }
  }
};
</script>

