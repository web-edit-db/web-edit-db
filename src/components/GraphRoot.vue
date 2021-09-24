<template>
  <svg
    ref="svgRef"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    @mousedown="startMovement"
    @wheel="isZooming"
  >
    <!--  The values represent the following functions: matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )  -->
    <g
      ref="svgGroupRef"
      :transform="`matrix(${movement.zoom}, 0, 0, ${movement.zoom}, ${movement.position.x}, ${movement.position.y})`"
      x="0"
      y="0"
    >
      <g>
        <defs>
          <pattern
            id="backgroundPatternSmall"
            :width="grid"
            :height="grid"
            patternUnits="userSpaceOnUse"
          >
            <path
              :d="`M ${grid} 0 L 0 0 L 0 ${grid}`"
              fill="none"
              stroke-width="3"
            />
          </pattern>
          <pattern
            id="backgroundPattern"
            :width="gridLarge"
            :height="gridLarge"
            patternUnits="userSpaceOnUse"
          >
            <rect
              :width="gridLarge"
              :height="gridLarge"
              fill="url(#backgroundPatternSmall)"
            />
            <path
              :d="`M${gridLarge} 0 L0 0 L0 ${gridLarge}`"
              fill="none"
              stroke-width="4"
            />
          </pattern>
        </defs>
        <rect
          :x="gridSize / -2"
          :y="gridSize / -2"
          :width="gridSize"
          :height="gridSize"
          fill="url(#backgroundPattern)"
        />
      </g>
      <rect
        :height="grid"
        :width="grid"
        :x="grid"
        :y="grid"
        fill="red"
      />
      <rect
        :height="grid"
        :width="grid"
        :x="grid*50"
        :y="grid*-30"
        fill="green"
      />
      <graph-path
        :start="{x: grid, y:grid}"
        :end="{x: grid*50, y: grid*-30}"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, provide, reactive, ref } from 'vue'
import GraphPath from '@/components/GraphPath.vue'
import Heap from 'heap'

export type Point = { x: number, y: number }
export type Node = {
  parent?: Point,
  closed?: boolean,
  opened?: boolean,
  cost: number,
  costFromStart: number,
  costFromEnd: number
}
export type FindPath = (start: Point, end: Point) => Point[]

export default defineComponent({
  components: {
    GraphPath
  },
  setup () {
    // grid sizeing
    const grid = 20
    const gridLarge = grid * 5
    const gridSize = grid * 500

    const svgRef = ref<SVGSVGElement>()
    const svgGroupRef = ref<SVGSVGElement>()
    const movement = reactive({
      zoom: 1,
      moving: false,
      position: { x: 0, y: 0 },
      lastPosition: { x: 0, y: 0 }
    })

    // convert client x and y points
    const clientToSVG = (client: { x: number, y: number}): { x: number, y: number } => {
      if (svgRef.value) {
        const { x: svgX, y: svgY } = svgRef.value?.getBoundingClientRect()
        return {
          // take the svg value off the client to get the position of the svg
          // then apply the matrix transform the the value on the svg
          x: (client.x - svgX - movement.position.x) / movement.zoom,
          y: (client.y - svgY - movement.position.y) / movement.zoom
        }
      } else return { x: 0, y: 0 }
    }

    const inMovement = (event: MouseEvent) => {
      if (movement.moving) {
        const diffrence = {
          x: event.clientX - movement.lastPosition.x,
          y: event.clientY - movement.lastPosition.y
        }
        movement.lastPosition = {
          x: event.clientX,
          y: event.clientY
        }
        movement.position = {
          x: movement.position.x + diffrence.x,
          y: movement.position.y + diffrence.y
        }
      }
    }
    const endMovement = () => {
      movement.moving = false
      document.removeEventListener('mouseup', endMovement)
      document.removeEventListener('mousemove', inMovement)
    }
    const startMovement = (event: MouseEvent) => {
      movement.lastPosition = {
        x: event.clientX,
        y: event.clientY
      }
      movement.moving = true
      document.addEventListener('mousemove', inMovement)
      document.addEventListener('mouseup', endMovement)
    }
    const isZooming = (event: WheelEvent) => {
      const newZoom = movement.zoom * Math.exp(Math.sign(event.deltaY) * -0.2)
      const positionBefore = clientToSVG({ x: event.clientX, y: event.clientY })
      if (newZoom > 0.2 && newZoom < 5) {
        movement.zoom = newZoom
        const positionAfter = clientToSVG({ x: event.clientX, y: event.clientY })
        movement.position.x -= (positionBefore.x - positionAfter.x) * movement.zoom
        movement.position.y -= (positionBefore.y - positionAfter.y) * movement.zoom
      }
    }

    // a*
    const blocked = ref<Point[]>([
      { x: 10, y: 0 }
    ])
    const weight = 20
    provide('blocked', blocked)
    const findPath = (start: Point, end: Point) => {
      const nodes = new Map<Point, Node>()
      const open = new Heap<Point>(
        (a, b) => (nodes.get(a) ?? { cost: 0 }).cost - (nodes.get(b) ?? { cost: 0 }).cost
      )
      open.push(start)

      while (!open.empty()) {
        const point = open.pop() // get the point (x, y) only with the lowest cost
        // close the node
        nodes.set(point, {
          ...nodes.get(point) ?? { cost: 0, costFromStart: 0, costFromEnd: 0 },
          closed: true
        })

        // check for the end
        if (point.x === end.x && point.y === end.y) {
          // found end!
          const path = [point]
          let parent = nodes.get(point)?.parent
          while (parent) {
            path.push(parent)
            parent = nodes.get(parent)?.parent
          }
          return path.reverse()
        }

        // get the neighbours of the current node
        const neighbours = [
          { x: point.x, y: point.y - grid }, // up
          { x: point.x + grid, y: point.y }, // right
          { x: point.x, y: point.y + grid }, // down
          { x: point.x - grid, y: point.y } // left
        ].filter(neighbour =>
          neighbour.x > (gridSize / -2) && // x grater than leftmost x value
          neighbour.x < (gridSize / 2) && // x less than the rightmost x value
          neighbour.y > (gridSize / -2) && // y grater than bottommost y value
          neighbour.y < (gridSize / 2) && // y less than the topmost y value
          !blocked.value.some(
            blockedPoint => neighbour.x === blockedPoint.x && neighbour.y === blockedPoint.y
          ) && // the neighbour is not a blocked value
          !nodes.get(neighbour)?.closed // the neighbour is not closed
        )

        neighbours.forEach((neighbour) => {
          const newCostFromStart = (nodes.get(point)?.costFromStart ?? 0) + 1
          const openedNeighbour = nodes.get(neighbour)
          if (
            openedNeighbour === undefined ||
            !openedNeighbour.opened ||
            newCostFromStart < openedNeighbour.cost
          ) {
            const newCostFromEnd =
              openedNeighbour?.costFromEnd ??
              (weight * (
                Math.abs(neighbour.x - end.x) +
                  Math.abs(neighbour.y - end.y)
              ))
            const neighbourNode: Node = {
              parent: point,
              opened: true,
              costFromStart: newCostFromStart,
              costFromEnd: newCostFromEnd,
              cost: newCostFromEnd + newCostFromStart
            }
            nodes.set(neighbour, neighbourNode)
            if (!openedNeighbour || !openedNeighbour.opened) {
              open.push(neighbour)
            } else {
              open.updateItem(neighbour)
            }
          }
        })
      }
      return [start, end]
    }
    provide('findPath', findPath)

    return {
      grid,
      gridLarge,
      gridSize,
      svgRef,
      svgGroupRef,
      startMovement,
      endMovement,
      inMovement,
      movement,
      isZooming,
      findPath
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
