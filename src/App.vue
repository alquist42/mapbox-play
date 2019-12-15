<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn small v-on="on">Download Villages</v-btn>
        </template>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Geo JSON</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <code>{{ $store.state.villages }}</code>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :permanent="drawer"
    >
      <vue-csv-import
        v-model="csv"
        :map-fields="['lat', 'lon', 'score']"
        :headers="true"
      >
        <template slot="next" slot-scope="{ load }">
          <v-btn mt-3 color="primary" @click="loadCsv(load)">load</v-btn>
        </template>
      </vue-csv-import>

      <v-container fluid>
        <v-row>
          <v-col>
            <v-card
              mb-4
            >
              <v-card-text>
                <v-slider
                  v-model="threshold"
                  thumb-label="always"
                  label="Threshold"
                  :min="0"
                  :max="100"
                  mt-3
                ></v-slider>
              </v-card-text>
            </v-card>
            <v-card
              mb-4
            >
              <v-card-text>
                <v-slider
                  v-model="clusters"
                  thumb-label="always"
                  label="K-clusters"
                  :min="0"
                  :max="20"
                  mt-3
                ></v-slider>
              </v-card-text>
              <!--        <code>Number of  (zero is sqrt(points/2))</code>-->
            </v-card>
            <v-card
              mb-4
            >
              <v-card-text>
                <v-slider
                  v-model="edge"
                  thumb-label="always"
                  label="Max edge"
                  :min="0"
                  :max="100"
                  mt-3
                ></v-slider>
                <!--         <code>(zero is infinity)</code>-->

                <v-select
                  v-model="units"
                  :items="['degrees', 'radians', 'miles', 'kilometers']"
                  label="Max edge units"
                />
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-text>
                <v-slider
                  v-model="scale"
                  thumb-label="always"
                  label="Scale (%) "
                  :min="20"
                  :max="120"
                  mt-3
                ></v-slider>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-container>

    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data () {
    return {
      drawer: false,
      dialog: false
    }
  },

  computed: {
    csv: {
      get () {
        return this.$store.state.csv
      },
      set (value) {
        this.$store.commit('updateCSV', value)
      }
    },
    threshold: {
      get () {
        return 100 - this.$store.state.threshold * 100
      },
      set (value) {
        this.$store.commit('updateThreshold', value)
      }
    },
    scale: {
      get () {
        return this.$store.state.scaleFactor * 100
      },
      set (value) {
        this.$store.commit('updateScaleFactor', value)
      }
    },
    clusters: {
      get () {
        return this.$store.state.kmeansOptions.numberOfClusters
      },
      set (value) {
        this.$store.commit('updateKmeansOptions', value)
      }
    },
    edge: {
      get () {
        return this.$store.state.hullOptions.maxEdge
      },
      set (value) {
        this.$store.commit('updateHullOptions', { maxEdge: value })
      }
    },
    units: {
      get () {
        return this.$store.state.hullOptions.units
      },
      set (value) {
        this.$store.commit('updateHullOptions', { units: value })
      }
    }
  },

  methods: {
    loadCsv (load) {
      load()
      // this.drawer = false
    },
    download () {
      window.open(this.source)
    }
  }
}
</script>

<style>
  .vue-csv-uploader {
    margin: 10px
  }

  .vue-csv-uploader .vue-csv-uploader-part-one {
    margin-bottom: 20px
  }

  .vue-csv-uploader .form-control-file {
    margin-bottom: 10px
  }

  select {
    height: 30px;
    width: 100px;
    border-radius: 0;
    padding-left: 10px;

    /* Removes the default <select> styling */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    /* Positions background arrow image */
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC');
    background-repeat: no-repeat;
    background-position: 75px center;
  }

  table {
    width: 100%;
    text-align: left;
  }
</style>
