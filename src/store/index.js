import Vue from 'vue'
import Vuex from 'vuex'
const turf = require('@turf/turf')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    source: [],
    villages: null,
    center: [0, 0],
    csv: [],
    threshold: 0.35, // min score cutoff
    scaleFactor: 0.8, // 20% shrink from centroid
    kmeansOptions: { numberOfClusters: 7 }, // default = Math.sqrt(numberOfPoints/2)
    hullOptions: { units: 'miles', maxEdge: 10 } // default = maxEdge: Infinity, units: kilometers
  },
  mutations: {
    updateCSV (state, source) {
      state.csv = source
      const points = turf.featureCollection(source.map(line => turf.point([parseFloat(line.lon), parseFloat(line.lat)], { score: parseFloat(line.score) })))
      state.center = turf.center(points).geometry.coordinates
      state.source = points
    },
    updateThreshold (state, threshold) {
      state.threshold = 1 - threshold / 100
    },
    updateScaleFactor (state, scaleFactor) {
      state.scaleFactor = scaleFactor / 100
    },
    updateKmeansOptions (state, numberOfClusters) {
      state.kmeansOptions = { numberOfClusters }
    },
    updateHullOptions (state, hullOptions) {
      state.hullOptions = { ...state.hullOptions, ...hullOptions }
    },
    updateVillages (state, villages) {
      state.villages = villages
    }
  },
  actions: {
  },
  modules: {
  }
})
