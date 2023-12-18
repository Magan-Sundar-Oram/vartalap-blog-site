const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');


var title = ['Bhubuneswar is a beautiful city said by Aman sir..',
    'Most Telented Full Stack MERN technology experts Mr.Aman Rajak spotted in bhubaneswar',
    'NM engineering Student Tanisha Jena got Highest CTC in the world', 'Great Mahesh Sir...'

]
var description = ['Bhubaneswar is one of the famed cities of Odisha; it is the capital of the state. The city is among one of the oldest cities of India, finding its origin around the 2nd century B.C during the Chedi dynasty.  Bhubaneswar got its name from Tribhubaneswar meaning Lord Shiva. Since the establishment of the city, Bhubaneswar has been known by different names; Toshali, Nagar Kalinga, Kalinga Nagar, Ekamra Kanan, Mandira Malini Nagar are a few. The City of Temples is the largest city in Odisha, serving to be one of the centres of religious and economic importance in Eastern India.',
    'Theres a really talented expert named Mr. Aman Rajak who is known for his skills in Full Stack MERN technology. Currently, he has been spotted in Bhubaneswar. He is highly proficient in all aspects of the MERN stack, which includes MongoDB, Express.js, React.js, and Node.js. His expertise allows him to handle both the front-end and back-end development of web applications using these technologies. If youre in Bhubaneswar and in need of a skilled Full Stack MERN developer, Mr. Aman Rajak would be a great choice to consider!', 'Aman...dsyb ciyebkciwuqbc iaukc akshbiue',
    'Mahesh Sir, an enigmatic figure in the world of technology, has emerged as a visionary leader with a penchant for innovation. With his unrivaled expertise in artificial intelligence and machine learning, he has spearheaded groundbreaking projects that have revolutionized various industries. Known for his exceptional problem-solving skills, Mahesh Sir has a knack for unraveling complex puzzles and finding ingenious solutions. His colleagues and peers often marvel at his ability to think outside the box, consistently pushing the boundaries of what is considered possible.']




var author = ['Aman', 'Rebel', 'Magan', 'Tanisha']
var users = ['Aman', 'Rebel', 'Magan', 'Tanisha']
var passwords = ['11', '12', '13', '14'];
var usertyp = [0, 1, 1, 1];

var userstatus = [1, 1, 1, 1];  //for active and inactive

app.set('view engine', 'ejs');
app.use(session({
    secret: 'MaganSundar',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    var loginstatus = req.session.isLogin;
    res.render('homePage', { title: title, auth: author, loginstatus: loginstatus, userstatus: userstatus });
});

app.get('/singlePost/:id', function (req, res) {
    res.render('singlePost', { title: title[req.params.id], description: description[req.params.id] })
});


app.get('/LoginPage', function (req, res) {
    res.render('LoginPage')
});

app.post("/auth", function (req, res) {

    var user = req.body.uname;
    var pswd = req.body.upass;
    for (var i = 0; i < users.length; i++) {
        if (users[i] == user && passwords[i] == pswd) {
            // res.send('Logged in')
            req.session.usertyp = usertyp[i];
            req.session.isLogin = true;
            req.session.loginuser = user;
            req.session.status = userstatus[i];
            // console.log(req.session.loginuser)
            //res.redirect('/dashborad')
            break;
        }
        else {
            //res.send('BHakk bsdk')
            //res.redirect('/LoginPage')
            req.session.isLogin = false;
        }
    }
    if (req.session.isLogin == true) {
        res.redirect('/dashboard')
    }
    else {
        res.redirect('/LoginPage')
    }
    //console.log(user + pswd);
});


app.get('/dashboard', function (req, res) {
    //var uadmin=req.session.usertyp;
    if (req.session.isLogin == true && req.session.usertyp == 1 && req.session.status == 1) {
        var luser = req.session.loginuser;
        res.render('dashboard', { loginuser: luser });
        // console.log(luser);
    }
    else if (req.session.isLogin == true && req.session.usertyp == 0 && req.session.status == 1) {
        res.redirect('/adminDash')
    }
    else {
        res.redirect('/LoginPage')
    }
});

app.get('/adminDash', function (req, res) {
    if (req.session.isLogin == true && req.session.usertyp == 0) {
        res.render('adminDash');
    }

});


app.get('/RegisterPage', function (req, res) {
    res.render('RegisterPage');
});

app.post('/reg', function (req, res) {
    var regname = req.body.rname;
    // var regmail=req.body.rmail;
    var regpass = req.body.rpass;
    var regcpass = req.body.rcpass;
    //  var acc=req.body.racc;

    if (regpass == regcpass) {
        users.push(regname);
        passwords.push(regpass);
        usertyp.push(1);
        userstatus.push(1);
        res.redirect('/LoginPage')
    }
    else {
        res.redirect('/RegisterPage');
    }

});

app.get('/regAdmin', function (req, res) {
    res.render('adminRegister');
});

app.post('/adminreg', function (req, res) {
    var regname = req.body.rname;
    // var regmail=req.body.rmail;
    var regpass = req.body.rpass;
    var regcpass = req.body.rcpass;
    //  var acc=req.body.racc;

    if (regpass == regcpass) {
        users.push(regname);
        passwords.push(regpass);
        usertyp.push(0);
        userstatus.push(1);
        res.redirect('/LoginPage')
    }
    else {
        res.redirect('/RegisterPage');
    }

});



app.get('/adminEdit', function (req, res) {
    // var uadmin=req.session.usertyp;
    if (req.session.isLogin == true && req.session.usertyp == 0) {
        res.render('adminEdit', { title: title, description: description });
    }
});


app.get('/createpost', function (req, res) {
    if (req.session.isLogin == true) {
        res.render('createPost');
    }
    else {
        res.redirect('/LoginPage')
    }
});

app.post('/ppost', function (req, res) {
    var tp = req.body.ptitle;
    var td = req.body.pdescription;
    var ca = req.session.loginuser;
  
    title.push(tp);
    description.push(td);
    author.push(ca);
    res.redirect('/');
});


app.get('/editDelete', function (req, res) {
    if (req.session.isLogin == true) {
        var searchElement = req.session.loginuser;
        var indices = [];

        for (let i = 0; i < author.length; i++) {
            if (author[i] === searchElement) {
                indices.push(i);
            }
        }
        //console.log(indices);
        res.render('editdeletePost', { title: title, description: description, indices: indices });
    }
});

app.get('/del/:id', function (req, res) {
    if (req.session.isLogin == true) {
        var index = req.params.id;
        title.splice(index, 1);
        description.splice(index, 1);
        author.splice(index, 1);
        res.redirect("/")
    }
});

app.get("/activate/:id", function (req, res) {
    var id = req.params.id;
    userstatus[id] = 1;
    res.redirect("/manage");
});

app.get("/deactivate/:id", function (req, res) {
    var id = req.params.id;
    userstatus[id] = 0;
    res.redirect("/manage");
});



app.get('/manage', function (req, res) {
    res.render('manage', { users: users, userstatus: userstatus, usertyp: usertyp });
});

/*
app.get('/delUser/:id', function (req, res){
    if(req.session.isLogin==true && req.session.usertyp==0){
    var index = req.params.id;
    title.splice(index, 1);
    description.splice(index, 1);
    author.splice(index, 1);
    users.splice(index,1);
    passwords.splice(index,1);
    usertyp.splice(index,1);
    res.redirect("/")

    }
});
*/

app.post("/epost", function (req, res) {
    var index = req.body.index;
    title[index] = req.body.etitle;
    description[index] = req.body.edescription;
    console.log(index);
    res.redirect('/');
});

app.get('/editPost/:id', function (req, res) {
    if (req.session.isLogin == true) {
        var index = req.params.id;
        res.render('editPost', { index: index, title: title[index], description: description[index] })
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/dashboard')
});

app.listen(3000, function (req, res) {
    console.log("Server Started...")
});
