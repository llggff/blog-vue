<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" prop="id" width="50"/>

      <el-table-column align="center" label="链接" width="100">
        <template slot-scope="scope">
          <a :href="'https://www.baidu.com'+scope.row.url+'.html'" class="link-type" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="标题" min-width="100">
        <template slot-scope="scope">
          <a :href="'https://www.baidu.com'+scope.row.url+'.html'" class="link-type" target="_blank">{{ scope.row.title }}</a>
          <el-tag>{{ categoryFilter(scope.row.categoryId) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签" min-width="100">
        <template slot-scope="scope">
          <el-tag v-for="(tag, index) in scope.row.tags" :key="tag.id" :type="tagType(index)">
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" min-width="100" label="描述" prop="description" show-overflow-tooltip="true"/>

      <el-table-column align="center" label="预览图" width="80">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            trigger="hover">
            <img :src="scope.row.image" width="600">
            <img slot="reference" :src="scope.row.image" :alt="scope.row.image" width="60">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="阅读量" align="center" prop="visits" width="95"/>

      <el-table-column :formatter="formatTime" width="100" align="center" label="发布时间" prop="createTime"/>

      <el-table-column :formatter="formatTime" width="100" align="center" label="更新时间" prop="updateTime"/>

      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status? 'success' : 'info'">{{ scope.row.status?'已发布':'草稿' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="置顶" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.top"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.comment" active-color="#13ce66" inactive-color="#ff4949"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <!-- <el-button size="mini" icon="el-icon-edit-outline" type="primary" @click="handleModifyStatus(scope.row,'published')">修改
          </el-button> -->
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="warning" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import { getCategory } from '@/api/category'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
const tagTypes = ['', 'success', 'info', 'warning', 'danger']
export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      categoryOptions: []
    }
  },
  created() {
    this.getList()
    getCategory().then(response => {
      this.categoryOptions = response.data
    })
  },
  methods: {
    // 获得数据集合
    getList() {
      this.listLoading = true
      getArticle(this.listQuery).then(response => {
        this.$message.success(response.msg)
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 格式化时间
    formatTime(row, column, cellValue) {
      return parseTime(cellValue)
    },
    // 获得分类
    categoryFilter(categoryId) {
      for (var category of this.categoryOptions) {
        if (category.id === categoryId) {
          return category.name
        }
      }
    },
    tagType(index) {
      return tagTypes[index % tagTypes.length]
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.link-type{
  color: #337ab7;
}
.el-tag+.el-tag {
    margin-left: 10px;
}
.el-button+.el-button{
    margin-left: 0px;
}
</style>
