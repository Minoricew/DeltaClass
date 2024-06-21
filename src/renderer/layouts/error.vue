<template>
  <v-app>
    <v-icon class="err-icon" size="70">
      mdi-alert-octagon-outline
    </v-icon>
    <h1>
      {{ errorMessage }}
    </h1>
    <v-btn to="/" class="back-to-home" width="150" rounded text>
      <v-icon>mdi-home-variant-outline</v-icon>返回首页
    </v-btn>
  </v-app>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      errorMessage: '发生错误: 错误码为 ' + this.error.statusCode
    }
  },
  head () {
    return {
      title: '发生错误'
    }
  },
  mounted () {
    console.debug(this.$root.$error.current)
    if (this.error.statusCode === 404) {
      this.$data.errorMessage = '发生错误: 当前页面未找到'
    } else if (this.error.statusCode === 500) {
      this.$data.errorMessage = '发生错误: 应用内部错误, 请报告应用管理员'
    } else if (this.error.statusCode === 403) {
      this.$data.errorMessage = '发生错误: 访问权限不足'
    }
  }
}
</script>

<style>

h1 {
  font-size: 20px;
  margin: 0 auto;
  color: rgba(255, 255, 255, .9) !important;
  margin-top: 10px;
}

.err-icon {
  color: rgba(255, 255, 255, .8) !important;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}

.back-to-home {
  margin: 10px auto !important;
  color: rgba(255, 255, 255, .9) !important;
}

</style>
