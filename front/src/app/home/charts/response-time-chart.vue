<template>
  <apexchart width="100%" height="300" type="area" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  name: "response-time-chart",
  props: {
    chartData: Array
  },
  data: function () {
    return {
      series: [{
        name: "Response Time (ms)",
        data: this.chartData.map(e => e.value)
      }],
      chartOptions: {
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        labels: this.chartData.map(e => e.label),
        colors: ["#4CAF50"],
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
          }
        },
        legend: {
          horizontalAlign: 'left'
        }
      },
    }
  }
}
</script>
