<template>
  <v-responsive max-width="1200px" class="mx-auto my-10">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card class="pa-5" rounded>
            <v-container>
              <v-col>
                <v-row>
                  <v-icon :color="allStatusColour" x-large>
                    mdi-circle
                  </v-icon>
                  <h1 class="font-weight-light ml-6">{{ allStatusMessage }}</h1>
                </v-row>
              </v-col>
            </v-container>
          </v-card>
          <v-sheet v-if="applicationsWithIssues.length > 0" class="transparent py-10">
            <v-toolbar flat class="transparent">
              <h1 class="font-weight-light">Systems with Issues</h1>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-list outlined two-line>
              <v-list-item selectable v-for="app in applicationsWithIssues" :key="app.id" :to="`/${app.id}`">
                <v-list-item-avatar>
                  <v-img v-if="app.icon" :src="app.icon"></v-img>
                  <v-icon v-else>mdi-link</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ app.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ app.url }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span>{{ messageFor(app) }}</span>
                      <v-icon right v-on="on" v-bind="attrs" :color="getColourFor(app)">
                        mdi-circle
                      </v-icon>
                    </template>
                    <span>{{ messageFor(app) }}</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-sheet>
          <v-sheet class="transparent py-10">
            <v-toolbar flat class="transparent">
              <h1 class="font-weight-light">All Systems</h1>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" style="max-width: 300px;" rounded outlined hide-details dense
                            placeholder="search"
                            prepend-inner-icon="mdi-magnify"></v-text-field>
            </v-toolbar>
            <v-sheet color="transparent" v-if="filteredApplications === null">
              <v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
              <v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
              <v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
            </v-sheet>
            <v-list v-else-if="filteredApplications.length > 0" outlined two-line>
              <v-list-item selectable v-for="app in filteredApplications" :key="app.id" :to="`/${app.id}`">
                <v-list-item-avatar>
                  <v-img v-if="app.icon" :src="app.icon"></v-img>
                  <v-icon v-else>mdi-link</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ app.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ app.url }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span>{{ messageFor(app) }}</span>
                      <v-icon right v-on="on" v-bind="attrs" :color="getColourFor(app)">
                        mdi-circle
                      </v-icon>
                    </template>
                    <span>{{ messageFor(app) }}</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-sheet v-else>
              <v-container fluid class="fill-height py-16">
                <v-row justify="center" align="center">
                  <div class="text-center">
                    <v-icon size="100">mdi-search-web</v-icon>
                    <h1 class="display-1">No applications found</h1>
                    <p class="body-1 mt-4">Try narrowing your search</p>
                  </div>
                </v-row>
              </v-container>
            </v-sheet>
          </v-sheet>
          <v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-responsive>
</template>

<script>
import {APPLICATIONS} from "../../graphql/queries";

export default {
  data: () => ({applications: null, search: null, filteredApplications: null}),
  watch: {
    applications(val) {
      this.filteredApplications = [...val];
      this.filteredApplications.sort((a, b) => {
        return a?.recentResult?.status?.localeCompare(b?.recentResult?.status)
      });
    },
    search(val) {
      this.filteredApplications = this.applications.filter(app => [app.name, app.url].join(' ').toUpperCase().includes(val.toUpperCase()));
      this.filteredApplications.sort((a, b) => {
        return a?.recentResult?.status?.localeCompare(b?.recentResult?.status)
      });
    }
  },
  methods: {
    getColourFor(app) {
      return app.recentResult ? app.recentResult.status === 'SUCCESS' ? 'green' : 'red' : 'grey'
    },
    messageFor(app) {
      return app.recentResult ? app.recentResult.status === 'SUCCESS' ? 'UP' : 'DOWN' : 'NO DATA'
    }
  },
  computed: {
    allStatusColour() {
      const appsWithIssues = this?.applications?.filter(a => a.recentResult?.status === 'FAIL') ?? [];
      return appsWithIssues.length > 0 ? appsWithIssues.length === this.applications.length ? 'red' : 'orange' : 'green';
    },
    allStatusMessage() {
      const appsWithIssues = this?.applications?.filter(a => a.recentResult?.status === 'FAIL') ?? [];
      return appsWithIssues.length > 0 ? appsWithIssues.length === this.applications.length ? 'All systems down' : 'Some systems are experiencing issues' : 'All systems operational';
    },
    applicationsWithIssues() {
      return this?.applications?.filter(a => a.recentResult?.status === 'FAIL') ?? [];
    }
  },
  apollo: {
    applications: APPLICATIONS
  }
}
</script>
