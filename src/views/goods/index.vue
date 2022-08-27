<template>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query">
            <el-button slot="append" icon="el-icon-search" @click="qryUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodList" style="width:100%" border>
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column  prop="goods_name" label="商品名称" width="500" show-overflow-tooltip>
        </el-table-column>
        <el-table-column  prop="goods_price" label="商品价格(元)" >
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" >
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
        </el-table-column>
        <el-table-column  label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteUser(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-card>
</template>

<script>
import { formatDate } from '@/utils'
export default {
  name: 'goods',
  data() {
    return {
      query: '',
      goodList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
  },
  created() {
    this.qryUsers()
  },
  methods: {
    async qryUsers() {
      const url = '/goods' + '?pagenum=' + this.pagenum + '&pagesize=' + this.pagesize + '&query=' + this.query
      const { data: res } = await this.$http.get(url)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.goodList = res.data.goods
      this.goodList.forEach((item) => {
        const date = new Date(item.add_time)
        item.add_time = formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      })
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.pagenum = 1
      this.qryUsers()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.qryUsers()
    },
    async handleDeleteUser(row) {
      const url = 'goods/' + row.goods_id
      const { data: res } = await this.$http.delete(url)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success(res.meta.msg)
      this.qryUsers()
    },
    addGoods() {
      this.$router.push({ name: 'goodsInfo' })
    }
  }
}
</script>

<style scoped>

</style>
