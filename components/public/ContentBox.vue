<template>
  <v-col md="6" class="d-flex flex-column">
    <v-card
      class="rounded-xl mx-auto has-bg-light-grey content elevation-1 fill-height d-flex flex-column"
      width="100%"
    >
      <v-row>
        <v-col md="5" class="d-flex">
          <v-img class="align-center" cover max-height="300px" :src="item.image_url" />
        </v-col>
        <v-col class="d-flex mt-1">
          <div class="notes-card">
            <div class="flex-grow-1">
              <v-card-title class="note-title is-primary">
                {{ item.name }}
              </v-card-title>
              <div class="px-5 pb-5">
                <p class="break-text">
                  {{ item.description }}
                </p>
              </div>
              <v-spacer></v-spacer>
              <v-card-actions>
                <div class="content-footer">
                  <v-btn
                    color="secondary"
                    class="note-text-link"
                    size="small"
                    :href="getButtonHref"
                    :target="item.url ? '_blank' : ''"
                  >
                    Mehr erfahren &gt;
                  </v-btn>
                </div>
              </v-card-actions>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script lang="ts" setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  itemType: {
    type: String,
  },
});

const getButtonHref = computed(() => {
  if (!props.item) return null;

  if (props.item.kind === "course") return `/public/care_facilities/${props.item.id}`;
  if (props.item.kind === "events") return `/public/care_facilities/${props.item.id}`;
  if (props.item.kind === "news") return `/public/news/${props.item.id}`;
  if (props.item.kind === "facility") return `/public/care_facilities/${props.item.id}`;
  if (props.item.url) return "https://" + props.item.url;

  return null;
});
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.note-title
  font-weight: 600
  font-size: 22px

.note-text-link
  font-size: 18px

.content
  min-height: 250px
  min-width: 650px
  max-width: 650px
  z-index: 0

.content-footer
  position: absolute
  bottom: 30px
</style>
