const express = require("express")

const login = require('../controllers/auth.js').login
//const register = require('../controllers/auth.js').register
const logout = require('../controllers/auth.js').logout

const sign_in = require('../controllers/auth.js').sign_in

const check_user = require('../controllers/auth.js').check_user

const db = require('../connect.js').db;




const router = express.Router()

router.get('/profile/:id',check_user,(req,res)=>{

    //console.log(req.body)

    usern = req.username.username
   
    
    const sql1 = `SELECT * FROM tasks WHERE status = "ongoing" AND assigned_to = "${usern}"`;
    const sql2 = `SELECT * FROM tasks WHERE status = "assigned" AND assigned_to = "${usern}"`;
    const sql3 = `SELECT first_name,last_name FROM employee`;
  
    db.query(sql1, (error1, results1, fields1) => {
        console.log(results1) 
      if (error1) throw error1;
  
      db.query(sql2, (error2, results2, fields2) => {
        console.log(results2)
        if (error2) throw error2;

        db.query(sql3,(error3,results3,fields3)=>{

            if (error3) throw error3;

            if(req.username.profile==="employee")
            {
                res.render('user_profile', { title:req.username, ongoingTasks: results1, assignedTasks : results2 ,employees: results3});
            }

            else if(req.username.profile==="manager")
            {

                sql6 = 'SELECT * FROM employee WHERE kpi>9'
                db.query(sql6,(error6,results6,fields6)=>{

                    res.render('manager_profile',{title:req.username,topPerformers:results6});

                })
               
            }
            

        })
  
       
      });
    });
});



router.get('/profile/:id/employees',(req,res)=>{
    const sql = 'SELECT * FROM employee'

    db.query(sql,(error,results,fields)=>{
        if(error)  throw error;

        console.log(results)

        res.render('employees',{employees:results})

    })

})

router.get('/profile/:id/man_tasks',(req,res)=>{
    m_name = req.params.id
    const sql = `SELECT * FROM tasks WHERE assigned_by = "${m_name}"`

    db.query(sql,(error,results,fields)=>{
        if(error)  throw error;

        console.log(results)

        res.render('manager_tasks',{tasks:results,man_name:req.params.id })

    })

})

router.post('/profile/:id/man_tasks/add-task',(req,res)=>{

    const sql7 = 'INSERT INTO tasks(task_id,task_name,task_desc,deadline,priority,access,status,assigned_to,assigned_by) values (?,?,?,?,?,?,?,?,?)'

    db.query(sql7,[parseInt(req.body.task_id),req.body.task_name,req.body.task_desc,req.body.deadline,4,"Yes","assigned",req.body.task_ass,req.params.id],(error,results,fields)=>{
        if(error) throw error;

        res.redirect(`/api/auth/profile/${req.params.id}/man_tasks/`)


    })


})


router.get('/profile/:id/tasks/:task_id',(req,res)=>{

    const sql = 'SELECT * from tasks where task_id = ?';
    db.query(sql, [req.params.task_id], (error, results, fields) => {
        if (error) throw error;

        const sql2 = 'SELECT * FROM subtask where task_id = ? AND status_compl = "incomplete"'
        db.query(sql2,[req.params.task_id],(error,results1,fields)=>{
            if(error) throw error;

            res.render('task',{task:results[0],subtasks:results1,user:req.params.id})

        })

       // res.redirect('/api/auth/profile/:id')
       
      });
})


router.post('/profile/:id/tasks/:task_id/add_sub',(req,res)=>{

    const sql1 = 'SELECT COUNT(*) FROM subtask'
    
    

    db.query(sql1,(error, results4,fields4)=>{

        var count = results4[0]['COUNT(*)']+1
         console.log(count)
         
         val = parseInt(req.params.task_id)

         const subtask = req.body.subtask

         const sql2 = `INSERT into subtask(id,subtask_desc,task_id) values (${count},"${subtask}",?)`;

        db.query(sql2,[val],(error, results5, fields5) => {
            if (error) throw error;

            console.log(req.params.id)
            res.redirect(`/api/auth/profile/${req.params.id}/tasks/${val}`);
          });


    })

   
})

router.post('/profile/:id/tasks/:task_id/:subtask_id/check',(req,res)=>{

    const sql5 = 'UPDATE subtask SET status_compl= "complete" where status_compl="incomplete" and id = ?;'

    db.query(sql5,[req.params.subtask_id],(error,results,fields)=>{
        if (error) throw error;

        res.redirect(`/api/auth/profile/${req.params.id}/tasks/${req.params.task_id}`)

    })

})




router.post('/profile/:id/tasks/:task_id/add',(req,res)=>{
   
    const sql4 = 'UPDATE tasks SET status = "ongoing" WHERE task_id = ? AND status = "assigned";'
    db.query(sql4, [req.params.task_id], (error, results, fields) => {
      
        if (error) throw error;
        res.redirect(`/api/auth/profile/${req.params.id}`);
      });
})

router.post('/profile/:id/tasks/:task_id/delete',(req,res)=>{
   
    const sql4 = 'DELETE from tasks WHERE task_id = ? AND status = "assigned";'
    db.query(sql4, [req.params.task_id], (error, results, fields) => {
      
        if (error) throw error;
        res.redirect(`/api/auth/profile/${req.params.id}`);
      });
})


router.post('/login',login,(req,res)=>{
    if(res.statusCode === 200)
    {
        const id = req.body.username

      
        
        return res.redirect(`/api/auth/profile/${id}`)
    }

    else {
        return res.redirect('/api/auth/sign_in')
    }
})
router.get('/sign_in',sign_in)
//router.post('/register',register)
router.get('/logout',logout)



module.exports = router
