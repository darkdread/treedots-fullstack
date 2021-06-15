<template>
  <div ref="gmapElem" class="map"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import gmapsInit from 'assets/gmaps.js'
import { Hub, HubsDict } from './models';

export default defineComponent({
  name: 'Map',
  setup(props, { emit }) {
    const gmapElem = ref(null);
    const gdata = ref();
    const gmap = ref();
    const ggeocoder = ref();
    const hubsDict: HubsDict = ref({});
    const circleOverlay = ref();
    const userLocation = ref();

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
          userLocation.value = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

          map.setCenter(userLocation.value);
          new google.maps.Circle({
            strokeColor: "#0000FF",
            strokeOpacity: 0.1,
            strokeWeight: 2,
            fillColor: "#0000FF",
            fillOpacity: 0.1,
            map,
            center: userLocation.value,
            radius: 1000,
          });
        }, (err) => {
          console.error(err);
        });

        // Trigger addMarkers.
        emit('loadedGMap');
      } catch (error) {
        console.error(error);
      }
    });

    return { gmapElem, gdata, gmap, ggeocoder, hubsDict, circleOverlay, userLocation };
  },
  methods: {
    selectMarker (hub: Hub) {
      this.gdata.maps.event.trigger(this.hubsDict[hub.name].circle.circleElem, 'click');
    },
    addMarker (hub: Hub, labelName: string) {
      return (this.ggeocoder?.geocode({ address: hub.name }, (results: any, status: any) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status);
        }

        const geocodedLocation = results[0].geometry.location;

        const marker = new this.gdata.maps.Marker({
          position: geocodedLocation,
          map: this.gmap
        })

        marker.setVisible(false);

        const circle = new this.circleOverlay.CircleOverlay(labelName, geocodedLocation, 32);

        circle.setMap(this.gmap);
        const dist = this.gdata.maps.geometry.spherical.computeDistanceBetween (this.userLocation, geocodedLocation);

        this.hubsDict[hub.name] = {
          marker: marker,
          circle: circle,
          dist: dist,
          hub: hub,
          label: labelName
        }
      }) as Promise<any>).then(() => {
        return this.hubsDict[hub.name];
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