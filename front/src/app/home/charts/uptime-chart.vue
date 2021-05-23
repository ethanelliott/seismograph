<template>
  <apexchart width="100%" height="100" type="heatmap" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  name: "uptime-chart",
  props: {
    chartData: Array
  },
  data: function () {
    return {
      series: [{
        data: this.chartData.map(e => e.value)
      }],
      chartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false
          }
        },
        labels: this.chartData.map(e => e.label),
        colors: ["#4CAF50"],
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'datetime',
          labels: {
            show: false
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
      },
    }
  }
}
</script>
