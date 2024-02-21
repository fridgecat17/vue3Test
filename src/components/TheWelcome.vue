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
  <el-pagination
    v-if="tableData.length > 0"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :small="true"
    :background="false"
    :total="total"
    layout="prev,pager,next,sizes,total"
    class="pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="tsx" setup>
import { computed, ref } from 'vue'
import { getStudentList, updateStudent } from '../api/test/student'
import { parseTime } from '../utils/common.js'

import { ElInput } from 'element-plus'
import type { FunctionalComponent } from 'vue'
import type { InputInstance } from 'element-plus'
type SelectionCellProps = {
  value: string
  intermediate?: boolean
  onChange: (value: string) => void
  forwardRef: (el: InputInstance) => void
}

const InputCell: FunctionalComponent<SelectionCellProps> = ({ value, onChange, forwardRef }) => {
  return <ElInput ref={forwardRef as any} onInput={onChange} modelValue={value} />
}

const columns = [
  { key: 'name', title: 'Username', dataKey: 'name', width: 150 },
  { key: 'user', title: 'UserId', dataKey: 'user', width: 120 },
  { key: 'sex', title: 'Sex', dataKey: 'sex', width: 100 },
  { key: 'desc', title: 'Desc', dataKey: 'desc', width: 450 },
  { key: 'createDate', title: 'CreateTime', dataKey: 'createDate', width: 150 }
]

columns.forEach(item => {
  if (item.dataKey !== 'createDate') {
    item[`${item.dataKey}Editing`] = false
    item['cellRenderer'] = ({ rowData, column }) => {
      const onChange = (value: string) => {
        rowData[column.dataKey!] = value
      }
      const onEnterEditMode = () => {
        rowData[`${column.dataKey}Editing`] = true
      }
      const onExitEditMode = () => {
        // 失焦后修改信息
        const query = {
          name: rowData.name,
          user: rowData.user,
          sex: rowData.sex == 'male' ? 0 : 1,
          desc: rowData.desc
        }
        updateStudent(query, rowData.id).then(() => {
          rowData[`${column.dataKey}Editing`] = false
        })
      }
      const input = ref()
      const setRef = (el) => {
        input.value = el
        if (el) {
          el.focus?.()
        }
      }
      return rowData[`${column.dataKey}Editing`] ? (
        <InputCell
          forwardRef={setRef}
          value={rowData[column.dataKey!]}
          onChange={onChange}
          onBlur={onExitEditMode}
          onKeydownEnter={onExitEditMode}
        />
      ) : (
        <div class="table-v2-inline-editing-trigger" onClick={onEnterEditMode}>
          {rowData[column.dataKey!] || '--'}
        </div>
      )
    }
  }
})

const rowClass = ({ rowIndex }) => {
  if (rowIndex < 0 || (rowIndex + 1) % 5 === 0) return 'sticky-row'
}

const data = ref([])
const stickyIndex = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fixedData = computed(() => data.value.slice(stickyIndex.value, stickyIndex.value + 1))
const tableData = computed(() => {
  return data.value.slice(1)
})
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getTableData()
}
const onScroll = ({ scrollTop }) => {
  stickyIndex.value = Math.floor(scrollTop / 50) * 1
}
const getTableData = () => {
  getStudentList({
    name: '',
    user: '',
    current: currentPage.value,
    size: pageSize.value,
    pageType: 1
  }).then((res) => {
    if (res.code == 0) {
      data.value = res.data.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          user: item.user,
          sex: item.sex == 0 ? 'male' : 'female',
          desc: item.desc,
          createDate: parseTime(item.createDate)
        }
      })
      total.value = res.data.total
    } else {
      data.value = []
    }
  })
}
getTableData()
</script>

<style>
.el-el-table-v2__fixed-header-row {
  background-color: var(--el-color-primary-light-5);
  font-weight: bold;
}
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
