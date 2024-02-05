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
      <el-form-item label="Student Name" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="Student User" prop="user">
        <el-input v-model="ruleForm.user" />
      </el-form-item>
      <el-form-item label="Student Sex" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="male" />
          <el-radio label="female" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Student desc" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
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
import { setStudent } from '../api/test/student'
const router = useRouter();
interface RuleForm {
  name: string
  user: string
  sex: string
  desc: string
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const { proxy } = getCurrentInstance()
const ruleForm = reactive<RuleForm>({
  name: '',
  user: '',
  sex: 'female',
  desc: ''
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input Student name', trigger: 'blur' },
    { min: 3, max: 15, message: 'Length should be 3 to 15', trigger: 'blur' }
  ],
  user: [{ required: true, message: 'Please input Student userId', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const query = {
        name: ruleForm.name,
        user: ruleForm.user,
        sex: ruleForm.sex == 'male' ? 0 : 1,
        desc: ruleForm.desc
      }
      setStudent(query).then((res) => {
        if (res.code == 0) {
          proxy.$modal.msgSuccess('创建成功')
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
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
