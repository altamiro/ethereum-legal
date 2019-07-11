
<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts";
import * as d3 from "d3";
require("echarts/theme/macarons"); // echarts theme
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
      chart: null,
      labelOption: {
        normal: {
          show: true,
          position: "insideBottom",
          distance: 15,
          align: "left",
          verticalAlign: "middle",
          rotate: 90,
          formatter: "{c}  {name|{a}}",
          fontSize: 12,
          rich: {
            name: {
              textBorderColor: "#fff"
            }
          }
        }
      }
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: data.legend
        },
        toolbox: {},
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: data.xaxis
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: data.series
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
              itens.push({
                tipo: response["1"][i],
                ano: response["2"][i].split("/")[2],
                valor: parseFloat(response["3"][i]),
                tributo: parseFloat(response["4"][i]),
                credito: parseFloat(response["5"][i])
              });
            } // end iF

            if (itens.length > 0) {
              const legend = [];
              const xaxis_data = [];
              const series = [];
              const metrics = [];

              Object.entries(groupBy(itens, "ano")).forEach(([key, value]) => {
                xaxis_data.push(key);
              });

              Object.entries(groupBy(itens, "tipo")).forEach(([key, value]) => {
                legend.push(
                  key == "icms" ? i18n.t("label.icms") : i18n.t("label.iss")
                );

                let expenseMetrics = d3
                  .nest()
                  .key(function(d) {
                    return d.ano;
                  })
                  .key(function(d) {
                    return d.tipo;
                  })
                  .rollup(function(v) {
                    return {
                      count: v.length,
                      total: d3.sum(v, function(d) {
                        return d.valor;
                      })
                    };
                  })
                  .entries(value);

                metrics.push(expenseMetrics);
              });

              const data = {
                icms: [],
                iss: []
              };

              if (metrics.length > 0) {
                for (let i = 0; i < metrics.length; i++) {
                  const element1 = metrics[i];
                  if (element1.length > 0) {
                    const icms = [];
                    const iss = [];
                    for (let x = 0; x < element1.length; x++) {
                      const element2 = element1[x];
                      if (element2.values[0].key === "icms") {
                        icms.push(element2.values[0].value.total.toFixed(2));
                      } else {
                        iss.push(element2.values[0].value.total.toFixed(2));
                      }
                    } // end for
                    if (icms.length > 0) {
                      data["icms"] = icms;
                    }
                    if (iss.length > 0) {
                      data["iss"] = iss;
                    }
                  } // end iF;
                } // end iF;
                if (data["icms"].length > data["iss"].length) {
                  data["iss"].push(parseFloat("0.00"));
                }

                if (data["iss"].length > data["icms"].length) {
                  data["icms"].push(parseFloat("0.00"));
                }
              } // end for;

              for (let i = 0; i < legend.length; i++) {
                const element = legend[i];
                series.push({
                  name: element,
                  type: "bar",
                  label: this.labelOption,
                  data: element.length == 13 ? data["iss"] : data["icms"]
                });
              }

              const param_data = {
                legend: legend,
                xaxis: xaxis_data,
                series: series
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
