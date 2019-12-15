<template>
  <MglGeojsonLayer
    :sourceId="sourceId"
    :source="source"
    :layerId="layer.id"
    :layer="layer"
  />
</template>

<script>
import { MglGeojsonLayer } from 'vue-mapbox'

export default {
  props: {
    sourceId: {
      type: String,
      requiered: true
    },
    source: {
      type: Object,
      required: true
    }
  },
  components: {

    MglGeojsonLayer
  },
  data () {
    return {

      layer: {
        id: 'auto-villages',
        type: 'fill',
        layout: {},
        paint: {
          'fill-color': '#1d8865',
          'fill-opacity': 0.8
        }
      }
    }
  }

}
</script>
