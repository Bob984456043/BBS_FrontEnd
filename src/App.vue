<template>
<div id="app">
  <upper></upper>
  <router-view :key="$route.path + $route.query.t"></router-view>
</div>
</template>

<script>
import normalize from 'normalize.css'
import upper from './components/header'
export default {
  nam: 'app',
  components: {
    upper
  }
}
</script>
