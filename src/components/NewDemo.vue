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
let canvas = null
let context = null
let canvasTwo = null
let ctx = null
let canvasCenter = null
let ctxCenter = null
const state = reactive({
  listQuery: {
    time: [],
    startTime: '',
    endTime: '',
    diff: 3,
  },
  dataList: [
    { id: '1', workName: '', workTime: 0, freeTime: 0, totalCountTime: 0, isMainWork: true, totalTime: 1, children: [
      { id: '1.1', workName: 'A', workTime: 59, freeTime: 0, totalCountTime: 0, isMainWork: true, totalTime: 59, children: [
        { id: '2', workName: 'B', workTime: 20, freeTime: 0, totalCountTime: 13, isMainWork: false, totalTime: 79, children: [
          { id: '3', workName: 'C', workTime: 28, freeTime: 13, totalCountTime: 13, isMainWork: false, totalTime: 120, children: [
            { id: '4', workName: '', workTime: 0, freeTime: 0, totalCountTime: 0, isMainWork: true, totalTime: 120, children: []}
          ]}
        ]},
        { id: '4', workName: 'D', workTime: 61, freeTime: 0, totalCountTime: 0, isMainWork: true, totalTime: 120, children: [
          { id: '6', workName: 'F', workTime: 31, freeTime: 0, totalCountTime: 0, isMainWork: true, totalTime: 151, children: [] }
        ]},
        { id: '5', workName: 'E', workTime: 45, freeTime: 16, totalCountTime: 16, isMainWork: false, totalTime: 120, children: [
          { id: '4', workName: '', workTime: 0, freeTime: 0, totalCountTime: 0, isMainWork: true, totalTime: 120, children: []}
        ]}
      ]}
    ]}
  ]
})
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
  // drawFunTwo(canvasCenter, ctxCenter)
  // drawFunTow()
  drawMainLine(canvasCenter, ctxCenter)
  context.strokeStyle = '#000000';
  context.lineWidth = 2;
}
const drawMainLine = (canvasCenter, ctxCenter) => {
  const h = canvasCenter.height
  ctxCenter.strokeStyle = '#333'; // 画笔颜色
  ctxCenter.lineWidth = 1; // 画笔大小
  drawFun(state.dataList, h)
}
const drawFun = (value: any, h) => {
  const smallHeight = 50
  value.forEach((item: any) => {
    if (item.isMainWork) {
      drawCircle(ctxCenter, startX + (item.totalTime - 1) * w, h / 2, item.id)
      if (item.children && item.children.length > 0) {
        // item.children.map((item: any) => {})
        const notMainWorkArray = item.children.filter((item: any) => { return !item.isMainWork })
        const mainWorkArray = item.children.filter((item: any) => { return item.isMainWork })
        mainWorkArray.forEach((child: any) => {
          drawArrow(ctxCenter, startX + (item.totalTime - 1) * w + radius, h / 2, startX + (child.totalTime - 1) * w - radius, h / 2, 1, '#333', child.workTime * w, child.workTime, h / 2, child.workName, child.freeTime)
        })
        notMainWorkArray.map((notMainChild: any, index: number) => {
          notMainChild.newH = ((index + 1) % 2 == 0 ? 1 : -1) * ((index + 1) / 2 >= 1 ? (index + 1) / 2 : 1) * smallHeight + h / 2
          drawCircle(ctxCenter, startX + (notMainChild.totalTime - 1) * w, notMainChild.newH, notMainChild.id)
          if (notMainChild.newH > (h / 2)) {
            drawArrow(ctxCenter, startX + (item.totalTime - 1) * w, h / 2 + radius, startX + (notMainChild.totalTime - 1) * w - radius, notMainChild.newH, 1, '#333', notMainChild.workTime * w, notMainChild.workTime, h / 2, notMainChild.workName, notMainChild.freeTime)
          } else {
            drawArrow(ctxCenter, startX + (item.totalTime - 1) * w, h / 2 - radius, startX + (notMainChild.totalTime - 1) * w - radius, notMainChild.newH, 1, '#333', notMainChild.workTime * w, notMainChild.workTime, h / 2, notMainChild.workName, notMainChild.freeTime)
          }
        })
        notMainWorkArray.map((item: any) => {
          item.children.map((newItem: any) => {
            if (item.id === newItem.id) {
              newItem.newH = item.newH
            }
          })
        })
        drawFun(item.children, h)
      }
    } else {
      console.log('test')
      if (item.children && item.children.length > 0) {
        item.children.forEach((newItem: any) => {
          console.log(newItem, 'stss')
          newItem.newH = item.newH
          if (!newItem.isMainWork) {
            drawCircle(ctxCenter, startX + (newItem.totalTime - 1) * w, item.newH, newItem.id)
            drawArrow(ctxCenter, startX + (item.totalTime - 1) * w + radius, item.newH, startX + (newItem.totalTime - 1) * w - radius, item.newH, 1, '#333', newItem.workTime * w, newItem.workTime, h / 2, newItem.workName, newItem.freeTime)
          } else {
            if (item.newH > h / 2) {
              drawArrow(ctxCenter, startX + (item.totalTime - 1) * w, item.newH - radius, startX + (newItem.totalTime - 1) * w, h / 2 + radius, 1, '#333', newItem.workTime * w, newItem.workTime, h / 2, newItem.workName, newItem.freeTime)
            } else {
              drawArrow(ctxCenter, startX + (item.totalTime - 1) * w, item.newH + radius, startX + (newItem.totalTime - 1) * w, h / 2 - radius, 1, '#333', newItem.workTime * w, newItem.workTime, h / 2, newItem.workName, newItem.freeTime)
            }
          }
        })
      }
      drawFun(item.children, h)
    }
  })
}
onMounted(() => {
  state.listQuery.time = ['2021-01-01', '2021-05-31']
  handleTimeChange(state.listQuery.time)
})
// 页面滚动
// const mouseWheel = (e: any) => {
//   if (e.wheelDelta || e.detail) {
//     if (e.wheelDelta > 0 || e.detail < 0) {     //当鼠标滚轮向上滚动时
//       console.log("向上")
//     }
//     if (e.wheelDelta < 0 || e.detail > 0) {     //当鼠标滚轮向下滚动时
//       console.log("向下")
//     }
//   }
// }

const handleTimeChange = (val: any) => {
  if (val) {
    state.listQuery.startTime = val[0]
    state.listQuery.endTime = val[1]
    yearList = timeSlice(val[0], val[1], 1, [])
    config.size = timeDeal(val[0], val[1], 'day')
    init()
  }
}
const handleDiffChange = () => {
  init()
}
</script>

<template>
    <div>
        <el-form ref="ruleForm" :model="state.listQuery" :inline="true">
            <el-form-item label="工期时间：">
                <el-date-picker v-model="state.listQuery.time" type="daterange" @change="handleTimeChange" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
            <el-form-item label="间隔">
                <el-input-number v-model="state.listQuery.diff" :controls="true" :min="1" :max="10" @change="handleDiffChange"></el-input-number>
            </el-form-item>
        </el-form>
    </div>
    <div>
        <canvas id="canvas" width="1040" height="40" style="padding: 20px"></canvas>
        <canvas id="canvasCenter" width="1040" height="440" style="padding: 0 20px"></canvas>
        <canvas id="canvasTwo" width="1040" height="40" style="padding: 20px"></canvas>
    </div>
</template>

<style scoped>

</style>