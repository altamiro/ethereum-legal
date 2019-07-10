
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
      default: "600px"
    }
  },
  data() {
    return {
      chart: null,
      labelOption: {
        normal: {
          show: true,
          position: "top",
          distance: 15,
          align: "left",
          verticalAlign: "middle",
          rotate: 90,
          formatter: "{c}  {name|{a}}",
          fontSize: 16,
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
    this.initChart();
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
    initChart() {
      this.chart = echarts.init(this.$el);
      this.chart.setOption({
        color: ["#003366", "#006699", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["Forest", "Steppe", "Desert", "Wetland"]
        },
        toolbox: {},
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: ["2012", "2013", "2014", "2015", "2016"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "Forest",
            type: "bar",
            label: this.labelOption,
            data: [320, 332, 301, 334, 390]
          },
          {
            name: "Steppe",
            type: "bar",
            label: this.labelOption,
            data: [220, 182, 191, 234, 290]
          },
          {
            name: "Desert",
            type: "bar",
            label: this.labelOption,
            data: [150, 232, 201, 154, 190]
          },
          {
            name: "Wetland",
            type: "bar",
            label: this.labelOption,
            data: [98, 77, 101, 99, 40]
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

                // series.push({
                //   name: key == 'icms' ? i18n.t("label.icms") : i18n.t("label.iss"),
                //   type: 'bar',
                //   label: this.labelOption,
                //   data: []
                // })
              });

              if (metrics.length > 0) {
                const data = [];
                for (let i = 0; i < metrics.length; i++) {
                  const element1 = metrics[i];
                  if (element1.length > 0) {
                    const teste = [];
                    for (let x = 0; x < element1.length; x++) {
                      const element2 = element1[x];
                      teste.push(element2.values[0].value.total);
                      // data.push({
                      //   tipo: element2.values[0].key,
                      //   total: element2.values[0].value.total
                      // });
                    } // end for
                    console.log(element1);
                    // data.push({
                    //   tipo: element1.values[0].key,
                    //   total: teste
                    // });
                  } // end iF;
                } // end iF;
                console.log(data);
              } // end for;

              // console.log('metrics: ', metrics)
              // console.log('legend: ', legend)
              // console.log('xaxis_data: ', xaxis_data)

              // console.log(series)
              // console.log(legend)
              // console.log(xaxis_data)
            } // end iF;

            // const ano = [];
            // for (const item of item_ano) {
            //   if(!map.has(item)){
            //     map.set(item, true);
            //     ano.push(item);
            //   } // end if;
            // } // end for;

            // console.log(legenda)
            // console.log(ano)
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
