<template>
  <mavon-editor ref="md" v-model="content" :id="id" :toolbars="toolbars" @imgAdd="uploadImg">
    <input v-model="htmlCode" type="hidden">
  </mavon-editor>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import toolbars from './toolbars'
import { uploadImage } from '@/api/upload'

export default {
  name: 'MarkdownEditor',
  components: {
    'mavon-editor': mavonEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    htmlCode: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default() {
        return 'mavon-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    toolbars: {
      type: Object,
      default() {
        return toolbars
      }
    }
  },
  computed: {
    content: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
      htmlCode() {
        return this.$refs.md.d_render
      }
    }
  },
  methods: {
    uploadImg(pos, $file) {
      // 将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('image', $file)
      uploadImage(formdata).then(response => {
        this.$message.success(response.msg)
        // 将返回的url替换到文本原位置
        this.$refs.md.$img2Url(pos, response.url)
      })
    }
  }
}
</script>
