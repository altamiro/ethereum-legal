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
            <v-btn color="primary" dark class="mb-2" v-on="on">Lançar Compra</v-btn>
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
    </v-layout>
    <!-- /v-layout -->
  </v-container>
  <!-- /v-container -->
</template>
<!-- /template -->

<script>
export default {
  name: "NotaFiscal",
  data() {
    return {
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
          valor_credito: 1.50
        },
        {
          tipo: "Nota de Serviço",
          data_compra: "15/02/2019",
          valor_compra: 20.0,
          valor_tributo: 10.6,
          valor_credito: 0.50
        }
      ]
    };
  }
};
</script>