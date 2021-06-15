<template>
  <div ref="gmapElem" class="map"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import gmapsInit from 'assets/gmaps.js'
import { HubsDict } from './models';

export default defineComponent({
  name: 'Map',
  setup(props, { emit }) {
    const gmapElem = ref(null);
    const gdata = ref();
    const gmap = ref();
    const ggeocoder = ref();
    const hubsDict: HubsDict = ref({});
    const circleOverlay = ref();

    onMounted(async () => {
      try {
        const google = await gmapsInit();
        const geocoder = new google.maps.Geocoder();
        const map = new google.maps.Map(gmapElem.value, {
          zoom: 14
        });
        gdata.value = google;
        gmap.value = map;
        ggeocoder.value = geocoder;

        circleOverlay.value = await import('./CircleOverlay');

        navigator.geolocation.getCurrentPosition((pos) => {
          const userLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

          map.setCenter(userLocation);
          new google.maps.Circle({
            strokeColor: "#0000FF",
            strokeOpacity: 0.1,
            strokeWeight: 2,
            fillColor: "#0000FF",
            fillOpacity: 0.1,
            map,
            center: userLocation,
            radius: 1000,
          });
        }, (err) => {
          console.error(err);
        });

        // geocoder.geocode({ address: 'Singapore' }, (results: any, status: any) => {
        //   if (status !== 'OK' || !results[0]) {
        //     throw new Error(status);
        //   }

        //   console.log(results[0]);
        //   map.setCenter(results[0].geometry.location);
        //   map.fitBounds(results[0].geometry.viewport);
        // });
        emit('loadedGMap');
      } catch (error) {
        console.error(error);
      }
    });

    return { gmapElem, gdata, gmap, ggeocoder, hubsDict, circleOverlay };
  },
  methods: {
    selectMarker (addressName: string) {
      this.gdata.maps.event.trigger(this.hubsDict[addressName]['circle'], 'click');
    },
    addMarker (addressName: string, labelName: string, callback: void) {
      this.ggeocoder?.geocode({ address: addressName }, (results: any, status: any) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status);
        }

        const marker = new this.gdata.maps.Marker({
          position: results[0].geometry.location,
          map: this.gmap
        })

        marker.setVisible(false);

        // Create circle
        const circle = new this.circleOverlay.CircleOverlay(labelName, results[0].geometry.location, 32);
        this.gdata.maps.event.addDomListener(circle.circle, "click", () => {
          marker.setVisible(true);
          circle.setMap(null);
        });

        circle.setMap(this.gmap);
        console.log(circle.circle);

        this.hubsDict[addressName] = {
          marker: marker,
          circle: circle.circle
        }
      });
    }
  }
});
</script>

<style lang="scss">
.map {
  width: 100vw;
  height: 360px;
}
</style>