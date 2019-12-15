const turf = require('@turf/turf')

// creates an array of alternating property name, property value
// with properties in sorted order
// then stringify's that array
function stringifyPropsInOrder (arr) {
  const keys = arr.sort()
  let output = []; let prop
  for (let i = 0; i < keys.length; i++) {
    prop = keys[i]
    output.push(prop)
    output.push(arr[prop])
  }
  return JSON.stringify(output)
}

const cache = {}

export async function recommend (polygon, points, { threshold, scaleFactor, kmeansOptions, hullOptions }) {
  const ptsWithin = cache[stringifyPropsInOrder(polygon.geometry.coordinates)] || turf.pointsWithinPolygon(points, polygon)

  // Filter by score
  const filtered = ptsWithin.features.filter(feature => feature.properties.score >= threshold)

  if (kmeansOptions.numberOfClusters === 0) {
    kmeansOptions = {}
  }

  if (hullOptions.maxEdge === 0) {
    hullOptions = {}
  }

  if (filtered.length) {
    // Cluster K-means
    const clustered = turf.clustersKmeans(turf.featureCollection(filtered), kmeansOptions)

    // Concave hull from each cluster
    const villages = turf.clusterReduce(clustered, 'cluster', (previousValue, cluster) => {
      const hull = turf.concave(cluster, hullOptions)
      // scale down the polygon (raster buffer to prevent overlapping villages)
      return hull ? previousValue.concat([turf.transformScale(hull, scaleFactor)]) : previousValue
    }, [])

    return turf.featureCollection(villages)
  }

  return turf.featureCollection([])
}
