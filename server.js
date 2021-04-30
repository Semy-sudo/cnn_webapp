var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const express = require('express'),
    app = express();
    http = require('http').createServer(app),
    port = 8000;

// app.use('/',indexRouter);
// app.use('/users',usersRouter);

// app.set('view engine','jade');
// app.set('views','./views');
// app.use(express.static(__dirname+"/css"));
// app.use(express.static(__dirname+"/js"));

// const routes = require("./routes/routers");
// app.use(routes);




http.listen(port,function(){
    console.log(`http://localhost:${port}`);
})