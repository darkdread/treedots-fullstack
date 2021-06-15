<template>
  <q-page class="row items-center justify-evenly">
    <!-- <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component> -->
    <div class="column map-container">
      <div class="col-12">
        <p>Locate Hub</p>
      </div>
      <div class="col-12">
        <maps-vue ref="gmap" @loadedGMap="addMarkers">
        </maps-vue>
      </div>
      <div class="col-12 hubs-near">
        <p>Hubs Near You</p>
        <div class="q-pa-md" style="max-width: 350px">
          <q-list bordered separator>
            <q-item clickable v-ripple v-for="item in hubMarkers" @click="hubOnClick(item.hub)" :key="item.hub.name">
              <q-item-section><span class="text-caption">{{ item.hub.name }} {{ item.dist }}</span></q-item-section>
              <q-item-section avatar>
                <q-avatar color="orange" text-color="white">
                  {{ item.label }}
                </q-avatar>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import MapsVue from 'src/components/Map.vue';
import { Hub, HubMarker } from 'src/components/models';
import HubsJson from '../../hubs.json'

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default defineComponent({
  name: 'PageIndex',
  components: { MapsVue },
  setup() {
    const gmap = ref()
    const data: any = HubsJson.data;
    const hubMarkers: Array<HubMarker> = ref([]);

    return { 
      "hubs": data,
      gmap,
      hubMarkers
    };
  },
  methods: {
    hubOnClick (hub: Hub) {
      this.gmap.selectMarker(hub);
    },
    async addMarkers() {
      for(let i = 0; i < this.hubs.length; i++){
        const elem: Hub = this.hubs[i];

        // Add delay to prevent geocoding query limit.
        await new Promise(resolve => setTimeout(resolve, 1000));
        const hubMarker: HubMarker = await this.gmap.addMarker(elem, alphabets[i]);
        this.gmap.gdata.maps.event.addDomListener(hubMarker.circle.circleElem, "click", () => {
          hubMarker.marker.setVisible(true);
          hubMarker.circle.setMap(null);
          this.markerOnRemove(hubMarker);
        });

        this.hubMarkers.push(hubMarker);
        this.hubMarkers.sort((a, b) => {
          return a.dist - b.dist;
        });
      };
    },
    markerOnRemove(marker: HubMarker) {
      this.hubMarkers.splice(this.hubMarkers.indexOf(marker), 1);
    }
  }
});
</script>
<style lang="scss">
.map-container {
  div p{
    margin: 1em;
  }

  p {
    text-align: center;
    font-weight: bold;
  }

  .hubs-near p {
    text-align: left;
  }

  span {
    color: $grey
  }
}
</style>