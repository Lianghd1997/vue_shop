<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片视图区域-->
      <el-card>
        <el-row>
          <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <!--订单列表-->
        <el-table :data="orderList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="订单编号" prop="order_number" width="250px"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="order_pay">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time" width="200px">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button @click="showEditAddressDialog" type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button @click="showProgressDialog" type="success" icon="el-icon-location" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5,10,15]"
        :total="total"
        layout="total,sizes,prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"></el-pagination>
      </el-card>

      <!--修改地址对话框-->
      <el-dialog
        title="修改地址"
        :visible.sync="editAddressDialogVisible"
        width="50%"
        @close="editAddressDialogClosed">
        <el-form :model="addressForm"
                 ref="addressFormRef"
                 :rules="addressFormRules">
          <el-form-item label="省市区/县" prop="address1">
            <!--<el-input v-model="addressForm.address1"></el-input>-->
            <el-cascader v-model="addressForm.address1"
                         :options="cityData"
                         :props="{ expandTrigger: 'hover' }"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAddressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--查看物流进度对话框-->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="50%">
        <!--时间线-->
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(progress, index) in progressInfo"
            :key="index"
            :timestamp="progress.time">
            {{progress.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
</template>

<script>
// 导入省市区/县数据
import cityData from './citydata'

export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [], // 订单列表
      editAddressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('/orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleCurrentChange (currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getOrderList()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 修改地址对话框
    showEditAddressDialog () {
      this.editAddressDialogVisible = true
    },
    // 监听修改地址对话框关闭，重置表单
    editAddressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressDialog () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
