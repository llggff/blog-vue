<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="参数名" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入参数名"/>
      </el-form-item>
      <el-form-item label="参数值" prop="value">
        <el-input v-model="dataForm.value" placeholder="请输入参数值"/>
      </el-form-item>
      <el-form-item label="描述信息" prop="description">
        <el-input v-model="dataForm.description" placeholder="请输入描述内容"/>
      </el-form-item>
      <el-form-item label="参数类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">全局变量</el-radio>
          <el-radio :label="2">系统配置</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { putConfig, postConfig } from '@/api/config'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        value: '',
        description: '',
        type: 1
      },
      dataRule: {
        name: [
          { required: true, message: '参数名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          putConfig(id).then(response => {
            this.dataForm = response.data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postConfig(this.dataForm).then(response => {
            this.$message.success(response.msg)
            this.visible = false
            this.$emit('refreshDataList')
          })
        }
      })
    }
  }
}
</script>
