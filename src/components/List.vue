<template>
  <div>
    <div v-for="item in list" :key="item.id">
      <span> {{ item.label }}: </span>
      <span style="color: red"> {{ item.value }} </span>
    </div>
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class List extends Vue {
  @Prop({ required: true, type: Array }) private list!: Array<any>;
}
</script>
