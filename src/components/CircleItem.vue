<template>
  <q-avatar color="orange" text-color="white" :style="'width:' + width + 'px; height:' + height + 'px;' + 'cursor:pointer;'">
    {{ letter }}
  </q-avatar>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'CircleItem',
  props: {
    letter: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  }
});
</script>