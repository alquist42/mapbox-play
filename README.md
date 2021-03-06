# app 

## Algo

```javascript
export async function recommend (polygon, points, { threshold, scaleFactor, kmeansOptions, hullOptions }) {
  const ptsWithin = turf.pointsWithinPolygon(points, polygon)

  // Filter by score
  const filtered = ptsWithin.features.filter(feature => feature.properties.score >= threshold)

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

```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
