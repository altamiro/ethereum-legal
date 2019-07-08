<template>
  <v-container fluid fill-height>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            {{ $t('label.nota_fiscal') }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Pesquisar"
              single-line
              hide-details
            ></v-text-field>
            <b-btn
              class="btn-shadow d-inline-flex align-items-center btn btn-primary p-2"
              variant="primary"
              @click="add"
            >Lançar Compra</b-btn>
            <!-- /b-btn -->
          </v-card-title>
          <v-data-table :headers="headers" :items="desserts" :search="search">
            <template v-slot:items="props">
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.data_compra }}</td>
              <td>{{ props.item.valor_compra }}</td>
              <td>{{ props.item.valor_tributo }}</td>
              <td>{{ props.item.valor_credito }}</td>
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

      <v-dialog v-if="dialog" v-model="dialog" persistent max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline strong text-primary">Lançamento (NF)</span>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-form ref="form">
              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-12">
                    <div class="position-relative form-group">
                      <v-select label="Tipo de Nota Fiscal" placeholder="Tipo de Nota Fiscal" v-model="form.data.tipo" :items="form.imposto" item-text="text" item-value="value" :rules="[() => !!form.data.data_nota || label.obrigatorio]" required></v-select>
                    </div>
                  </div>
                </div>
              </v-flex>
              <!-- /v-flex -->

              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-12">
                    <div class="position-relative form-group">
                      <v-text-field type="text" mask="##/##/####" v-model="form.data.data_nota" :rules="[() => !!form.data.data_nota || label.obrigatorio]" label="Data da Nota Fiscal" placeholder="Data da Nota Fiscal" required></v-text-field>
                    </div>
                  </div>
                </div>
              </v-flex>
              <!-- /v-flex -->

              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-12">
                    <div class="position-relative form-group">
                      <v-text-field type="text" v-model="form.data.valor_nota" :rules="[() => !!form.data.valor_nota || label.obrigatorio]" label="Valor da Nota Fiscal" placeholder="Valor da Nota Fiscal" required></v-text-field>
                    </div>
                  </div>
                </div>
              </v-flex>
              <!-- /v-flex -->

              <v-flex xs12>
                <div class="form-row">
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-text-field type="text" v-model="form.data.valor_trubito" :rules="[() => !!form.data.valor_trubito || label.obrigatorio]" label="Tributo (18%)" placeholder="Tributo (18%)" required></v-text-field>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="position-relative form-group">
                      <v-text-field type="text" v-model="form.data.valor_credito" :rules="[() => !!form.data.valor_credito || label.obrigatorio]" label="Crédito (ICMS: 7.5 / ISS: 1.5)" placeholder="Crédito (ICMS: 7.5 / ISS: 1.5)" required></v-text-field>
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
import i18n from "@/i18n";

export default {
  name: "NotaFiscal",
  data() {
    return {
      label: {
        obrigatorio: i18n.t('erro.obrigatorio'),
      },
      dialog: false,
      form: {
        imposto: [
          { text: i18n.t('label.icms'), value: 'icms' },
          { text: i18n.t('label.iss'), value: 'iss' },
        ],
        add_novo: false,
        data: {
          tipo: null,
          data_nota: null,
          valor_nota: null,
        }
      },
      search: "",
      headers: [
        { text: "Tipo", value: "tipo" },
        { text: "Data da Compra", value: "data_compra" },
        { text: "Valor da Compra", value: "valor_compra" },
        { text: "Valor do Tributo", value: "valor_tributo" },
        { text: "Valor do Credito", value: "valor_credito" }
      ],
      desserts: [
        {
          tipo: "Documento Fiscal",
          data_compra: "01/02/2019",
          valor_compra: 128.0,
          valor_tributo: 15.6,
          valor_credito: 1.5
        },
        {
          tipo: "Nota de Serviço",
          data_compra: "15/02/2019",
          valor_compra: 20.0,
          valor_tributo: 10.6,
          valor_credito: 0.5
        }
      ]
    };
  },
  methods: {
    add() {
      this.dialog = true;
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
        console.log('asdasdasd')
      } // end this.$refs.form.validate
    },
  }
};
</script>