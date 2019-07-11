
<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import swal from "sweetalert";
import echarts from "echarts";
import * as d3 from "d3";
require("echarts/theme/dark");
require("echarts/theme/infographic");
require("echarts/theme/macarons");
require("echarts/theme/roma");
require("echarts/theme/shine");
require("echarts/theme/vintage");
import { debounce, groupBy } from "@/utils";
import auth from "@/authService";
import i18n from "@/i18n";

export default {
  name: "Graficos",
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "400px"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.get();
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(data) {
      this.chart = echarts.init(this.$el);
      this.chart.setOption({
        color: ["#BDB76B", "#4682B4"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: data.legend
        },
        series: [
          {
            name: "Tipo",
            type: "pie",
            radius: ["30%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data.series
          }
        ]
      });
    },
    get() {
      this.$store.commit("TOGGLE_LOADING");
      const data = {
        address: auth.get().address,
        senha: auth.get().senha
      };
      this.$store
        .dispatch("listar_compras", data)
        .then(response => {
          this.$store.commit("CLOSE_LOADING");
          const itens = [];
          if (response != null) {
            for (let i = 0; i < response["0"].length; i++) {
              if (auth.get().tipo == "contribuinte") {
                if (
                  response["0"][i].toLowerCase() ===
                  auth.get().address.toLowerCase()
                ) {
                  itens.push({
                    tipo: response["1"][i],
                    valor: parseFloat(response["3"][i])
                  });
                } // end iF;
              } else {
                itens.push({
                  tipo: response["1"][i],
                  valor: parseFloat(response["3"][i])
                });
              } // end iF;
            } // end for

            if (itens.length > 0) {
              const legend = [];
              const metrics = [];

              Object.entries(groupBy(itens, "tipo")).forEach(([key, value]) => {
                legend.push(
                  key == "icms" ? i18n.t("label.icms") : i18n.t("label.iss")
                );

                let expenseMetrics = d3
                  .nest()
                  .key(function(d) {
                    return d.tipo;
                  })
                  .rollup(function(v) {
                    return {
                      count: v.length,
                      total: d3.sum(v, function(d) {
                        return d.valor.toFixed(2);
                      })
                    };
                  })
                  .entries(value);
                metrics.push(expenseMetrics);
              });
              const data = [];

              if (metrics.length > 0) {
                for (let i = 0; i < metrics.length; i++) {
                  const element = metrics[i];
                  data.push({
                    value: element[0].value.total.toFixed(2),
                    name:
                      element[0].key == "icms"
                        ? i18n.t("label.icms")
                        : i18n.t("label.iss")
                  });
                }
              } // end for;

              const param_data = {
                legend: legend,
                series: data
              };
              this.initChart(param_data);
            } // end iF;
          }
        })
        .catch(error => {
          console.log(error);
          this.$store.commit("CLOSE_LOADING");
          swal(
            i18n.t("erro.title"),
            "Ocorreu um erro ao carregar os lançamentos.",
            "error",
            { closeOnEsc: false }
          );
        });
    }
  }
};
</script>
