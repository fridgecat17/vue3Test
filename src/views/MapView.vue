<template>
  <div ref="map" class="map" id="map"></div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue"
import AMapLoader from '@amap/amap-jsapi-loader'

let map = null
window._AMapSecurityConfig = {
  securityJsCode: '6b2536c0ef1b7c2d963c0cef2553f1bd'
}
onMounted(() => {
  AMapLoader.load({
    key: '6c91b153a09ec6e37afc7163b018cbbe',
    version: '2.0',
    plugins: ['AMap.Geocoder']
  }).then((AMap) => {
    let geocoder = new AMap.Geocoder({
    })
    geocoder.getLocation('广州', (status, result)=> {
      console.log(status,result);
      if (status == 'complete' && result.info == 'OK') {
        const lnglat = result.geocodes[0].location
        console.log(lnglat)
        map = new AMap.Map("map", {
          viewMode: '3D',
          zoom: 11,
          center: [lnglat.lng,lnglat.lat]
        })
      }
    })
  }).catch(e => {
    console.log(e)
  })
})
onUnmounted(() => {
  map?.$destory()
})
</script>
<style scoped>
.map {
  height: 400px;
  width: 1000px;
}
</style>
