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
            <q-item clickable v-ripple v-for="item in hubs" @click="hubsOnClick(item)" :key="item.name">
              <q-item-section>{{ item.name }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import MapsVue from 'src/components/Map.vue';
import { Hub } from 'src/components/models';
import HubsJson from '../../hubs.json'

export default defineComponent({
  name: 'PageIndex',
  components: { MapsVue },
  setup() {
    const gmap = ref()
    const data: any = HubsJson.data;

    return { 
      "hubs": data,
      gmap
    };
  },
  methods: {
    hubsOnClick (item: Hub) {
      this.gmap.selectMarker(item.name);
    },
    async addMarkers() {
      const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for(let i = 0; i < this.hubs.length; i++){
        const elem: Hub = this.hubs[i];
        // Add delay to prevent geocoding query limit.
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.gmap.addMarker(elem.name, alphabets.charAt(i % alphabets.length));
      };
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
}
</style>