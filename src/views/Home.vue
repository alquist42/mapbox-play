<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
    @load="onMapLoaded"
    :center="center"
    :zoom="zoom"
    :hash="true"
  >
    <!-- Adding navigation control -->
    <MglNavigationControl position="bottom-right" ref="geolocateControl" />
    <!-- Adding GeoJSON layer -->
    <VillageLayer
      sourceId="villages"
      :source="villages"
    />
    <MglMarker :coordinates="center" color="blue" />

  </MglMap>
</template>

<script>
import Mapbox from 'mapbox-gl'
import {
  MglMap,
  MglNavigationControl,
  MglMarker
} from 'vue-mapbox'
import VillageLayer from '../components/Villages'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import { mapState } from 'vuex'
/* eslint-disable import/no-webpack-loader-syntax */
import worker from 'workerize-loader!../services/recommended'

let instance = worker()

console.log(instance)

export default {
  name: 'Home',
  components: {
    MglMap,
    MglNavigationControl,
    MglMarker,
    VillageLayer
  },
  data () {
    return {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/streets-v11', // your map style
      zoom: 10
    }
  },

  computed: {
    ...mapState(['source', 'center', 'threshold', 'scaleFactor', 'kmeansOptions', 'hullOptions']),
    villages () {
      return {
        type: 'geojson',
        data: this.$store.state.villages
      }
    }
  },

  watch: {
    threshold: function () { this.createVillages() },
    scaleFactor: function () { this.createVillages() },
    kmeansOptions: function () { this.createVillages() },
    hullOptions: function () { this.createVillages() }
  },

  created () {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },

  methods: {
    onMapLoaded (event) {
      // in component
      this.map = event.map

      this.draw = new MapboxDraw()
      this.map.addControl(this.draw, 'top-right')

      this.map.on('draw.create', this.updateArea.bind(this))
      this.map.on('draw.delete', this.updateArea.bind(this))
      this.map.on('draw.update', this.updateArea.bind(this))

      // or just to store if you want have access from other components
      this.$store.map = event.map
    },
    async updateArea (e) {
      this.extent = e.features[0]
      await this.createVillages()
      this.draw.delete(e.features[0].id)
    },
    async createVillages () {
      console.log({
        threshold: this.threshold,
        scaleFactor: this.scaleFactor,
        kmeansOptions: this.kmeansOptions,
        hullOptions: this.hullOptions
      })
      if (this.source) {
        const villages = await instance.recommend(this.extent, this.source, {
          threshold: this.threshold,
          scaleFactor: this.scaleFactor,
          kmeansOptions: this.kmeansOptions,
          hullOptions: this.hullOptions
        })
        this.$store.commit('updateVillages', villages)
      }
    },
    // e.features[0].geometry.coordinates
    async loadRecommended (coordinates) {
      const response = await fetch('http://localhost:1234/api/v1/recommended/villages', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinates })
      })
      // this.$refs.layer.remove()
      this.villages.data = await response.json()
    }

  }
}
</script>

<style>
</style>
