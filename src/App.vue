<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TodoList from './components/TodoList.vue'
</script>

<template>
  <div class="app-container">
    <Sidebar />
    <TodoList />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>
