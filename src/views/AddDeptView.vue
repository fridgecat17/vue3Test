<template>
  <div class="about">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="170px"
      :size="formSize"
      status-icon
    >
      <el-form-item label="Department Name" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="Users" prop="desc">
        <el-select
          v-model="ruleForm.Users"
          multiple
          placeholder="Select"
          style="width: 100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> Create </el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'
import { getStudentList } from '../api/test/student'
import { setClass } from '../api/test/class'
const router = useRouter();
interface RuleForm {
  name: string
  Users: number[]
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const { proxy } = getCurrentInstance()
const ruleForm = reactive<RuleForm>({
  name: '',
  Users: []
})

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: 'Please input Department name', trigger: 'blur' }]
})
const userList = ref([])
const getTableData = () => {
  getStudentList({
    name: '',
    user: '',
    pageType: 0
  }).then((res) => {
    if (res.code == 0) {
      userList.value = res.data.list
    } else {
      userList.value = []
    }
  })
}
getTableData()
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const query = {
        name: ruleForm.name,
        userIds: ruleForm.Users
      }
      setClass(query).then((res) => {
        if (res.code == 0) {
          proxy.$modal.msgSuccess('创建成功')
          router.push({ path:"/deptList" });
        }
      })
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    width: 1000px;
    height: 700px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}
</style>
