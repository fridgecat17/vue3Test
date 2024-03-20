<template>
  <el-tooltip :disabled="isShowTooltip" :content="textValue" effect="light" placement="top">
    <span @mouseover="onMouseOver(name)" >
      <div class="emp">
        <span :ref="name" :style="{ color: textColor }">
          {{ textValue }}
        </span>
      </div>
    </span>
  </el-tooltip>
</template>
<script>
export default {
  name: 'TextTooltip',
  props: {
    textValue: String,
    textColor: {
      type: String,
      default: '#606266'
    },
    name: String
  },
  data() {
    return {
      isShowTooltip: false
    }
  },
  methods: {
    onMouseOver(str) { // 内容超出，显示文字提示内容
      this.$nextTick(() => {
        const tag = this.$refs[str]
        const contentWidth = tag.offsetWidth // 获取元素可视宽度
        const parentWidth = tag.parentNode.offsetWidth // 获取元素父级可视宽度
        // console.log(tag, contentWidth, parentWidth)
        this.isShowTooltip = contentWidth <= parentWidth
      })
    }
  }
}
</script>
<style lang="css" scoped>
.emp{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
