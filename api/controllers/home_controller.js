module.exports.home = function(req,res){

    console.log('home')

    return res.render('home',{
        title:"Home"
    })
 
 }