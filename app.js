/*
* @Author: lenovo
* @Date:   2018-05-06 17:03:48
* @Last Modified by:   lenovo
* @Last Modified time: 2018-05-06 19:56:09
*/

var express=require("express")
var app=express()

var http=require("http").Server(app)
var io=require("socket.io")(http)

var session=require("express-session")

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.set("view engine","ejs")

app.use(express.static("./public"))

var alluser=[]

app.get("/",function(req,res,next){
	res.render("index")
})

app.get("/check",function(req,res,next){
	var yonghuming=req.query.yonghuming
	if(!yonghuming){
		res.send("你的名字呢")
		return;
	}
	if(alluser.indexOf(yonghuming)!=-1){
		res.send("用户名有了,改一下吧")
		return;
	}
	alluser.push(yonghuming)
	req.session.yonghuming=yonghuming;
	res.redirect("/chat")
})

app.get("/chat",function(req,res,next){
	if(!req.session.yonghuming){
		res.redirect("/")
		return;
	}
	res.render("chat",{
		"yonghuming":req.session.yonghuming
	})
})

io.on("connection",function(socket){
  socket.on("liaotian",function(msg){
  	io.emit("liaotian",msg)
  })
})

http.listen(3000)