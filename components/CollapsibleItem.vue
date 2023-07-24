<template>
  <div class="collapsible-item" v-auto-animate>
    <div class="title-bar" @click.stop="toggleExpand">
      <div class="title" :class="expand && 'bold'" >
       <slot name="title" />
      </div>
      <div class="chevron" :class="[expand ? 'down' : 'up']"></div>
    </div>
    <div class="content" v-if="expand">
      <slot name="content"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  expand?: boolean;
}>();

const emit = defineEmits<{
  (event: "expandToggled", expandValue: boolean): void;
}>();

const toggleExpand = () => {
  emit("expandToggled", !props.expand);
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.collapsible-item {
  background-color: #ebebec;
  border-bottom: 1px solid rgba(#58595e, 0.5);

  .title-bar {
    padding: 1rem;
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;

    .title {
      &.bold {
        font-weight: bold;
      }
    }

    .chevron {
      width: 20px;
      height: 20px;
      background-image: url("@/assets/icons/chevron-down.svg");
      background-repeat: no-repeat;
      background-position: center;
      transition: transform 150ms linear;

      &.up {
        transform: rotate(180deg);
      }
    }
  }

  .content {
    margin: 1rem;
    margin-top: 0.5rem;
  }
}
</style>
