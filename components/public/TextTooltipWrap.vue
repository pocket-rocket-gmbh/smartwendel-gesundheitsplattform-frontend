<template>
  <div class="text-wrap" v-html="tooltipFeature" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTooltipsStore } from '~~/store/tooltips'
export default defineComponent({
  props: {
    text: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const tooltips = computed(() => {
      return useTooltipsStore().tooltips
    })

    const tooltipsFiltered = computed(() => {
      if(tooltips.value) {
        return tooltips.value.map((item:any) => ({id: item.id, name: item.name, content: item.content, url: item.url}))
      }
      return []
    })

    const tooltipFeature = computed(() => {
      let results = props.text
      tooltipsFiltered.value.forEach((filtered:any) => {
        if (results) {
          let tooltipString = `
            <style>
            .tooltip-${filtered.id} {
              position: relative;
              display: inline-block!important;
              color: #0176B8;
              font-weight: 500;
              cursor: pointer;
            }
            .tooltip-${filtered.id} .tooltiptext-${filtered.id} {
              visibility: hidden;
              width: auto;
              padding: 15px 15px;
              background-color: #015281;
              color: #fff;
              overflow-wrap: break-word;
              border-radius: 6px;
              position: absolute;
              margin-top: -30px;
              margin-left: -50px;
              z-index: 99999!important;
            }
            .tooltip-${filtered.id}:hover .tooltiptext-${filtered.id} 
            {
              visibility: visible;
              z-index: 99999!important;
              width: 300px;
            }
            .icon {
              color: #0176B8;
              font-size: 15px;
              padding: 1px;
              margin-bttom: 50px;
            }
            </style>`

            let simpleTooltip = ''

            if(!filtered.url) {
              simpleTooltip = `
              <span class="tooltip-${filtered.id}">${filtered.name}
                <span class="tooltiptext-${filtered.id}">${filtered.content}</span><span class="icon">&#x24D8;</span>
              </span>`
            }

            let tooltipUrl = ''

            if (filtered.url) {
              tooltipUrl = `
                <a href="https://${filtered.url}" target="_blank">
                  <span class="tooltip-${filtered.id}">${filtered.name}
                    <span class="tooltiptext-${filtered.id}">${filtered.content}</span><span class="icon">&#x24D8;</span><span class="icon">&#x2197;</span>
                  </span>
                </a>`
            }
            results = results.replace(filtered.name, tooltipString + simpleTooltip + tooltipUrl)
          }
        })
      return results
    })
    
    return {
      tooltipFeature
    }
  }
})
</script>

<style lang="sass" scoped>
  
</style>