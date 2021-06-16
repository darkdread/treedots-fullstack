<template>
  <div ref="gmapElem" class="map"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import gmapsInit from 'assets/gmaps.js'
import { Hub, HubMarker, HubsDict } from './models';

const markerSymbol = {
  // path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
  path: 'M19.65-31.5C19.65-42.8 10.55-51.9-.75-51.9-12.05-51.9-21.15-42.8-21.15-31.5-21.15-20.2-.75.9-.75.9S19.65-20.2 19.65-31.5ZM-10.25-31.9C-10.25-37.1-5.95-41.4-.75-41.4 4.45-41.4 8.75-37.2 8.75-31.9 8.75-26.7 4.55-22.4-.75-22.4-5.95-22.4-10.25-26.7-10.25-31.9Z',
  fillColor: '#FF9800',
  fillOpacity: 1,
  strokeColor: '#FFFFFF',
  strokeWeight: 2
};

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
          zoom: 14,
          disableDefaultUI: true,
          disableDoubleClickZoom: true
        });
        gdata.value = google;
        gmap.value = map;
        ggeocoder.value = geocoder;

        circleOverlay.value = await import('./CircleOverlay');

        navigator.geolocation.getCurrentPosition((pos) => {
          userLocation.value = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

          map.setCenter(userLocation.value);

          new google.maps.Circle({
            strokeColor: "#FFFFFF",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: "#007AFF",
            fillOpacity: 1,
            map,
            center: userLocation.value,
            radius: 100,
          });

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
    addMarker (hub: Hub, labelName: string): Promise<HubMarker> {
      return (this.ggeocoder?.geocode({ address: hub.name }, (results: any, status: any) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status);
        }

        const geocodedLocation = results[0].geometry.location;

        const marker = new this.gdata.maps.Marker({
          position: geocodedLocation,
          map: this.gmap,
          icon: markerSymbol
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