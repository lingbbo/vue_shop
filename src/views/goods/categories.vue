<template>
<el-card>
  <el-row>
    <el-col>
      <el-button type="primary" @click="addVisible = true">添加分类</el-button>
    </el-col>
  </el-row>
  <!-- 表格 -->
  <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
    <!-- 是否有效 -->
    <template slot="isok" slot-scope="scope">
      <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
      <i class="el-icon-error" v-else style="color: red;"></i>
    </template>
    <!-- 排序 -->
    <template slot="order" slot-scope="scope">
      <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
      <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
      <el-tag type="warning" size="mini" v-else>三级</el-tag>
    </template>
    <!-- 操作 -->
    <template slot="opt" slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编 辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删 除</el-button>
    </template>
  </tree-table>

  <!-- 分页区域 -->
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
  </el-pagination>

  <el-dialog
    title="提示"
    :visible.sync="addVisible"
    width="50%"
    :before-close="beforeClose">
    <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name" >
        <el-input type="text" v-model="addForm.cat_name" ></el-input>
      </el-form-item>
      <el-form-item label="父级分类" prop="cat_pids">
        <el-cascader
          v-model="addForm.cat_pids"
          :options="parentCateList"
          :props="cascaderProps"
          ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="submitCate()">确 定</el-button>
       </span>
  </el-dialog>
</el-card>
</template>

<script>
export default {
  name: 'categories',
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      cascaderProps:
        {
          checkStrictly: true,
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
      parentCateList: [],
      addVisible: false,
      addForm: {},
      rules: {
        cat_name: { required: true },
        cat_pids: { required: true }
      }
    }
  },
  created() {
    this.getCateList()
    this.getParentCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      console.log(res.data)
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    editCate(row) {},
    async handleDelete(row) {
      const asyncConfirm = await this.$confirm(
        '此操作将永久删除该商品分类, 是否继续！',
        {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).catch((e) => e)
      if (asyncConfirm !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete('categories/' + row.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.qryData()
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      console.log(res.data)
      this.parentCateList = res.data
    },
    beforeClose() {
      this.addVisible = false
    },
    closeDialog() {
      this.addVisible = false
    },
    submitCate() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const params = {
          cat_name: this.addForm.cat_name,
          cat_pid: this.addForm.cat_pids[this.addForm.cat_pids.length - 1],
          cat_level: this.addForm.cat_pids.length,
          cat_id: 0
        }
        const { data: res } = await this.$http.post('/categories', params)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
      })
    }
  }
}
</script>

<style scoped>

</style>
