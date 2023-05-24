<template>
  <div>
    <el-form ref="ruleForm" :model="state.listQuery" :inline="true">
        <el-form-item label="工期时间：">
            <el-date-picker v-model="state.listQuery.time" type="daterange" @change="handleTimeChange" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
      <el-form-item label="间隔">
        <el-input-number v-model="state.listQuery.diff" controls="false" :min="0" :max="10" @change="handleDiffChange"></el-input-number>
      </el-form-item>
    </el-form>
  </div>
  <div @mousewheel="mouseWheel">
    <canvas id="canvas" width="1040" height="40" style="padding: 20px"></canvas>
    <canvas id="canvasCenter" width="1040" height="440" style="padding: 0 20px"></canvas>
    <canvas id="canvasTwo" width="1040" height="40" style="padding: 20px"></canvas>
  </div>
</template>

<script setup lang="ts">
import { drawCircle, drawArrow } from './utils'
import { onMounted, reactive } from 'vue'
import { timeSlice, timeDeal } from './timeUtils'
import dayjs from "dayjs";
const baseFontSize = 12;
const startX = 20
interface configVo {
	size?: number;
	x: number;
	y: number;
	w: number;
	h: number;
	width: number;
	height: number;
}
const state = reactive({
    listQuery: {
      time: [],
      startTime: '',
      endTime: '',
      diff: 3,
    }
})
const config = reactive({
	size: 101, // 刻度尺总刻度数，（100个间隔需要101个刻度线）
	x: 20, // 刻度尺x坐标位置,单位px
	y: 0, // 刻度尺y坐标位置,单位px
	w: 10, // 刻度线的间隔,单位px
	h: 10, // 刻度线基础长度,单位px
	width: 1000, // 刻度尺宽度(写长20px是为了最后一个刻度值能被显示出来)
	height: 40, // 刻度尺高度
})
let w = 10
const draw = (ctx: CanvasRenderingContext2D, config: configVo, down: boolean = true) => {
  const size =  config.size;
  const y = config.y || 0;
  w = config.width / (size - 1) || 10;
  const h = config.h || 10;
  // 画之前清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.translate(500, 20)
  // ctx.rotate((180 * Math.PI) / 180)
  // ctx.translate(-500, -20)
  // 设置画笔属性
  ctx.strokeStyle = '#aaa'; // 画笔颜色
  ctx.lineWidth = 1; // 画笔大小
  ctx.font = baseFontSize + ''; //字体大小
  // 画横线
  for (let i = 0; i < size; i = i + state.listQuery.diff) {
    // 开始一条路径
    ctx.beginPath();
    // 移动到指定位置
    ctx.moveTo(startX + i * w, down ? baseFontSize + y : h);
    ctx.lineTo(startX + i * w, down ? baseFontSize + h : h * 2); // 刻度线短（1h）
    ctx.textAlign = 'center';
    ctx.fillText((i + 1) + '', startX + i * w, down ? baseFontSize : baseFontSize + h * 2);
    ctx.stroke();
  }
}
let yearList = []
const drawLine = (ctx: CanvasRenderingContext2D, config: configVo, down: boolean = true) => {
  // 画之前清空画布
  // ctx.clearRect(0, 0, config.width, config.height);
  // 设置画笔属性
  ctx.strokeStyle = '#333'; // 画笔颜色
  ctx.lineWidth = 1; // 画笔大小
  ctx.font = '12'; //字体大小

  ctx.beginPath()
  ctx.moveTo(startX, down ? baseFontSize + config.h : config.h)
  ctx.lineTo(config.width + startX, down ? baseFontSize + config.h : config.h)
  ctx.stroke()
  ctx.closePath()
  if (yearList.length > 0) {
    ctx.beginPath()
    ctx.moveTo(startX, down ? baseFontSize + config.h : 0)
    ctx.lineTo(startX, down ? baseFontSize + config.h + config.h : config.h)
    ctx.stroke()
    ctx.closePath()
    let x  = 0
    for (let i = 0; i < yearList.length; i++) {
      ctx.beginPath()
      x = x + yearList[i].day
      ctx.moveTo(startX + (x - 1) * w, down ? baseFontSize + config.h : 0)
      ctx.lineTo(startX + (x - 1) * w, down ? baseFontSize + config.h + config.h : config.h)
      ctx.stroke();
      ctx.beginPath()
      // ctx.moveTo(i == 0 ? startX : startX + (x - 1) * w, down ? baseFontSize + config.h : 0)
      // ctx.lineTo(startX + (x - 1) * w, down ? baseFontSize + config.h : 0)
      ctx.textAlign = 'center'
      ctx.fillText(yearList[i].year + '-' + yearList[i].month, i * config.width / yearList.length + yearList[i].day * w / 2, down ? baseFontSize + config.h + config.h : config.h - 1)
      ctx.closePath()
    }
  }
}
const radius = 10;

const drawFun = (canvasCenter, ctxCenter) => {
  const h = canvasCenter.height
  ctxCenter.clearRect(0, 0, canvasCenter.width, canvasCenter.height)
  // drawCircle(ctxCenter, startX + (1 - 1) * w, h / 2, '1')
  drawCircle(ctxCenter, startX + (59 - 1) * w, h / 2, '15')
  // drawArrow(ctxCenter, startX + radius, h / 2, (59 - 1) * w + radius, h / 2, 1, '#333', 59 * w, 59, h / 2, 'A', 0)
  drawCircle(ctxCenter, startX + (59 + 20 - 1) * w, h / 2 - 50, '16')
  drawArrow(ctxCenter, startX + (59 - 1) * w, h / 2 - radius, startX + (79 - 1) * w - radius, h / 2 - 50, 1, '#333', 20 * w, 20, h / 2, 'B', 0)
  drawCircle(ctxCenter, startX + (59 + 61 - 1) * w, h / 2, '18')
  drawArrow(ctxCenter, startX + (59 - 1) * w + radius, h / 2, startX + (59 + 61 - 1) * w - radius, h / 2, 1, '#333', 61 * w, 61, h / 2, 'D', 0)
  drawCircle(ctxCenter, startX + (59 + 20 + 28 + 13 - 1) * w, h / 2 - 50, '17')
  drawArrow(ctxCenter, startX + (59 - 1) * w, h / 2 + radius, startX + (59 + 45 + 16 - 1) * w - radius, h / 2 + 50, 1, '#333', 45 * w, 45, h / 2, 'E', 16)
  drawCircle(ctxCenter, startX + (59 + 45 + 16 - 1) * w, h / 2 + 50 , '19')
  drawCircle(ctxCenter, startX + (59 + 61 + 31 - 1) * w, h / 2, '20')
  drawArrow(ctxCenter, startX + (59 + 20 - 1) * w + radius, h / 2 - 50, startX + (59 + 20 + 28 + 13 - 1) * w - radius, h / 2 - 50, 1, '#333', 28 * w, 28, h / 2, 'C', 13)
  drawArrow(ctxCenter, startX + (59 + 20 + 28 + 13 - 1) * w, h / 2 - 50 + radius, startX + (59 + 61 - 1) * w, h / 2 - radius, 1, '#333', 0, 0, h / 2, '', 1)
  drawArrow(ctxCenter, startX + (59 + 45 + 16 - 1) * w, h / 2 + 50 - radius, startX + (59 + 61 - 1) * w, h / 2 + radius, 1, '#333', 0 , 0 , h / 2, '', 1)
  drawArrow(ctxCenter, startX + (59 + 61 - 1) * w + radius, h / 2, startX + (59 + 61 + 31 - 1) * w- radius, h / 2, 1, '#333', 31 * w, 31, h / 2, 'F', 0)

  drawCircle(ctxCenter, startX + (1 - 1) * w, h / 2, '2')
  drawCircle(ctxCenter, startX + (7 - 1) * w, h / 2, '3')
  drawArrow(ctxCenter, startX + radius, h / 2, (7 - 1) * w + radius, h / 2, 1, '#333', 59 * w, 0, h / 2, '', 0)
  drawCircle(ctxCenter, startX + (7 - 1 + 40) * w, h / 2 - 100, '5')
  drawArrow(ctxCenter, startX + (7 - 1) * w, h / 2 - radius, startX + (7 - 1 + 40) * w - radius, h / 2 - 100, 1, '#333', 40 * w, 40, h / 2, '3', 0)
  drawCircle(ctxCenter, startX + (7 - 1 + 40) * w, h / 2 - 50, '4')
  drawArrow(ctxCenter, startX + (7 - 1) * w, h / 2 - radius, startX + (7 - 1 + 40) * w - radius, h / 2 - 50, 1, '#333', 30 * w, 30, h / 2, '4', 10)
  drawCircle(ctxCenter, startX + (20 + 7 - 1) * w, h / 2, '6')
  drawArrow(ctxCenter, startX + (7 - 1 + 40) * w, h / 2 - 100 + radius, startX + (7 - 1 + 40) * w, h / 2 - 50 - radius, 1, '#333', 0, 0, h / 2, '', 0)
  drawArrow(ctxCenter, startX + (7 - 1) * w + radius, h / 2, (20 + 7 - 1) * w + radius, h / 2, 1, '#333', 20 * w, 20, h / 2, '3-1', 0)
  drawCircle(ctxCenter, startX + (7 - 1 + 20) * w, h / 2 + 50, '7')
  drawArrow(ctxCenter, startX + (7 - 1) * w, h / 2 + radius, (20 + 7 - 1) * w + radius, h / 2 + 50, 1, '#333', 20 * w, 20, h / 2, '3-2', 0)
  drawCircle(ctxCenter, startX + (7 - 1 + 7) * w, h / 2 + 100, '8')
  drawArrow(ctxCenter, startX + (7 - 1) * w, h / 2 + radius, startX + (7 - 1 + 7) * w - radius, h / 2 + 100, 1, '#333', 8 * w, 8, h / 2, '3-3', 0)
  drawCircle(ctxCenter, startX + (7 - 1 + 15 + 5) * w, h / 2 + 150, '9')
  drawArrow(ctxCenter, startX + (7 - 1) * w, h / 2 + radius, startX + (7 - 1 + 15 + 5) * w - radius, h / 2 + 150, 1 , '#333', 15 * w, 15, h / 2, '3-4', 5)
  drawCircle(ctxCenter, startX + (7 + 7 - 1 + 13) * w, h / 2 + 100, '10')
  drawArrow(ctxCenter, startX + (7 - 1 + 7) * w + radius, h / 2 + 100, startX + (7 - 1 + 7 + 13) * w - radius, h / 2 + 100, 1, '#333', 13 * w, 13, h / 2, '3-5', 0)
  drawCircle(ctxCenter, startX + (7 + 7 - 1 + 13 + 10) * w, h / 2 + 100, '11')
  drawCircle(ctxCenter, startX + (20 + 7 + 10 - 1) * w, h / 2, '12')
  drawArrow(ctxCenter, startX + (7 + 7 - 1 + 13 + 7 + 3) * w, h / 2 + 100 - radius, startX + (20 + 7 + 10 - 1) * w, h / 2 + radius, 1, '#333', 0, 0, h / 2, '', 0)
  drawArrow(ctxCenter, startX + (7 + 7 - 1 + 13) * w + radius, h / 2 + 100, startX + (7 + 7 - 1 + 13 + 10) * w - radius, h / 2 + 100, 1, '#333', 4 * w, 4, h / 2, '3-6', 3)
  drawArrow(ctxCenter, startX + (20 + 7 - 1) * w + radius, h / 2, (20 + 7 + 10 - 1) * w + radius, h / 2, 1, '#333', 10 * w, 10, h / 2, '3-7', 0)
  drawCircle(ctxCenter, startX + (20 + 7 + 10 + 10 - 1) * w, h / 2, '13')
  drawArrow(ctxCenter, startX + (20 + 7 + 10 - 1) * w + radius, h / 2, (20 + 7 + 10 + 10 - 1) * w + radius, h / 2, 1, '#333', 10 * w, 10, h / 2, '3-8', 0)
  drawArrow(ctxCenter, startX + (20 + 7 + 10 + 10 - 1) * w + radius, h / 2, startX + (59 - 1) * w - radius, h / 2, 1 , '#333',  12 * w, 12, h / 2, '5', 0)

  drawArrow(ctxCenter, startX + (7 - 1 + 40) * w, h / 2 - 50 + radius, startX + (7 - 1 + 40) * w, h / 2 - radius, 1, '#333', 0, 0, h / 2, '', 0 )

  drawCircle(ctxCenter, startX + (20 + 7 + 10 + 10 - 1) * w, h / 2 + 200, '14')
  drawArrow(ctxCenter, startX + (7 - 1) * w, h / 2 + radius, startX + (20 + 7 + 10 + 10 - 1) * w - radius, h / 2 + 200, 1, '#333', 25 * w, 25,  h / 2, '4', 15)

  drawArrow(ctxCenter, startX + (20 + 7 + 10 + 10 - 1) * w, h / 2 + 200 - radius, startX + (20 + 7 + 10 + 10 - 1) * w, h / 2 + radius, 1, '#333', 0, 0, h / 2, '', 0)
}

// const drawFun = (canvasCenter, ctxCenter) => {
//   ctxCenter.clearRect(0, 0, canvasCenter.width, canvasCenter.height)
//   drawCircle(ctxCenter, startX, canvasCenter.height / 2, 1)
//   drawCircle(ctxCenter, startX + 2 * w, canvasCenter.height / 2, 2)
//   drawArrow(ctxCenter, startX + radius, canvasCenter.height / 2, 2 * w + radius, canvasCenter.height / 2, 1, '#333', 2 * w, 'A', canvasCenter.height / 2)
//   drawCircle(ctxCenter, startX + 3 * w, 50, 3)
//   drawArrow(ctxCenter, 2 * w + startX, canvasCenter.height / 2 - radius, 3 * w + radius, 50, 1, '#333', 1 * w, 'B', canvasCenter.height / 2)
//   drawCircle(ctxCenter, startX + 5 * w, canvasCenter.height / 2, 4)
//   drawArrow(ctxCenter, 3 * w + startX + radius, 50, 5 * w + startX, canvasCenter.height / 2 - radius,  1, '#333', 1 * w, 'C', canvasCenter.height / 2)
//   drawArrow(ctxCenter, 2 * w + startX + radius, canvasCenter.height / 2, 5 * w + startX - radius , canvasCenter.height / 2, 1, '#333', 3 * w, 'D', canvasCenter.height / 2);
//   drawCircle(ctxCenter, startX + 4 * w, 250, 5)
//   drawArrow(ctxCenter, 2 * w + startX, canvasCenter.height / 2 + radius, 4 * w + startX - radius, 250, 1, '#333', 2 * w, 'E', canvasCenter.height / 2)
//   drawArrow(ctxCenter, 5 * w + startX + radius, canvasCenter.height / 2, 10 * w + startX - radius, canvasCenter.height / 2, 1, '#333', 5 * w, 'F', canvasCenter.height / 2)
//   drawCircle(ctxCenter, startX + 10 * w, 150, 6)
//   drawArrow(ctxCenter, 4 * w + startX + radius, 250, 10 * w + startX, canvasCenter.height / 2 + radius, 1, '#333', 6 * w, 'G', canvasCenter.height / 2)
// }
let canvas = null
let context = null
let canvasTwo = null
let ctx = null
let canvasCenter = null
let ctxCenter = null

const init = () => {
  canvas = document.getElementById('canvas') as HTMLCanvasElement;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;
  draw(context, config, true);
  drawLine(context, config, true) ;
  canvasTwo = document.getElementById('canvasTwo') as HTMLCanvasElement;
  ctx = canvasTwo.getContext('2d') as CanvasRenderingContext2D;
  draw(ctx, config, false)
  drawLine(ctx, config, false)
  canvasCenter = document.getElementById('canvasCenter') as HTMLCanvasElement;
  ctxCenter = canvasCenter.getContext('2d') as CanvasRenderingContext2D;
  drawFun(canvasCenter, ctxCenter)
    // drawFunTow()
  context.strokeStyle = '#000000';
  context.lineWidth = 2;
}
onMounted(() => {
  state.listQuery.time = ['2021-01-01', '2021-05-31']
  handleTimeChange(state.listQuery.time)
  init()
})
// 页面滚动
const mouseWheel = (e: any) => {
  if (e.wheelDelta || e.detail) {
    if (e.wheelDelta > 0 || e.detail < 0) {     //当鼠标滚轮向上滚动时
      console.log("向上")
    }
    if (e.wheelDelta < 0 || e.detail > 0) {     //当鼠标滚轮向下滚动时
      console.log("向下")
    }
  }
}

const handleTimeChange = (val: any) => {
  if (val) {
    state.listQuery.startTime = val[0]
    state.listQuery.endTime = val[1]
    yearList = timeSlice(val[0], val[1], 1, [])
    config.size = timeDeal(val[0], val[1], 'day')
    console.log(config.size, 'sss')
    init()
  }
}
const handleDiffChange = () => {
  init()
}
</script>
