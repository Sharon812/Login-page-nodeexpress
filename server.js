const express = require('express');
const app = express();
const hbs = require('hbs')
const nocache = require('nocache')
const session = require('express-session')
app.use(express.static('public'));
app.set('view engine','hbs');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const username = "admin";
const password = "admin123";

app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized: true,
}))

app.use(nocache())

app.get('/', (req,res) => {
    if(req.session.user){
        res.render('home')
    }else{
        if(req.session.passwordwrong){
            res.render('login',{msg:"Invalid credentials"});
            req.session.passwordwrong = false;
        }else{
            res.render('login');
        }
    }
});

app.post('/verify' ,(req,res) => {
    console.log(req.body)

    if(req.body.username === username && req.body.password === password){
        req.session.user = req.body.username;
        res.redirect('/home');
    }else{
       req.session.passwordwrong = true;
       res.redirect('/')
    }
})

app.get('/home',(req,res) => {
    if(req.session.user){
        res.render('home');
    }else{
        if(req.session.passwordwrong){
            res.session.passwordwrong = false;
            res.render('login',{msg:"Invalid credentials"});
        }else{
            res.redirect('/login');
        }
        
    }
})


app.get('/logout',(req,res)=>{
    req.session.destroy(function(error){
        if(error){
            console.log(error);
            res.render('login',{msg: "Logged Out"})
            
        }else{
            res.redirect('/');
        }
    })
})
app.listen(3000, () => console.log('server running or port 3000'));
