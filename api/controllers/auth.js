
const db = require('../connect.js').db;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

const secretKey = "secretkey"

module.exports.login = (req,res,next)=>{

     //console.log(req)
    const q = "SELECT * FROM auth where username = ?"

    console.log(req)
    db.query(q,[req.body.username],(err,data)=>{

        if(err) return res.status(500).json(err)

        console.log(data)

        if(!data.length) return res.status(404).json("User not found")

        const user = data[0]

        //CHECK PASSWORD

       // const isValid = bcrypt.compareSync(req.body.password,user.password)

       const isValid = req.body.password === user.password
    

        if(!isValid) return res.redirect('/api/auth/sign_in')

        //CREATE TOKEN

        const token = jwt.sign({username:user.username,profile:user.profile},secretKey)

       
        const {password, ...others} = data[0]

        localStorage.setItem('token', token);

       

        /*res.cookie("accessToken",token,{
            httpOnly:true,

        }).status(200).json(others) */

        next();

    })

}

/*module.exports.register = (req,res)=>{
    
//CHECK USER IF EXISTS

const q = "SELECT * FROM auth where username = ?"

db.query(q,[req.body.username],(err,data)=>{

    if(err) return res.status(500).json(err)

    if(data.length) return res.status(409).json("Username already exists")

    //CREATE A NEW USER 

    // HASH THE PASSWORD


   // const salt = bcrypt.genSaltSync(10);

    //const hashedPassword = bcrypt.hashSync(req.body.password,salt)

    
    if(req.body.profile === "Manager")
    {

        q = "INSERT INTO manager ('first_name','last_name','email','phone','address') VALUE (?)"

    }

    else {
         q = "INSERT INTO employee ('first_name','last_name','email','phone','address') VALUE (?)"

    }

    


    const values = [req.body.first_name,req.body.last_name,req.body.email,req.body.phone,req.body.address]

    db.query(q,[values],(err,data)=>{

        if(err) return res.status(500).json(err)

        return res.status(200).json("User has been created")

    })

})





}*/

module.exports.sign_in = (req,res)=>{
   /* if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }*/

    return res.render('user_sign_in',{
        title: "Sign In"
    })
}

module.exports.check_user = (req,res,next)=>{

    const token = localStorage.getItem('token');

    console.log(token)

  // check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. No token provided.' });
  }

  // verify the token with the secret key
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }


    // set the decoded user information to the request object
    req.username = decoded;

    // call the next middleware
    next();
  });


} 

module.exports.logout = (req,res)=>{

    //clear cookie and redirect to login page

    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).redirect('/api/auth/sign_in')
    
}