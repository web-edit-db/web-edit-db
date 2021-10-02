<template>
  <svg
    ref="svgRef"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    @mousedown="controlls.mousedown"
    @wheel="controlls.wheel"
  >
    <!--  The values represent the following functions: matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )  -->
    <g
      :transform="`matrix(${view.zoom}, 0, 0, ${view.zoom}, ${view.pan.x}, ${view.pan.y})`"
      x="0"
      y="0"
    >
      <g>
        <defs>
          <pattern
            id="backgroundPatternSmall"
            :width="graphConfig.cell"
            :height="graphConfig.cell"
            patternUnits="userSpaceOnUse"
          >
            <path
              :d="`M ${graphConfig.cell} 0 L 0 0 L 0 ${graphConfig.cell}`"
              fill="none"
              stroke-width="3"
            />
          </pattern>
          <pattern
            id="backgroundPattern"
            :width="graphConfig.cellLarge"
            :height="graphConfig.cellLarge"
            patternUnits="userSpaceOnUse"
            x="-1.1"
            y="-1.1"
          >
            <rect
              :width="graphConfig.cellLarge"
              :height="graphConfig.cellLarge"
              fill="url(#backgroundPatternSmall)"
            />
            <path
              :d="`M${graphConfig.cellLarge} 0 L0 0 L0 ${graphConfig.cellLarge}`"
              fill="none"
              stroke-width="4"
            />
          </pattern>
        </defs>
        <rect
          :x="graphConfig.size / -2"
          :y="graphConfig.size / -2"
          :width="graphConfig.size"
          :height="graphConfig.size"
          fill="url(#backgroundPattern)"
          @mousedown="controlls.target = null"
        />
      </g>
      <g id="graph-path-layer" />
      <graph-tables />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, reactive, ref, watch } from 'vue'
import GraphTables from './GraphTables.vue'
import GraphPath from './GraphPath.vue'
import { useStore } from 'vuex'
import { State } from '@/store/types'
import { graphConfig } from '@/helpers'

export type Point = { x: number, y: number, h?: number, w?: number }
export type Node = {
  parent?: Point,
  closed?: boolean,
  opened?: boolean,
  cost: number,
  costFromStart: number,
  costFromEnd: number
}
export type FindPath = (start: Point, end: Point) => Point[]
export interface Controlls {
  lastPosition: Point,
  target: null | ((diffrence: Point) => void),
  mouseup(): void,
  mousemove(event: MouseEvent): void
  mousedown(event: MouseEvent): void,
  wheel(event: WheelEvent): void
}

export default defineComponent({
  components: {
    GraphTables,
    GraphPath
  },
  setup () {
    const store = useStore<State>()

    const tablePositions = ref({} as { [tableName: string]: Point })
    const tableColumnPositions = ref({ } as { [tableName: string]: { [columnName: string]: Point } })
    provide('tablePositions', tablePositions)
    provide('tableColumnPositions', tableColumnPositions)

    const svgRef = ref<SVGSVGElement>()

    // convert client x and y points
    const clientToSVG = (client: Point): Point => {
      if (svgRef.value) {
        const { x: svgX, y: svgY } = svgRef.value?.getBoundingClientRect()
        return {
          // take the svg value off the client to get the pan of the svg
          // then apply the matrix transform the the value on the svg
          x: (client.x - svgX - view.pan.x) / view.zoom,
          y: (client.y - svgY - view.pan.y) / view.zoom
        }
      } else return { x: 0, y: 0 }
    }

    const snapToGrid = (point: Point) => {
      return {
        ...point,
        x: Math.max(
          Math.min(
            graphConfig.cell * Math.round(point.x / graphConfig.cell),
            (graphConfig.size / 2) - (point.w ?? 0)
          ),
          graphConfig.size / -2
        ),
        y:
        Math.max(
          Math.min(
            graphConfig.cell * Math.round(point.y / graphConfig.cell),
            (graphConfig.size / 2) - (point.h ?? 0)
          ),
          graphConfig.size / -2
        )
      }
    }
    provide('snapToGrid', snapToGrid)

    const view = reactive({
      zoom: 1,
      pan: { x: 0, y: 0 }
    })
    const controlls: Controlls = {
      lastPosition: { x: 0, y: 0 },
      target: null,
      mousemove (event) {
        const diffrence = {
          x: event.clientX - controlls.lastPosition.x,
          y: event.clientY - controlls.lastPosition.y
        }
        controlls.lastPosition = { x: event.clientX, y: event.clientY }
        if (controlls.target) {
          // call the target function with the diffrence corrected for zoom
          controlls.target({ x: diffrence.x / view.zoom, y: diffrence.y / view.zoom })
        } else {
          view.pan = { x: view.pan.x + diffrence.x, y: view.pan.y + diffrence.y }
        }
      },
      mouseup () {
        document.removeEventListener('mousemove', controlls.mousemove)
        document.removeEventListener('mouseup', controlls.mouseup)
      },
      mousedown (event) {
        controlls.lastPosition = { x: event.clientX, y: event.clientY }
        document.addEventListener('mousemove', controlls.mousemove)
        document.addEventListener('mouseup', controlls.mouseup)
      },
      wheel (event) {
        const zoom = view.zoom * Math.exp(Math.sign(event.deltaY) * -0.2)
        const beforeZoom = clientToSVG({ x: event.clientX, y: event.clientY })
        if (zoom > 0.2 && zoom < 5) {
          view.zoom = zoom
          const afterZoom = clientToSVG({ x: event.clientX, y: event.clientY })
          view.pan.x -= (beforeZoom.x - afterZoom.x) * zoom
          view.pan.y -= (beforeZoom.y - afterZoom.y) * zoom
        }
      }
    }
    provide('controlls', controlls)

    onMounted(() => {
      view.zoom = store.state.graph.zoom
      view.pan = store.state.graph.pan
    })
    watch(() => [view.zoom, view.pan], () => store.commit('setGraphZoomPan', { zoom: view.zoom, pan: view.pan }))

    return {
      graphConfig,
      svgRef,
      controlls,
      view,
      tableColumnPositions
    }
  }
})
</script>

<style lang="postcss" scoped>
svg {
  @apply h-full w-full;
}

#backgroundPatternSmall path {
  stroke: theme('colors.gray.200');
}

#backgroundPattern path {
  stroke: theme('colors.gray.300');
}
</style>
