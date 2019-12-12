<template>
    <div class="background">
        <div class="wrapper">
            <div class="upper">
                <h1>{{title}}</h1>
                <span class="category">{{category}}</span>
                <div>发布于：{{post_time}}</div>
                <div>浏览量：{{views}}</div>
                <div> 作者：{{user_id}}</div>
            </div>
            <mavon-editor
                    class="md"
                    :value="content"
                    :subfield="false"
                    :defaultOpen="'preview'"
                    :toolbarsFlag="false"
                    :editable="false"
                    :scrollStyle="true"
                    :ishljs="true"
            />
            <div class="lower">
                <h2>评论区</h2>
                <h2 class="post"><a @click="postComment" href="javascript:void(0);">发表评论</a></h2>
                <div v-for="item in commentlist" class="comment-list">
                    <span><a href="javascript:void(0)">{{item.username}}</a></span>
                    <div class="right">
                        <span>{{item.post_time}}</span>
                        <span>❤{{item.stars}}</span>
                    </div>
                    <div class="content">{{item.content}}</div>
                </div>
            </div>
        </div>
        <div id="comment-area" class="comment-area">
            <textarea v-model="postCommentContent" placeholder="请输入你的评论..." rows="10" cols="30"></textarea>
            <input type="button" @click="doPostComment" value="提交评论">
            <input type="button" @click="closeCommentBox" value="关闭">
        </div>
    </div>
</template>

<script>
    import config from "../assets/config"
    export default {
        name: "articleview",
        data(){
            return{
                title:'',
                category:'',
                post_time:'',
                views:'',
                user_id:'',
                content:'',
                commentlist:[],
                postCommentContent:''
            }
        },
        methods:{
            //获取文章详细内容
            getContent(){
                this.$axios.get(config.ajaxUrl+'blog/article/detail'+'?id='+this.$route.params.id)
                .then((res) => {
                    console.log(typeof res)
                    const data = res.data
                    this.title = data.title
                    this.category = data.category
                    this.post_time = data.post_time
                    this.views = data.views
                    this.content = data.content
                    this.user_id = data.user_id
                }).catch((error) => {
                    console.log(error);
                })
            },
            //获取评论列表
            getComments(){
                this.$axios.get(config.ajaxUrl+'blog/comments'+'?article_id='+this.$route.params.id)
                    .then((res) => {
                        const list = res.data.list
                        list.map((item)=>this.commentlist.push(item))
                    }).catch((error) => {
                    console.log(error);
                })
            },
            //评论按钮
            postComment(){
                document.getElementById('comment-area').style.display = 'block'
            },
            //发布评论
            doPostComment(){
                var d = new Date()
                var post_time = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()
                this.$axios.post(config.ajaxUrl+'blog/comment/detail',{
                    content:this.postCommentContent,
                    post_time:post_time,
                    article_id:this.$route.params.id,
                    user_id:JSON.parse(localStorage.getItem('userdata')).id,
                    username:JSON.parse(localStorage.getItem('userdata')).username,
                }, {
                    headers:{Authorization:'Token '+JSON.parse(localStorage.getItem('userdata')).token}
                }).then((res) => {
                    alert("提交成功")
                    this.closeCommentBox()
                    }).catch((error) => {
                    console.log(error);
                })
                this.$router.go(0)
            },
            //关闭评论发布视图
            closeCommentBox(){
                document.getElementById('comment-area').style.display = 'none'
                this.postCommentContent=''
            }

        },
        created() {
            this.getContent()
            this.getComments()
        }

    }
</script>
<style lang="scss" scoped>
    .background{
        padding: 15px;
        width: 100%;
        background: #E9ECEF;
        h1{
            margin: 0;
            display: inline;
        }
    }

    .wrapper{
        width: 930px;
        margin: 0 auto;
    }

    .upper{
        background: #FBFBFB;
        padding: 20px;
        box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
        margin-bottom: 15px;
        .category{
            background: rgba(0,150,94,.2);
            color: #03975E;
            display: inline-block;
            font-size: .875rem;
            padding: 4px;
            height: 1.5rem;
            line-height: 1.5rem;
            border-radius: .1875rem;
            margin: .25rem !important;
            font-family: Arial;
            font-size: 20px;
        }
    }

    .lower{
        position: relative;
        border-radius: 20px;
        background: #FBFBFB;
        padding: 20px;
        box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
        margin-bottom: 15px;
        margin-top: 20px;
        .content{
            margin: 10px;
            padding: 5px;

        }
        .right{
            float: right;
            color: #97b2b2;
            span{
                margin-left: 10px;
            }
        }

        .comment-list{
            border-bottom: #e1e1e1 5px solid;
            margin-bottom:10px ;
            padding: 5px;
            a{
                text-decoration: none;
                color: rgba(127, 178, 85, 0.75);
                font-family: Arial;
                font-size: 17px;
            }
        }
        .post {
            position: absolute;
            right: 20px;
            top: 21px;
            a{
                text-decoration: none;
                color: #000;
            }
        }
    }
    .comment-area{
        display: none;
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 99999999;
    }

</style>
