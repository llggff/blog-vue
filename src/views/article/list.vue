<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.categoryId" filterable clearable placeholder="选择分类" class="filter-item">
        <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-if="!isCustom" v-model="listQuery.status" placeholder="文章状态" clearable class="filter-item" style="width: 130px">
        <el-option key="0" label="草稿" value="0"/>
        <el-option key="1" label="已发布" value="1"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" :default-sort = "{prop: 'id', order: 'descending'}" border fit highlight-current-row style="width: 100%" @sort-change="sortChange">
      <el-table-column align="center" label="ID" sortable="custom" prop="id" width="50"/>

      <el-table-column align="center" label="链接" width="100">
        <template slot-scope="scope">
          <a :href="$store.getters.global.BLOG_URL+scope.row.url+'.html'" class="link-type" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="标题" min-width="100">
        <template slot-scope="scope">
          <a :href="$store.getters.global.BLOG_URL+scope.row.url+'.html'" class="link-type" target="_blank">{{ scope.row.title }}</a>
          <el-tag v-if="!isCustom">{{ categoryFilter(scope.row.categoryId) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="!isCustom" align="center" label="标签" min-width="100">
        <template slot-scope="scope">
          <el-tag v-for="(tag, index) in scope.row.tags" :key="tag.id" :type="tagType(index)">
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" header-align="center" min-width="100" label="描述" prop="description"/>

      <el-table-column v-if="isCustom" :show-overflow-tooltip="true" header-align="center" min-width="150" label="内容" prop="contentMd"/>

      <el-table-column v-if="!isCustom" align="center" label="预览图" width="80">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            trigger="hover">
            <img :src="scope.row.image" width="600">
            <img slot="reference" :src="scope.row.image" :alt="scope.row.image" width="60">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="阅读量" sortable="custom" align="center" prop="visits" width="95"/>

      <el-table-column :formatter="formatTime" width="100" align="center" sortable="custom" label="发布时间" prop="createTime"/>

      <el-table-column :formatter="formatTime" width="100" align="center" sortable="custom" label="更新时间" prop="updateTime"/>

      <el-table-column v-if="!isCustom" align="center" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==1? 'success' : 'info'">{{ scope.row.status==1?'已发布':'草稿' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="!isCustom" align="center" label="置顶" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.top"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.comment" active-color="#13ce66" inactive-color="#ff4949"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button size="mini" icon="el-icon-delete" style="margin-left: 10px;" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import { getCategory } from '@/api/category'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
const tagTypes = ['', 'success', 'info', 'warning', 'danger']
export default {
  name: 'ArticleList',
  components: { Pagination },
  props: {
    isCustom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        title: undefined,
        status: undefined,
        categoryId: undefined,
        ascs: undefined,
        descs: undefined
      },
      categoryOptions: []
    }
  },
  created() {
    if (this.isCustom) {
      this.listQuery.status = 3
    }
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
    // 搜索
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
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
    // 排序
    sortChange(data) {
      if (data.order === 'ascending') {
        this.listQuery.descs = undefined
        this.listQuery.ascs = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      } else {
        this.listQuery.ascs = undefined
        this.listQuery.descs = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      }
      this.handleFilter()
    },
    tagType(index) {
      return tagTypes[index % tagTypes.length]
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
.filter-container {
    padding-bottom: 20px;
}
</style>
