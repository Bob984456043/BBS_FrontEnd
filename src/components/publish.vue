<template>
    <div id="background">
        <div class="wrapper">
            <div class="submit-info">
                <input class="input-title" v-model="title" type="text" placeholder="请输入你的文章标题&在右侧选择文章类别...">
                <select class="input-select" v-model="category" placeholder="333">
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="Java">Java</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="C">C</option>
                    <option value="C++">C++</option>
                </select>
            </div>
            <mavon-editor v-model="content" :subfield="true"/>
            <input class="input-button" @click="submit" type="button" value="提交">
        </div>
    </div>
</template>

<script>
    import config from "../assets/config"

    export default {
        name: "publish",
        data(){
            return{
                title: '',
                category: '',
                content: '',
            }
        },
        methods:{
            submit() {
                var d = new Date()
                var post_time = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()
                var user_id = JSON.parse(localStorage.getItem('userdata')).id
                var data={
                    title:this.title,
                    category:this.category,
                    content:this.content,
                    post_time:post_time,
                    user_id:user_id,
                }
                this.$axios.post(config.ajaxUrl+'blog/article/detail', data,{
                    headers:{
                        Authorization:'Token '+JSON.parse(localStorage.getItem('userdata')).token
                    }
                })
                    .then((res) => {
                        alert('发布成功！')
                    }).catch((err) => {
                    console.log(err)
                })
                this.title= ''
                this.category= ''
                this.content= ''
                this.$router.push('/')
            },
        },

        // props
    }
</script>

<style scoped lang="scss">
    #background{
        background: #E9ECEF;
    }
    .input-button{
        margin-top:15px;
        margin-left:1008px ;
        background: white;
        box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
        color: #767676;
        font-size: 25px;
        border-radius: 5px;
        border: 1px solid #E5E5E5;
        height: 48px;
        width: 130px;
    }
    .input-select{
        padding: 5px;
        width: 145px;
        display: inline;
        box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
        height: 80px;
        font-family: Arial;

    }
    .input-title{
        padding-left: 5px;
        font-size: 27px;
        width: 980px;
        height: 48px;
        border: 1px solid #E5E5E5;
        border-radius: 5px;
        box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    }
    .wrapper{
        padding: 20px;
        width: 79%;
        margin: 0 auto;
        .markdown-body{
            z-index: 15;
            height: 600px;
        }


    }
</style>
