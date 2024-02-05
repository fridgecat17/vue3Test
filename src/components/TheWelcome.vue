<template>
  <el-table-v2
    :columns="columns"
    :data="tableData"
    :fixed-data="fixedData"
    :width="1000"
    :height="400"
    :row-class="rowClass"
    fixed
    @scroll="onScroll"
  />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { getStudentList } from '../api/test/student'
import { parseTime } from '../utils/common.js'

onMounted(() => {
  getTableData()
})
const columns = [
{ key: 'id', title: '', dataKey: 'id',width: 70},
{ key: 'name', title: 'Username', dataKey: 'name', width: 100},
{ key: 'user', title: 'UserId', dataKey: 'user', width: 100},
{ key: 'sex', title: 'Sex', dataKey: 'sex', width: 100},
{ key: 'desc', title: 'Desc', dataKey: 'desc', width: 450},
{ key: 'createDate', title: 'createTime', dataKey: 'createDate', width: 150}
]

const rowClass = ({ rowIndex }) => {
  if (rowIndex < 0 || (rowIndex + 1) % 5 === 0) return 'sticky-row'
}

const data = ref([])
const stickyIndex = ref(0)

const fixedData = computed(() => data.value.slice(stickyIndex.value, stickyIndex.value + 1))
const tableData = computed(() => {
  return data.value.slice(1)
})

const onScroll = ({ scrollTop }) => {
  stickyIndex.value = Math.floor(scrollTop / 250) * 5
}
const getTableData = () => {
  getStudentList().then((res) => {
    if (res.code == 0) {
      data.value = res.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          user: item.user,
          sex: item.sex == 0 ? 'male' : 'female',
          desc: item.desc,
          createDate: parseTime(item.createDate)
        }
      })
    } else {
      data.value = []
    }
  })
}
</script>

<style>
.el-el-table-v2__fixed-header-row {
  background-color: var(--el-color-primary-light-5);
  font-weight: bold;
}
</style>
