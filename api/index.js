const express = require("express")
const app = express()
const router = express.Router();

const cors = require('cors')
const cookieParser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts');

const authRoutes = require("./routes/auth.js")
const homeRoutes = require('./routes/home.js')
//var bodyParser = require('body-parser')

app.use(express.urlencoded())

//app.use(bodyParser);
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', '../client/views');

app.use(express.static('../client/assets'));





app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials",true)
    next()
})

app.use(express.json())
app.use(cors(
    {
        origin:"http://localhost:4000",
    }
))
app.use(cookieParser())


//router.get('/api', homeController);
app.use("/api",homeRoutes)
app.use("/api/auth",authRoutes)

app.listen(8700,()=>{
    console.log("API Working!")
});