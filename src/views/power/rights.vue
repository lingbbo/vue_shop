<template>
    <el-card>
      <el-table :data="rightList" border style="width:100%">
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center">
        </el-table-column>
        <el-table-column prop="path" label="路径" align="center">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" align="center">
          <template v-slot="scope">
<!--            <button :type="scope.row.type">{{scope.row.levelName}}</button>-->
            <el-tag :type="scope.row.type">{{scope.row.levelName}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
</template>

<script>
export default {
  name: 'rights',
  data() {
    return {
      rightList: []
    }
  },
  created() {
    this.qryData()
  },
  methods: {
    async qryData() {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.rightList = res.data
      this.rightList.forEach((item) => {
        switch (item.level) {
          case '0' :
            item.type = ''
            item.levelName = '一级权限'
            break
          case '1' :
            item.type = 'success'
            item.levelName = '二级权限'
            break
          case '2':
            item.type = 'warning'
            item.levelName = '三级权限'
            break
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
