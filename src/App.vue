<template>
  <div id="app">
       <router-view></router-view>
  </div>
</template>

<style>
.el-card{
  min-height: 75vh;
}
el-select-dropdown__item selected{
  color: #000000;
  font-weight: 400;
}
/* .el-table{*/
/*  font-size: 12px !important;*/
/*}*/
 .el-table td {
     padding: 8px 0 !important;
     min-width: 0;
     box-sizing: border-box;
     text-overflow: ellipsis;
     vertical-align: middle;
     position: relative;
     text-align: left;
   }
.el-table th {
  padding: 8px 0 !important;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.el-pagination {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
}
</style>
