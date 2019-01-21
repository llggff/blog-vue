<template>
  <el-tabs value="globalConfig" type="card" class="global-info">
    <el-tab-pane label="全局变量" name="globalConfig" class="tag-option">
      <el-form ref="globalForm" :model="globalForm" label-width="100px">

        <el-form-item label="网站标题:" prop="BLOG_TITLE">
          <el-input v-model="globalForm.BLOG_TITLE" class="config-input" placeholder="请输入网站标题"/>
        </el-form-item>

        <el-form-item label="网站关键字:" prop="BLOG_KEYWORDS">
          <el-input v-model="globalForm.BLOG_KEYWORDS" class="config-input" placeholder="请输入关键字"/>
          <el-tooltip class="item" effect="dark" content="关键字之间用,分隔" placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="网站描述:" prop="BLOG_DESCRIPTION">
          <el-input v-model="globalForm.BLOG_DESCRIPTION" class="config-input" placeholder="请输入描述"/>
        </el-form-item>

        <el-form-item label="网站链接:" prop="BLOG_URL">
          <el-input v-model="globalForm.BLOG_URL" class="config-input" placeholder="请输入链接"/>
        </el-form-item>

        <el-form-item label="网站作者:" prop="BLOG_AUTHOR">
          <el-input v-model="globalForm.BLOG_AUTHOR" class="config-input" placeholder="请输入作者"/>
        </el-form-item>

        <el-form-item label="头像:" prop="BLOG_AVATAR">
          <el-input v-model="globalForm.BLOG_AVATAR" placeholder="图片地址" class="config-input">
            <el-upload slot="append" :before-upload="beforeImageUpload" :http-request="uploadImg" :show-file-list="false" data="BLOG_AVATAR" action="" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
              <el-button type="primary">上传图片<i class="el-icon-upload el-icon--right"/></el-button>
            </el-upload>
          </el-input>
          <el-tooltip class="item" effect="dark" content="网站右侧显示的头像" placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="作者简介:" prop="AUTHOR_DESCRIPTION">
          <el-input v-model="globalForm.AUTHOR_DESCRIPTION" class="config-input" placeholder="请输入"/>
          <el-tooltip class="item" effect="dark" content="头像下的描述信息" placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="默认预览图:" prop="DEFAULT_IMAGE">
          <el-input v-model="globalForm.DEFAULT_IMAGE" placeholder="图片地址" class="config-input">
            <el-upload slot="append" :before-upload="beforeImageUpload" :http-request="uploadImg" :show-file-list="false" data="DEFAULT_IMAGE" action="" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
              <el-button type="primary">上传图片<i class="el-icon-upload el-icon--right"/></el-button>
            </el-upload>
          </el-input>
          <el-tooltip class="item" effect="dark" content="文章默认预览图" placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="ICP备案:" prop="FILING_ICP">
          <el-input v-model="globalForm.FILING_ICP" class="config-input" placeholder="请输入备案信息"/>
        </el-form-item>

        <el-form-item label="网安备案:" prop="FILING_SECURITY">
          <el-input v-model="globalForm.FILING_SECURITY" class="config-input" placeholder="请输入备案信息"/>
        </el-form-item>

        <el-form-item>
          <el-button v-loading="loading" type="primary" @click="modifyConfig(globalForm)">修改</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="系统配置" name="sysConfig" class="tag-option">
      <el-form ref="systemForm" :model="systemForm" label-width="130px">

        <el-form-item label="评论是否需要校检:" prop="COMMENT_CHECK">
          <el-switch v-model="systemForm.COMMENT_CHECK" active-value="true" inactive-value="false"/>
        </el-form-item>

        <el-form-item label="图片保存路径:" prop="IMAGE_HOME">
          <el-input v-model="systemForm.IMAGE_HOME" class="config-input" placeholder="请输入图片保存路径"/>
          <el-tooltip class="item" effect="dark" content="上传图片的存储位置" placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="图片访问路径:" prop="IMAGE_URL">
          <el-input v-model="systemForm.IMAGE_URL" class="config-input" placeholder="请输入图片访问路径"/>
          <el-tooltip class="item" effect="dark" content="用于显示图片的URL地址" placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>

        <el-form-item>
          <el-button v-loading="loading" type="primary" @click="modifyConfig(systemForm)">修改</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { uploadImage } from '@/api/upload'
import { getConfig, postConfig } from '@/api/config'

export default {
  data() {
    return {
      loading: false,
      globalForm: this.$store.getters.global,
      systemForm: {}
    }
  },
  created() {
    getConfig(2).then(response => {
      this.systemForm = response.data
    })
  },
  methods: {
    // 验证图片上传格式
    beforeImageUpload(file) {
      const isImage = /^image\/*/.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('上传文件只能是图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    // 上传图片
    uploadImg(data) {
      var formdata = new FormData()
      formdata.append('image', data.file)
      uploadImage(formdata).then(response => {
        this.$message.success(response.msg)
        if (data.data === 'BLOG_AVATAR') {
          this.globalForm.BLOG_AVATAR = response.data
        } else {
          this.globalForm.DEFAULT_IMAGE = response.data
        }
      })
    },
    modifyConfig(from) {
      postConfig(from).then(response => {
        this.$store.dispatch('GetGlobalInfo').then(() => {
          location.reload()
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.global-info {
  padding-left:20px;
  padding-top:10px;
  .tag-option {
    width: 800px;
    .config-input {
      padding-right: 10px;
      width: 650px;
    }
  }
}
</style>
