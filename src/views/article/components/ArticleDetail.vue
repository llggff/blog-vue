<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">

      <sticky :class-name="postForm.status===1?'sub-navbar published':'sub-navbar draft'">
        <CommentDropdown v-model="postForm.isComment" />
        <TopDropdown v-model="postForm.isTop" style="margin-left: 10px;" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="info" @click="submitForm(3)">自定义</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="warning" @click="submitForm(0)">草稿</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm(1)">发布</el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-form-item label-width="45px" label="标题:">
          <el-input :rows="1" v-model="postForm.title" type="textarea" class="article-textarea" autosize placeholder="请输入标题"/>
          <span v-show="titleLength" class="word-counter">{{ titleLength }}字</span>
        </el-form-item>

        <el-form-item label-width="45px" label="摘要:">
          <el-input :rows="1" v-model="postForm.description" type="textarea" class="article-textarea" autosize placeholder="请输入摘要"/>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <div class="postInfo-container">
          <el-row>
            <el-col :span="11">
              <el-form-item label-width="60px" label="预览图:" class="postInfo-container-item">
                <el-input v-model="postForm.image" placeholder="图片地址" class="postInfo-container-input">
                  <el-upload slot="append" :before-upload="beforeImageUpload" :http-request="uploadImg" :show-file-list="false" action="" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
                    <el-button type="primary">上传图片<i class="el-icon-upload el-icon--right"/></el-button>
                  </el-upload>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="11" :offset="2">
              <el-form-item label-width="80px" label="文章标签:" class="postInfo-container-item">
                <el-select v-model="postForm.tags" value-key="id" multiple filterable placeholder="选择标签" class="postInfo-container-input">
                  <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label-width="80px" label="文章分类:" class="postInfo-container-item">
                <el-select v-model="postForm.categoryId" filterable placeholder="选择分类" class="postInfo-container-input">
                  <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" :offset="1">
              <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择发布时间"/>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label-width="80px" label="访问链接:" class="postInfo-container-item">
                <el-input v-model="postForm.url" placeholder="默认使用标题作为链接" class="postInfo-container-input">
                  <template slot="prepend">{{ this.$store.getters.global.BLOG_URL }}</template>
                  <template slot="append">.html</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <mavonEditor ref="md" v-model="postForm.contentMd" :toolbars="toolbars" class="markdown-editor" @imgAdd="uploadImg"/>
      </div>
    </el-form>

  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import toolbars from './toolbars'
import Sticky from '@/components/Sticky' // 粘性header组件
import { putArticle, postArticle } from '@/api/article'
import { getCategory } from '@/api/category'
import { getTag } from '@/api/tag'
import { CommentDropdown, TopDropdown } from './Dropdown'
import { uploadImage } from '@/api/upload'

const defaultForm = {
  title: '', // 文章题目
  description: '', // 文章摘要
  content: '', // 文章内容
  contentMd: '', // markdown格式的文章内容
  categoryId: 1, // 文章分类
  image: undefined, // 文章预览图
  url: undefined, // 文章访问链接
  tags: [],
  id: undefined,
  isComment: true,
  isTop: false,
  visits: 0,
  status: 0
}

export default {
  name: 'ArticleDetail',
  components: { mavonEditor, Sticky, CommentDropdown, TopDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      categoryOptions: [],
      tagOptions: [],
      loading: false,
      tempRoute: {},
      toolbars: toolbars
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length
    },
    titleLength() {
      return this.postForm.title.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)

    getCategory().then(response => {
      this.categoryOptions = response.data
    }).catch()
    getTag().then(response => {
      this.tagOptions = response.data
    }).catch()
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
    uploadImg(data, file) {
      var formdata = new FormData()
      formdata.append('image', file || data.file)
      uploadImage(formdata).then(response => {
        this.$message.success(response.msg)
        file ? this.$refs.md.$img2Url(data, response.data) : this.postForm.image = response.data
      })
    },
    fetchData(id) {
      putArticle(id).then(response => {
        this.postForm = response.data
        // Just for test
        // this.postForm.title += `   Article Id:${this.postForm.id}`
        // this.postForm.description += `   Article Id:${this.postForm.id}`
        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm(status) {
      if (this.postForm.title === '') {
        this.$message.warning('标题不能为空')
        return false
      }
      if (this.postForm.contentMd === '') {
        this.$message.warning('文章内容不能为空')
        return false
      }
      this.loading = true
      this.postForm.status = status
      this.postForm.content = this.$refs.md.d_render
      postArticle(this.postForm).then(response => {
        this.$notify({
          title: '成功',
          message: '保存文章成功',
          type: 'success',
          duration: 2000
        })
        this.postForm = response.data
        this.loading = false
        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        width: 100%;
        float: left;
        .postInfo-container-input{
          width: 100%;
        }
      }
    }
    .markdown-editor {
      min-height: 500px;
      z-index:0;
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
