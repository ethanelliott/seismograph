<template>
  <v-responsive max-width="1200px" class="mx-auto my-10">
    <v-container v-if="application" fluid>
      <v-row>
        <v-col>
          <v-card class="pa-5" rounded>
            <v-container>
              <v-col>
                <v-row>
                  <v-icon :color="statusColour" x-large>
                    mdi-circle
                  </v-icon>
                  <h1 class="font-weight-light ml-6">{{ statusMessage }}</h1>
                </v-row>
              </v-col>
            </v-container>
          </v-card>

          <v-sheet color="transparent" class="py-5">
            <h1 class="font-weight-light">Overall stats</h1>
            <v-card class="my-5">
              <v-container>
                <v-row>
                  <v-col cols="3">
                    <v-sheet class="pa-5">
                      <span class="display-1">{{ (application.uptimeLast24Hours * 100).toFixed(2) }}%</span>
                      <p class="body-1">Last 24 hours</p>
                    </v-sheet>
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="3">
                    <v-sheet class="pa-5">
                      <span class="display-1">{{ (application.uptimeLast7Days * 100).toFixed(2) }}%</span>
                      <p class="body-1">Last 7 days</p>
                    </v-sheet>
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="3">
                    <v-sheet class="pa-5">
                      <span class="display-1">{{ (application.uptimeAllTime * 100).toFixed(2) }}%</span>
                      <p class="body-1">Total Uptime</p>
                    </v-sheet>
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="3">
                    <v-sheet class="pa-5">
                      <span class="display-1">{{ (application.averageResponseTime).toFixed(2) }}ms</span>
                      <p class="body-1">Average Response Time</p>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-sheet>

          <v-sheet color="transparent" class="py-5">
            <h1 class="font-weight-light">Uptime</h1>
            <v-card class="my-5">
              <uptime-chart v-if="uptimeChartData" :chart-data="uptimeChartData"></uptime-chart>
            </v-card>
          </v-sheet>

          <v-sheet color="transparent" class="py-5">
            <h1 class="font-weight-light">Response time</h1>
            <v-card class="my-5">
              <response-time-chart v-if="responseTimeChartData"
                                   :chart-data="responseTimeChartData"></response-time-chart>
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-responsive>
</template>

<script>
import {APPLICATION} from "../../graphql/queries";
import ResponseTimeChart from "./charts/response-time-chart";
import moment from 'moment';
import UptimeChart from "./charts/uptime-chart";

export default {
  components: {UptimeChart, ResponseTimeChart},
  props: {
    id: String
  },
  data: () => ({
    application: null,
  }),
  computed: {
    statusColour() {
      return this.application.recentResult.status === 'SUCCESS' ? 'green' : 'red';
    },
    statusMessage() {
      if (this.application) {
        const status = this.application.recentResult.status === 'SUCCESS' ? 'operational' : 'experiencing issues';
        return this.application.name ? `${this.application.name} is ${status}` : '';
      }
      return '';
    },
    responseTimeChartData() {
      return this.application.results.map(e => ({
        value: e.responseTime,
        label: moment.utc(e.timestamp).local().format()
      }))
    },
    uptimeChartData() {
      return [...this.application.uptime].reverse().map(e => ({
        value: e.uptime,
        label: moment.utc(e.timestamp).local().format()
      }))
    }
  },
  apollo: {
    application: {
      query: APPLICATION,
      variables: function () {
        return {
          id: this.id
        }
      }
    }
  }
}
</script>
