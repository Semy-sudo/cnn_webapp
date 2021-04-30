var fs = require('fs')
//var Calculate = require('../models/calc');

exports.mainView = function (req, res) {

    //var calc = new Calculate(5,10);
    //var sub = calc.sum();
    //console.log(sub)

    fs.readFile("./views/cnn.html","utf-8",function(err,buf){
        res.end(buf);
    })
}
