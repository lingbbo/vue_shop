<template>
  <el-card>
    <!--      提示信息-->
    <el-alert title="添加商品信息" type="info" show-icon :center="true" :closable="false" align-center></el-alert>
    <!--步骤条-->
    <el-steps :space="200" :active="parseInt(activeName)" finish-status="success" :align-center="true">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!--      步骤面板-->
    <el-form :model="baseForm" ref="bbForm" :rules="rules">
      <el-tabs :tab-position="'left'" v-model="activeName" @tab-click="tabClick" :before-leave="beforeTabLeave">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="baseForm.goods_name" type="text"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="baseForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="baseForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="baseForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="baseForm.goods_cat"
              :options="catList"
              :props="cascaderProps"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 渲染表单的Item项 -->
          <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
            <!-- 复选框组 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器组件 -->
          <quill-editor v-model="baseForm.goods_introduce"></quill-editor>
          <!-- 添加商品的按钮 -->
          <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
        <el-tab-pane label="完成" name="5">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </el-card>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'goodsInfo',
  data() {
    return {
      activeName: '0',
      baseForm: {
        goods_name: '',
        goods_price: 2,
        goods_weight: 2,
        goods_number: 2,
        goods_cat: [],
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      catList: [],
      cascaderProps:
          {
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
          },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      headerObj: {
        Authorization: localStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  watch: {},
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
      console.log(this.baseForm.goods_cat)
      if (this.baseForm.goods_cat.length !== 3) {
        this.baseForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.baseForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClick(val) {
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(
            `categories/${this.baseForm.goods_cat[2]}/attributes`,
            {
              params: { sel: 'many' }
            }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
            `categories/${this.baseForm.goods_cat[2]}/attributes`,
            {
              params: { sel: 'only' }
            }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败！')
        }

        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.baseForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.baseForm.pics.splice(i, 1)
      console.log(this.baseForm)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response.data.tmp_path)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.baseForm.pics.push(picInfo)
      console.log(this.baseForm)
    },
    // 添加商品
    add() {
      this.$refs.bbForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.baseForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.baseForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.baseForm.attrs.push(newInfo)
        })
        form.attrs = this.baseForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped>

</style>
