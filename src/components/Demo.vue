<template>
    <div>
        <canvas id="canvas" width="50" height="1000" style="background: #333"></canvas>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue'

const canvas = ref()
const dashLength = ref(50)
let offset = ref(0)

function drawDashedLine(ctx: any, canvas: any) {
    ctx.setLineDash([dashLength.value, dashLength.value - 5])
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.beginPath()
    console.log(canvas.height, 'sss')
    ctx.moveTo(50 / 2, canvas.height)
    ctx.lineTo(50 / 2, 0)
    ctx.stroke()
}

function animateDashedLine() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    offset.value += 2
    // if (offset.value > dashLength.value) {
    //   offset.value = 0
    // }
    ctx.setLineDash([dashLength.value, dashLength.value - 5])
    ctx.lineDashOffset = offset.value
    drawDashedLine(ctx, canvas)
    requestAnimationFrame(animateDashedLine)
}

onMounted(() => {
    animateDashedLine()
})
</script>

<style scoped></style>