<template>
<el-card>
  <!--      提示信息-->
  <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :center="true" :closable="false" align-center></el-alert>
  <el-row>
  选择商品分类：
  <el-cascader
    v-model="goods_cat"
    :options="catList"
    :props="cascaderProps"
    @change="handleChange"
    placeholder="请选择"
  style="margin-top: 15px; margin-bottom: 15px"></el-cascader>
</el-row>
  <el-tabs v-model="activeName" >
    <el-tab-pane label="动态参数" name="first">
      <el-row>
        <el-button type="primary" size="mini" @click="addParams" :disabled="!goods_cat || goods_cat.length < 2">添加参数</el-button>
      </el-row>
      <el-table :data="paramsList" border class="params_table" ref="table">
        <el-table-column width="80" align="center">
            <template slot-scope="scope">
              <i class="el-icon-arrow-down" v-if="scope.row.attr_id === currentIndex" @click="toogleExpand(scope.row)"></i>
              <i class="el-icon-arrow-left" v-else @click="toogleExpand(scope.row)"></i>
            </template>
          </el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
        <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(scope.row)">删除</el-button>
            </template>
        </el-table-column>
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <div style="padding: 20px 50px;">
                <el-tag v-for="(item, index) in props.row.attr_vals.split(' ')" :key="index" closable @close="closeActive(props.row,index)" v-show="props.row.attr_vals.length > 0">
                  {{item}}
                </el-tag>
                <el-input type="text" size="small" class="attr_inner" v-model="newAttr" ref="newAttr" @blur="addAttr(props.row)" v-if="showAdd"></el-input>
                <el-button  size="small" plain @click="editActiveButton" v-else>+ New Tag</el-button>
              </div>
            </template>
          </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="second"></el-tab-pane>
  </el-tabs>

  <el-dialog
    title="提示"
    :visible.sync="visible"
    width="35%"
    :before-close="beforeClose">
    <el-form :model="paramsForm" status-icon  ref="paramsForm" label-width="100px">

      <el-form-item label="分配新角色">
        <el-input type="text" v-model="paramsForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" style="text-align: center">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="submitParams()">确 定</el-button>
  </span>
  </el-dialog>
</el-card>
</template>

<script>
import { trim } from '@/utils'
export default {
  name: 'params',
  data() {
    return {
      goods_cat: [],
      catList: [],
      cascaderProps:
        {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
      activeName: 'first',
      paramsList: [],
      showAdd: false,
      newAttr: '',
      visible: false,
      paramsForm: {},
      currentIndex: -1
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    async getOptions() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catList = res.data
    },
    handleChange() {
      if (this.goods_cat.length !== 3) {
        this.goods_cat = []
        this.paramsList = []
        return
      }
      this.qryParams(this.goods_cat[2])
    },
    async qryParams(val) {
      const { data: res } = await this.$http.get(`categories/${val}/attributes`, { params: { sel: 'many' } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.paramsList = res.data
    },
    async deleteAttr(row) {
      const { data: res } = await this.$http.delete(`categories/${this.goods_cat[2]}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success(res.meta.msg)
      this.qryParams(this.goods_cat[2])
    },
    closeActive(row, index) {
      const aa = row.attr_vals.split(' ')
      aa.splice(index, 1)
      row.attr_vals = aa.join(' ')
      this.addAttr(row, 'del')
    },
    async addAttr(row, param) {
      debugger
      if (!param) {
        if (!this.newAttr || this.newAttr.length === 0 || trim(this.newAttr).length === 0) {
          this.showAdd = false
          this.newAttr = ''
          return
        }
        if (row.attr_vals.length > 0) {
          row.attr_vals = row.attr_vals.concat(' ' + trim(this.newAttr))
        } else {
          row.attr_vals = trim(this.newAttr)
        }
      }
      const params = {
        attr_name: row.attr_name,
        attr_sel: 'many',
        attr_vals: row.attr_vals
      }
      debugger
      const { data: res } = await this.$http.put(`categories/${this.goods_cat[2]}/attributes/${row.attr_id}`, params)
      if (res.meta.status !== 200 && res.meta.status !== 201) {
        debugger
        this.newAttr = ''
        this.showAdd = false
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.newAttr = ''
      this.showAdd = false
    },
    editActiveButton() {
      this.showAdd = true
      this.$nextTick(() => {
        this.$refs.newAttr.$refs.input.focus()
      })
    },
    addParams() {
      this.visible = true
    },
    beforeClose() {
      this.paramsForm = {}
      this.visible = false
    },
    closeDialog() {
      this.paramsForm = {}
      this.visible = false
    },
    submitParams() {
      this.$refs.paramsForm.validate(async (valid) => {
        if (!valid) return
        const params = {
          attr_name: this.paramsForm.attr_name,
          attr_sel: 'many'
        }
        const { data: res } = await this.$http.post(`categories/${this.goods_cat[2]}/attributes`, params)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.visible = false
        this.qryParams(this.goods_cat[2])
      })
    },
    toogleExpand(row) {
      const $table = this.$refs.table
      this.paramsList.map((item) => {
        if (row.attr_id !== item.attr_id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      this.$nextTick(() => {
        $table.toggleRowExpansion(row)
      })
      if (this.currentIndex === row.attr_id) {
        this.currentIndex = '-1'
        return
      }
      this.currentIndex = row.attr_id
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    font-size: 14px !important;
  }
  .el-table__expanded-cell{
    padding: 20px 50px;
  }
  .attr_inner.el-input {
    width: 100px !important;
  }
</style>
