<template>
<div class="article-list">
  <div class="list-content">
    <ul class="category">
      <li><a href="javascript:void(0)" @click="getList('','')">全部</a></li>
      <li><a href="javascript:void(0)" @click="getFileList('','')">文件资源</a></li>
      <li v-for="item in category"><a href="javascript:void(0)" @click="getList(item.text)">{{item.text}}</a></li>
      <li v-if="userID"><a href="javascript:void(0)" @click="getMine(userID)">我的</a></li>
    </ul>
    <div class="loading" v-if="isloading">
      <img src="http://www.sucaijishi.com/uploadfile/2015/0210/20150210104952191.gif" alt="正在载入中">
    </div>
    <div class="animated fadeInUp list-wrap">
      <div class="list " v-for="item in list">
        <span v-if="!isReadingFile" class="count">{{item.views}}/{{item.comments}}</span>
        <span v-if="isReadingFile" class="count">{{item.downloads}}</span>
        <span class="title_wrapper">
          <span class="category-icon">{{item.category}}</span>
          <router-link class="title" v-if="!isReadingFile" :to="{ name:'article', params: {id: item.id} }">{{item.title}}</router-link>
          <a class="title" v-if="isReadingFile" :href="'http://139.199.58.80/filesys/file/detail?id=' + item.id">{{item.filename}}</a>
          <a v-if="isReadingFile" class="download-btn" :href="'http://139.199.58.80/filesys/file/detail?id=' + item.id">下载</a>
          <a class="delete" v-if="isReadingMine" href="javascript:void(0);" @click="doDelete(item.id)">删除</a>
        </span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import config from "../assets/config"

export default {
  name: "articlelist",
  data() {
    return {
      isReadingFile: true,
      isReadingMine: false,
      active: '全部',
      userID: '',
      category: [{
        text: 'Java'
      }, {
        text: 'Javascript'
      }, {
        text: 'Go'
      }, {
        text: 'Python'
      }, {
        text: 'C++'
      }, {
        text: 'C+'
      }],
      list: [],
      isloading: true,
    }
  },
  methods: {
    getMine(id) {
      this.isloading = true
      this.$axios.get(config.ajaxUrl + 'blog/articles', {
          params: {
            user_id: id
          }
        })
        .then((response) => {
          this.list = []
          this.isloading = false
          const data = response.data
          // 填充帖子列表
          data.list.map((item) => this.list.push(item));
          this.isloading = false
        }).catch((error) => {
          console.log(error)
        })
      this.isReadingMine = true;
    },
    getList(category, id) {
      this.isReadingMine = false;
      this.isReadingFile = false;
      this.isloading = true;
      if (category)
        var params = {
          category: category
        };
      else if (id)
        var params = {
          user_id: id
        };
      else var params = {};
      this.$axios.get(config.ajaxUrl + 'blog/articles', {
          params: params
        })
        .then((response) => {
          this.list = []
          this.isloading = false
          const data = response.data
          // 填充帖子列表
          data.list.map((item) => this.list.push(item));
          this.isloading = false
        }).catch((error) => {
          console.log(error)
        })
    },
    getFileList() {
      this.isloading = true;
      this.$axios.get(config.ajaxUrl + 'filesys/files')
        .then((response) => {
          this.list = []
          this.isloading = false
          const data = response.data
          // 填充帖子列表
          data.list.map((item) => this.list.push(item));
          this.isloading = false
          this.isReadingFile = true
        }).catch((error) => {
          console.log(error)
        })
    },
    doDelete(id) {
      const token = JSON.parse(localStorage.getItem('userdata')).token;
      this.$axios.delete(config.ajaxUrl + 'blog/article/detail', {
        headers: {
          Authorization: 'Token ' + token,
        },
        params: {
          id: id
        },
      }).then((response) => {
        alert("删除成功");
        this.$router.push({
          path: "/",
          query: {
            t: Date.now(),
          },
        });
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  created() {
    this.getList();
    const getUser = JSON.parse(localStorage.getItem('userdata'));
    if (getUser) {
      this.userID = getUser.id
    }
  },
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50px;
  left: 50%;
}

.article-list {
  position: relative;
  width: 100%;
  height: 790px;
  background: #E9ECEF;
  padding: 10px;
  padding-top: 5px;

  .list-content {
    position: relative;
    width: 960px;
    margin: 0 auto;
  }
}

.category {
  background: -webkit-linear-gradient(to right, #67B26F, #4ca2cd);
  background: linear-gradient(to right, #67B26F, #4ca2cd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: absolute;
  left: 65px;
  width: 850px;
}

.category li {
  list-style: none;
  display: inline;
  margin-left: 30px;

  a {
    text-decoration: none;
    font-family: 微软雅黑;
    font-size: 20px;
  }
}

.list-wrap {
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  background: white;
  position: absolute;
  top: 50px;
  font-family: "Big Caslon";
  font-size: 20px;

  .list {

    border-bottom: 1px solid lightgray;
    white-space: nowrap;
    width: 960px;
    height: 30px;
    padding: 8px;
    padding-bottom: 10px;
  }

  a {
    text-decoration: none;
  }
}

.count {
  padding-right: 10px;
}

.category-icon {
  font-weight: bolder;
  background: #ffffff;
  color: #529db2;
  padding: 5px;
  font-size: 16px;
  position: absolute;
  left: 60px;
  border-style: solid;
  border-width: 1px;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  border-color: #67B26F;

}

.title_wrapper {
  .title {
    width: 850px;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    left: 133px;
    color: black;
  }

  .download-btn {
    position: absolute;
    left: 910px;
    width: 34px;
    border-radius: 10px;
    border: 1px dimgray solid;
    background: #e1e1e1;
    color: #8e8e8e;
    font-size: 16px;
    font-family: "微软雅黑";
    padding: 5px;
    padding-bottom: 2px;
  }
}

.delete {
  position: absolute;
  left: 910px;
  width: 34px;
  border-radius: 10px;
  border: 1px dimgray solid;
  background: #e1e1e1;
  color: #8e8e8e;
  font-size: 16px;
  font-family: "微软雅黑";
  padding: 5px;
  padding-bottom: 2px;
}
</style>
