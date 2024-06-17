<template>
  <div class="about">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      :size="formSize"
      status-icon
    >
      <el-form-item label="username" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="ruleForm.password" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef,1)"> Login </el-button>
        <el-button @click="submitForm(ruleFormRef,2)"> Register </el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'
import { userLogin, register } from '../api/test/auth'
import { setToken } from '../utils/auth'
const router = useRouter();
type RuleForm = {
  username: string | number,
  password: string | number
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
  password: ''
})

const rules = reactive<FormRules<RuleForm>>({
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 18, message: 'Length should be 6 to 18', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined, type: number) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const query = {
        username: ruleForm.username,
        password: ruleForm.password
      }
      const request = type == 1 ? userLogin : register
      request(query).then((res) => {
        if (res.code == 0) {
          setToken(res.data.token)
          router.push({ path:"/" });
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
    height: 434px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
