const router = require("express").Router();
const controller = require("./controller");

router.get("/",(req,res)=>{
    res.render('index',{title:'Hey',message:'Hello world!'});
})
router.get("/cnn",controller.mainView);
module.exports = router;