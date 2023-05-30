<template>
<!--  <HelloWorld msg="Hello Vue 3.0 + Vite" />-->
<!--  <Demo />-->
<!--  <NewDemo />-->
  <DemoTwo />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Demo from './components/Demo.vue'
import NewDemo from './components/NewDemo.vue'
import DemoTwo from './components/DemoTwo.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Demo,
    NewDemo,
    DemoTwo,
  }
}
</script>
