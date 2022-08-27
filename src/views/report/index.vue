<template>
<el-card>
<!--  为ecahrts准备一个具备大小（宽高的dom）-->
  <div id="main" style="width: 600px; height: 400px"></div>
</el-card>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'reports',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  // 此时，页面上的元素，已经被渲染完毕了！
  async mounted() {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }
    // 4. 准备数据和配置项
    const result = _.merge(res.data, this.options)
    // 5. 展示数据
    myChart.setOption(result)
  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
