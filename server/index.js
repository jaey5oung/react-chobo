const express = require("express") //익스프레스 모듈을 갖고온다 (require:요구하다)
const app = express() //새로운 함수를 만들어 새로운 익스프레스 앱을 만든다
const port = 4000 //포트는 아무렇게 해도 상관없다 4000포트를 백서버로 둔다
const bodyParser = require("body-parser")
const { Test } = require("./models/Test") //유저 모델에있는 정보를 가져오는것
const { DashBoard } = require("./models/DashBoardDB")
const config = require("./config/key") //config에서 몽고키값을 가져온다
const mongoose = require("mongoose")
const { json } = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err))

//--------------------------------------------------------------------------------------------------------

// @회원가입

app.post("/api/test", (req, res) => {
  const test = new Test(req.body)

  test.save((err, ojy) => {
    if (err) return res.status(400).json({ success: false, err })

    return res.status(200).json({ success: true, ojy })
  })
})

//--------------------------------------------------------------------------------------------------------

// @로그인

app.post("/api/testlogin", (req, res) => {
  Test.find({ id: req.body.id, password: req.body.password }, (err, user) => {
    if (!user) {
      return res.json({
        success: false,
        message: "등록된 아이디가 없습니다",
      })
    } else {
      return res.json({
        success: true,
        message: " 로그인 성공 ",
      })
    }
  })
})

//--------------------------------------------------------------------------------------------------------

// @상품등록

app.post("/api/dashboard", (req, res) => {
  const dashboard = new DashBoard(req.body)

  dashboard.save((err, ojy) => {
    if (err) return res.status(400).json({ success: false, err })

    return res.status(200).json({ success: true, ojy })
  })
})

//--------------------------------------------------------------------------------------------------------

// @상품내역

app.post("/api/goodshistory", (req, res) => {
  DashBoard.find({}, (err, ojy) => {
    if (err) {
      return res.status(400).json({ success: false, err })
    } else {
      return res.status(200).json({ success: true, ojy })
    }
  })
})

//--------------------------------------------------------------------------------------------------------

// @상품삭제

app.post("/api/delete", (req, res) => {
  DashBoard.deleteOne({ _id: req.body._id }, (err, ojy) => {
    if (err) {
      return res.status(400).json({ success: false, err })
    } else {
      return res.status(200).json({ success: true, ojy })
    }
  })
})

//중복된 앤드포인트는 실행을 못한다
//--------------------------------------------------------------------------------------------------------

// @전체삭제

app.post("/api/alldelete", (req, res) => {
  DashBoard.remove({}, (err) => {
    if (err) {
      return res.status(400).json({ success: false, err })
    } else {
      return res.status(200).json({ success: true })
    }
  })
})

//--------------------------------------------------------------------------------------------------------

// @업데이트

app.post("/api/update", (req, res) => {
  DashBoard.findOne({ _id: req.body._id }, (err, ojy) => {
    if (err) {
      return res.status(400).json({ success: false, err })
    } else {
      return res.status(200).json({ success: true, ojy })
    }
  })
})

//--------------------------------------------------------------------------------------------------------

// @상품수정완료업데이트

app.post("/api/goodsupdate", (req, res) => {
  DashBoard.findOneAndUpdate(
    { _id: req.body._id }, //내가보낸 id값을 찾아들어간다
    {
      $set: {
        //id값을풀고 밑에것들을 업어친다 업뎃한다
        goods: req.body.goods,
        price: req.body.price,
        explan: req.body.explan,
      },
    },
    { new: true } //위에 업데이트된것들을 확정지어서 바꿔준다
  ).exec((err, doc) => {
    //exec 쿼리실행 위에것들을 바꾸고난후
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true, doc })
  })
})

//--------------------------------------------------------------------------------------------------------

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}!`)) //이후 포트4000으로 이앱을 실행시킨다 이 앱이 4000포트에 리슨을하면 이 콘솔이 프린트가 된다
