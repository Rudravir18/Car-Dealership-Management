const mongoose = require('mongoose');
const express = require('express');
const ejs =require('ejs');
const bodyParser = require('body-parser')
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const PORT_NUMBER = require('./modules/port');
const data = require('./modules/data_module');
const profile = require('./modules/profile_module');
const rental = require('./modules/rental_module');
const appointment = require('./modules/appointment_module');
const accessdenied = require('./modules/accessdenied_module');
const bookcar = require('./modules/bookcar_module');
const app = express();


app.set('view engine', 'ejs');
app.use(helmet());
app.use(express.static('images'));
app.use('/images', express.static('images'));
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'not_harsh',
    resave: false, 
    saveUninitialized: false,
    cookie: {
        secure: false, 
        maxAge: 3600000,
        httpOnly: true
    }
}));
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now

mongoose.connect('mongodb://localhost:27017/project')
.then (() => console.log(' Mongoose Database is connected '))
.catch(err => console.log(err));

// storage for image  https://www.freecodecamp.org/news/simplify-your-file-upload-process-in-express-js/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'images' );
        },

    filename:(req, file,cb)=> {
        cb(null, Date.now() + '-' + file.originalname);
    
}});
const add = multer({ storage: storage });
// Home page
app.get('/', async (req, res) => {
    try {
        if(req.session.username){
            const use_profile = await profile.findOne({ username: req.session.username });
            const use_data = await data.find({}).limit(3);
            res.render('home', { use_profile: use_profile, use_data: use_data , logged_in: req.session.username,role : req.session.role });
        } else {
            const use_data = await data.find({}).limit(3);
            // console.log(req.session.user);
            res.render('home', { logged_in: req.session.username, use_data: use_data , role : req.session.role});
        }
    }
        catch(err){
            console.log(err);
        }
}); 
// Search based on Category
app.get('/inventory/:category', async (req, res) => {
    try{
    const given_category = req.params.category;   
    if (given_category === "AWD" || given_category === "FWD" || given_category === "4x4" || given_category === "RWD" ) {
        const use_data = await data.find({ model: given_category });   
        if (req.session.username) {
            if (use_data) {
                
                res.render('category', { use_data: use_data,  logged_in: req.session.username,role : req.session.role });
            } else {
                res.send('No data found for the given type');
            }
        } else {
            res.render('category', { use_data: use_data, role: "random" , logged_in: req.session.username });
        }
    } 
    else if (given_category === "diesel" || given_category === "hybrid" || given_category === "plugin_hybrid" || given_category === "petrol" || given_category === "electric") {
        const use_data = await data.find({ fuel_type: given_category });       
        if (req.session.username) {
            if (use_data) {
                res.render('category', { use_data: use_data, role:  req.session.role , logged_in: req.session.username,role : req.session.role   });
            } else {
                res.send('No data found for the given fuel type');
            }
        } else {
            res.render('category', { use_data: use_data, role: "random" ,  logged_in: req.session.username});
        }
    } 
    else if (given_category === "sedan" || given_category === "full_suv" || given_category === "mid_suv" || given_category === "compact_suv" || given_category === "coupe" || given_category === "station_wagon" || given_category === "hatchback") {
        const use_data = await data.find({ type: given_category });  
        if (req.session.username) {
            if (use_data) {
                res.render('category', { use_data: use_data, role:  req.session.role,  logged_in: req.session.username,role : req.session.role   });
            } else {
                res.send('No data found for the given type');
            }
        } else {
            res.render('category', { use_data: use_data, role: "random",  logged_in: req.session.username });
        }
    }
    else if(given_category == "pre_owned"){    
    const use_data = await data.find({ pre_owned: "yes" }); 
    if(req.session.username){
        res.render('category', { use_data : use_data, role : req.session.role , logged_in : req.session.username });
    }
    else{
    res.render('category', { use_data : use_data, role : "random" ,  logged_in: req.session.username});
    } 

    }
    else{
        res.send('Please select another category ');
    }
}
    catch(err){
        console.log(err);
    }

});

//Search based on category in rental inventory
app.get('/rental/:category', async (req, res) => {
    try{
    const given_category = req.params.category;   
    if (given_category === "AWD" || given_category === "FWD" || given_category === "4x4" || given_category === "RWD" ) {
        const use_data = await rental.find({ model: given_category });   
        if (req.session.username) {
            if (use_data) {
                
                res.render('category', { use_data: use_data,  logged_in: req.session.username,role : req.session.role });
            } else {
                res.send('No data found for the given type');
            }
        } else {
            res.render('category', { use_data: use_data, role: "random" , logged_in: req.session.username });
        }
    } 
    else if (given_category === "diesel" || given_category === "hybrid" || given_category === "plugin_hybrid" || given_category === "petrol" || given_category === "electric") {
        const use_data = await rental.find({ fuel_type: given_category });       
        if (req.session.username) {
            if (use_data) {
                res.render('category', { use_data: use_data, role:  req.session.role , logged_in: req.session.username,role : req.session.role   });
            } else {
                res.send('No data found for the given fuel type');
            }
        } else {
            res.render('category', { use_data: use_data, role: "random" ,  logged_in: req.session.username});
        }
    } 
    else if (given_category === "sedan" || given_category === "full_suv" || given_category === "mid_suv" || given_category === "compact_suv" || given_category === "coupe" || given_category === "station_wagon" || given_category === "hatchback") {
        const use_data = await rental.find({ type: given_category });  
        if (req.session.username) {
            if (use_data) {
                res.render('category', { use_data: use_data, logged_in: req.session.username,role : req.session.role   });
            } else {
                res.send('No data found for the given type');
            }
        } else {
            res.render('category', { use_data: use_data, role: "random",  logged_in: req.session.username });
        }
    }
    else{
        res.send('Please select another category ');
    }
    }
    catch(err){
        console.log(err);
    }

});
// Personal profile of the person logged in 
app.get('/your_profile',async (req,res)=>{
try{
    if(req.session.username){
        const your_profile = await profile.findOne({username: req.session.username });
        if(your_profile){
            res.render('your_profile', { your_profile : your_profile , logged_in : req.session.username , role : req.session.role });
        }
        else{
           res.send(' it does not exist ');
        }
    }
    else{
        res.send(' please login ')
    }
}
catch(err){
    console.log(err);
}
});
// Car inventory
app.get('/inventory', async (req, res) => {
try{
    const use_data = await data.find({});
    if(req.session.username){
    res.render('inventory', { use_data : use_data, role: req.session.role, logged_in : req.session.username });
    }    

    else{
    res.render('inventory', { use_data : use_data, role: "random", logged_in : req.session.username});
    }
}
catch(err){
    console.log(err);
}
});

// Specific car page
app.get('/buycar/:_id',async (req,res)=>{
    try{
    const specific_car =  await data.findOne({ _id : req.params._id});
    if(req.session.username){
    res.render('buycar', { specific_car:specific_car, logged_in : req.session.username ,role: req.session.role } );
    }
    else {
        res.render('buycar', { specific_car:specific_car, logged_in : req.session.username ,role: "random" } );
    }
    }
    catch(err){
        console.log(err);
    }
});
//Add inventory
app.get('/add', async (req, res) => {
    try{
    if(req.session.username){
        if( req.session.role  == "admin"){
            res.render('add' , { role: req.session.role, logged_in : req.session.username});
        }
        else{
            const newaccessdenied = new accessdenied({
                username: req.session.username,
                date : Date.now(),
                page : "add"
            });
            await newaccessdenied.save();
            res.send('Not authorized');
        }
        }
        else{ 
            res.send(' login required ');
        }
    }
    catch(err){
        console.log(err);
    }
});
//Add inventory -- post
app.post('/add',add.single('file'),(req,res) =>{
    try{
    const newdata = new data ({
       car_name : req.body.car_name,
       company : req.body.company,
       car_year: req.body.car_year,
       model: req.body.model,
       engine : req.body.engine,
       colour: req.body.colour,
       vin_no: req.body.vin_no,
       car_price: req.body.car_price,
       type: req.body.type,
       pre_owned: req.body.pre_owned,
       fuel_type: req.body.fuel_type,
       extra: req.body.extra,
       financing: req.body.financing,
       sale: req.body.sale,
       posted_by: req.session.username,
       updated_last: Date.now(),       
       filename: req.file.filename,
       originalname: req.file.originalname,
       path: req.file.path,

   });
       newdata.save();
       res.redirect('/');
    }
    catch(err){
        console.log(err);
    }
});
//Update Inventory 
app.get('/update/:id' ,async (req,res)=> {
    try{
if(req.session.username){
if( req.session.role == "admin" ||  req.session.role  == "salesman" ){
    data.findById(req.params.id)
    .then(foundData => {
        res.render('update', { datas: foundData ,role: req.session.role, logged_in : req.session.username});
    })
    .catch(err => {
        console.log(err);
    });
}
else{
    const newaccessdenied = new accessdenied({
        username: req.session.username,
        date : Date.now(),
        page : "update"
    });
    await newaccessdenied.save();
    res.send('Not authorized');
}
}
else{ 
    res.send(' login required ')
}
}
catch(err){
    console.log(err);
}
});
// Update inventory -- post
app.post('/update/:id', add.single('file'), async (req, res) => {
    const updatedData = {
        car_name : req.body.car_name,
        company : req.body.company,
        car_year: req.body.car_year,
        model: req.body.model,
        colour: req.body.colour,
        vin_no: req.body.vin_no,
        car_price: req.body.car_price,
        type: req.body.type,
        pre_owned: req.body.pre_owned,
        fuel_type: req.body.fuel_type,
        extra: req.body.extra,
        sale :req.body.sale,
        financing:req.body.financing,
        updated_by: req.session.username,
        updated_last: Date.now(),
        filename : req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path 
    };

    try {
        await data.findByIdAndUpdate(req.params.id, updatedData);
        res.redirect('/inventory');
    } catch (err) {
        console.log(err);
        res.send('Problem homie, no update happening');
    }
});
// Delete inventory
app.get('/delete/:id', async (req,res)=> {
try{
    if(req.session.username){
    const use_profile = await profile.findOne({ username : req.session.username});
    if(use_profile.role == "admin"){
        data.findByIdAndDelete(req.params.id)
        .then(()=> {
            res.redirect('/inventory');
        })
        .catch(err => {
            console.log(err);
        });
    }
    else{
        const newaccessdenied = new accessdenied({
            username: req.session.username,
            date : Date.now(),
            page : "delete"
        });
        await newaccessdenied.save();
        res.send('Not authorized');
    }
    }
    else{ 
        res.send(' login required ')
    }
}
catch(err){
    console.log(err);
}
});


// finance functionality
// imp things
 // https://www.scaler.com/topics/javascript-math-pow/
     // loan formula from  https://cleartax.in/s/car-loan-emi-calculator
// using math pow from https://www.scaler.com/topics/javascript-math-pow/

app.get('/finance/:id', (req, res) => {
    try{
    data.findById(req.params.id)
        .then(foundData => {
            res.render('calc', { datas: foundData , rate : "0", emi: "0" , time : "0" , role: req.session.role, logged_in : req.session.username});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
    }
    catch(err){
        console.log(err);
    }
});
//Finance Post
app.post('/finance/:id', async (req, res) => {
    const { rate, time } = req.body;
    try {
        const datas = await data.findById(req.params.id);
        if(datas){
        const pamount = datas.car_price;
        const time_in_months = time * 12;
        const rate_normal = rate / 100;
        const rate_monthly = rate_normal / 12;

        const emi_upper = pamount * rate_monthly * Math.pow(1 + rate_monthly, time_in_months);
        const emi_down = Math.pow(1 + rate_monthly, time_in_months) - 1;
        const emi = emi_upper / emi_down;
// https://www.geeksforgeeks.org/how-to-parse-float-with-two-decimal-places-in-javascript/
        res.render('calc', { emi : emi.toFixed(2) , rate : req.body.rate , time : req.body.time , datas: datas});
        }
        else{
            res.render(' no data found ');
        }
    }
    catch(err){
        console.log(err);
    }
});
// Rental  invntory
app.get('/rental',async (req,res)=>{
    try{
    const use_rental = await rental.find({});
    if(req.session.username){
    const use_profile  = await profile.findOne({ username : req.session.username});    
    res.render('rental', { use_rental : use_rental, role: req.session.role ,logged_in : req.session.username , use_profile : use_profile});
    }   
    else{
    res.render('rental', { use_rental : use_rental, role: "random" ,logged_in : req.session.username , use_profile: "nope"});
    }
}
catch(err){
    console.log(err);
}
});
// Rental specific car
app.get('/rental_book/:_id',async (req,res)=>{
    try{
    const specific_car =  await rental.findOne({ _id : req.params._id});
    res.render('rental_book', { specific_car:specific_car , logged_in : req.session.username , role : req.session.role} );
    }
    catch(err){
        console.log(err);
    }
});

// To book form a car /rental car -- post
app.post('/book', async(req,res)=>{
    try{
const newbookcar = new bookcar({
    car_name : req.body.car_name,
    company:req.body.company,
    car_year: req.body.car_year,
    model : req.body.model,
    colour :req.body.colour,
    rent_per_hour  : req.body.rent_per_hour,
    engine: req.body.engine,
    type : req.body.type,
    fuel_type :req.body.fuel_type,
    extra : req.body.extra,
    booked_by: req.body.booked_by,
    phone_no : req.body.phone_no,
    rent_or_inventory: req.body.rent_or_inventory
});
newbookcar.save();
if(newbookcar.rent_or_inventory == "rent"){
    res.redirect('/rental');
}
else if(newbookcar.rent_or_inventory == "inventory"){
    res.redirect('/');
}
    }
    catch(err){
        console.log(err);
    }
});
// Rental inventory 
app.get('/rental_add', async (req,res)=>{
try{
    if(req.session.username){
        if( req.session.role  == "admin"){
            res.render('rental_add' , { role: req.session.role, logged_in : req.session.username});
        }
        else{
            const newaccessdenied = new accessdenied({
                username: req.session.username,
                date : Date.now(),
                page : "rental_add"
            });
            await newaccessdenied.save();
            res.send('Not authorized');
        }
        }
        else{ 
            res.send(' login required ')
        }
    }
    catch(err){
        console.log(err);
    }
});
//Rental inventory  -- post

app.post('/rental_add',add.single('file'), async (req,res)=>{
try {
                    const newrental = new rental ({
                        car_name : req.body.car_name,
                        company:req.body.company,
                        car_year: req.body.car_year,
                        model : req.body.model,
                        colour :req.body.colour,
                        rent_per_hour  : req.body.rent_per_hour,
                        engine: req.body.engine,
                        type : req.body.type,
                        fuel_type :req.body.fuel_type,
                        extra : req.body.extra,
                        posted_by: req.session.username,
                        updated_last: Date.now(),
                                     
                        filename: req.file.filename,
                        originalname: req.file.originalname,
                        path: req.file.path,
                    });             
                        newrental.save();
                        res.redirect('/rental')
                    } 
                    catch{
                        err => { console.log(err);}
                    }
                });
// Rental INventpry update
app.get('/rental_update/:id', async (req, res) => {
    try{
    if(req.session.username){
        if( req.session.role  == "admin" || "salesman"){
            rental.findById(req.params.id)
            .then(rentals => {
                res.render('rental_update', { rentals: rentals ,role: req.session.role, logged_in : req.session.username});
            })
            .catch(err => {
                console.log(err);
            });
        }
        else{
            res.send(' authorisation failed ')
            const newaccessdenied = new accessdenied({
                username: req.session.username,
                date : Date.now(),
                page : "rental_add"
            });
            await newaccessdenied.save();
        }
        }
        else{ 
            res.send(' login required ')
        }
    }
    catch(err){
        console.log(err);
    }
});
// Rental inventory update post
app.post('/rental_update/:id', add.single('file'),async (req,res)=>{
    try {
    const updatedRental = {
        car_name : req.body.car_name,
        company:req.body.company,
        car_year: req.body.car_year,
        model : req.body.model,
        colour :req.body.colour,
        rent_per_hour  : req.body.rent_per_hour,
        engine: req.body.engine,
        type : req.body.type,
        fuel_type :req.body.fuel_type,
        extra : req.body.extra,
        updated_last :Date.now(),
        updated_by: req.session.username,
        filename : req.file.filename,
        originalname : req.file.originalname,
        path : req.file.path
    };
         
  
        await rental.findByIdAndUpdate(req.params.id, updatedRental, { new: true });
        res.redirect('/rental');
    } catch (err) {
        console.log(err);
        res.send('Problem homie, no update happening');
    }
});
// Rental delete inventory
app.get('/rental_delete/:id', async (req,res)=> {
    try{
    if(req.session.username){
    if( req.session.role  == "admin"){
        rental.findByIdAndDelete(req.params.id)
        .then(()=> {
            res.redirect('/rental');
        })
        .catch(err => {
            console.log(err);
        });
    }
    else{
        const newaccessdenied = new accessdenied({
            username: req.session.username,
            date : Date.now(),
            page : "rental delete"
        });
        await newaccessdenied.save();
        res.send('Not authorized');
    }
    }
    else{ 
        res.send(' login required ')
    }
}
catch(err){
    console.log(err);
}
});

// sign up 
app.get('/signup', (req,res)=> {
    try{
    res.render('signup');
    }
    catch(err){
        console.log(err);
    }
});
// Sign Up - Post check
app.post('/signup', async (req, res) => {
    const newprofile = new profile({
      username: req.body.username,
      password: req.body.password,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      contact : req.body.contact,      
      role: req.body.role,
    });
    try {
        // using to check if the same username with the same letters but in upper or lower case exists
        // https://youtu.be/YX2mqib4wOI?si=nAoucRZ_Ti6jmS1R
      const checkUser = await profile.findOne({ username: newprofile.username })
      .collation({ locale:"en", strength: 2})
      .exec();
      const check_email = await profile.findOne({ email: newprofile.email })
      .collation({ locale:"en", strength: 2})
      .exec();
      const check_contact = await profile.findOne({ contact : newprofile.contact })
      .collation({ locale:"en", strength: 2})
      .exec();
       if(checkUser){
          res.send('username already exits ');
      }
      else if(check_email){
          res.send(' email already in use ');
      }
      else if(check_contact){
          res.send(' contact already in use ');
      }
      else {
        const hash_password = await bcrypt.hash(newprofile.password, 10);
        newprofile.password = hash_password;
        await newprofile.save();
        res.redirect('/login');
      }
    }
    catch(err){
        console.log(err);
    }
});
// login 
app.get('/login', (req,res)=> {
    try{
    res.render('login' );
    }
    catch(err){
        console.log(err);
    }
});
// Login post - Authentication 
app.post('/login', async (req, res) => {
    try {
        const { check_username, check_pwd } = req.body;
        const user = await profile.findOne({ username: check_username });
     
        if (!user) {
            return res.send('Username not found. Please check your username.');
        }
        const passwordMatch =  bcrypt.compare(check_pwd, user.password);
        if (!passwordMatch) {
            return res.send('Incorrect password. Please check your password.');
        }
        else {
            const login_username =  check_username;
            req.session.username = login_username;
            req.session.role = user.role;
        res.redirect('/');
        }
    }
    catch(err){
        console.log(err);
    }
});

// logout 
app.get('/logout', (req, res) => {
    req.session.destroy(err => { // Destroy session
     if (err) {
        res.status(500).send('Logout failed!');
        console.log(err); // Send error response if logout failed
      } else {
        res.redirect('/'); // Redirect to the home page after logout
      }
  
    });
});

// Search function for inventory
app.post('/search', async (req, res) => {
    const givenSearch = req.body.search;
    try {
        // https://youtu.be/YX2mqib4wOI?si=nAoucRZ_Ti6jmS1R
        // https://www.mongodb.com/docs/manual/reference/collation/
    const searchdata0 = await data.find({ car_name: givenSearch})
    .collation({ locale:"en", strength: 2})
    .exec();
    const searchdata1 = await data.find({ company: givenSearch})
    .collation({ locale:"en", strength: 2})
    .exec();
    const searchdata2 = await data.find({ model: givenSearch })
    .collation({ locale:"en", strength: 2})
    .exec();
    const searchdata3 = await data.find({ colour: givenSearch })
    .collation({ locale:"en", strength: 2})
    .exec();

    if (searchdata0) {
        res.render('inventory', { use_data: searchdata0  , role: req.params.role ,  logged_in: req.session.username}); 
    } 
    else if (searchdata1) {
        res.render('inventory', { use_data :searchdata1  , role: req.params.role, logged_in: req.session.username }); 
    } 
    else if (searchdata2) {
        res.render('inventory', { use_data:searchdata2 , role: req.params.role , logged_in: req.session.username }); 
    } 
    else if (searchdata3) {
        res.render('inventory', { use_data:searchdata3  , role: req.params.role , logged_in: req.session.username}); 
    } 
    else {
        res.send('no data');
    }
}
catch(err){
    console.log(err);
}
});

// Search function for rental inventory
app.post('/search_rental', async (req,res)=>{
    const givenSearch = req.body.search;
    try {
        // https://youtu.be/YX2mqib4wOI?si=nAoucRZ_Ti6jmS1R
        // https://www.mongodb.com/docs/manual/reference/collation/
    const searchdata0 = await rental.find({ car_name: givenSearch})
    .collation({ locale:"en", strength: 2})
    .exec();
    const searchdata1 = await rental.find({ company: givenSearch})
    .collation({ locale:"en", strength: 2})
    .exec();
    const searchdata2 = await rental.find({ model: givenSearch })
    .collation({ locale:"en", strength: 2})
    .exec();
    const searchdata3 = await rental.find({ colour: givenSearch })
    .collation({ locale:"en", strength: 2})
    .exec();

    if (searchdata0) {
        res.render('rental', { use_rental: searchdata0  , role: req.params.role,  logged_in: req.session.username}); 
    } 
    else if (searchdata1) {
        res.render('rental', { use_rental :searchdata1  , role: req.params.role, logged_in: req.session.username }); 
    } 
    else if (searchdata2) {
        res.render('rental', { use_rental:searchdata2 , role: req.params.role,  logged_in: req.session.username }); 
    } 
    else if (searchdata3) {
        res.render('rental', { use_rental:searchdata3  , role: req.params.role, logged_in: req.session.username }); 
    } 
    else {
        res.send('no data');
    }
}
catch(err){
    console.log(err);
}
});

// special note ⭐
// named it inventory as the url shows inventory -- did it to make website look clean 
// https://gist.github.com/madaf/b37ccbc5176172763ccfb8187ef02993

// Filter by price for inventory
app.post('/inventory',async (req,res)=>{
    try{
const givenprice = req.body.price;
 if(givenprice == "under 5000"){
    const use_data = await data.find({ car_price: { $lte: 5000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role , car_under : givenprice,  logged_in: req.session.username });
}
else if(givenprice == "5000 - 10000"){
    const use_data = await data.find({ car_price: { $gte: 5000, $lte: 10000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice,  logged_in: req.session.username});
}
else if(givenprice == "10000 - 20000"){
    const use_data = await data.find({ car_price: { $gte: 10000, $lte: 20000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice, logged_in: req.session.username});
}
else if(givenprice == "20000 - 30000"){
    const use_data = await data.find({ car_price: { $gte: 20000, $lte: 30000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice,  logged_in: req.session.username});
}
else if(givenprice == "30000 - 40000"){
    const use_data = await data.find({ car_price: { $gte: 30000, $lte: 40000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice,  logged_in: req.session.username});
}
else if(givenprice == "40000 - 50000"){
    const use_data = await data.find({ car_price: { $gte: 40000, $lte: 50000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice,  logged_in: req.session.username});
}
else if(givenprice == "50000 - 60000"){
    const use_data = await data.find({ car_price: { $gte: 50000, $lte: 60000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice,  logged_in: req.session.username});
}
else if(givenprice == "60000 - 100000"){
    const use_data = await data.find({ car_price: { $gte: 60000, $lte: 100000 }});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice,  logged_in: req.session.username});
}
else if(givenprice == "100000 ++"){
    const use_data = await data.find({ car_price: { $gte: 100000}});
    res.render('inventory',{ use_data : use_data , role : req.session.role  , car_under : givenprice,  logged_in: req.session.username});
}
else{
    res.send(' problem bro ')
}
    }
    catch(err){
        console.log(err);
    }
});

// Filter by price for rental inventory
app.post('/rental', async(req,res)=>{
    try{
        const givenprice = req.body.price;
         if(givenprice == "under 20"){
            const use_rental = await rental.find({ rent_per_hour: { $lte: 20 }});
            res.render('rental',{ use_rental : use_rental , role : req.session.role , car_under : givenprice , logged_in : req.session.username});
        }
        else if(givenprice == "20 - 50"){
            const use_rental = await rental.find({ rent_per_hour: { $gte: 20, $lte: 50 }});
            res.render('rental',{ use_rental : use_rental , role : req.session.role  , car_under : givenprice, logged_in : req.session.username});
        }
        else if(givenprice == "50 - 70"){
            const use_rental = await rental.find({ rent_per_hour: { $gte: 50, $lte: 70 }});
            res.render('rental',{ use_rental : use_rental , role : req.session.role  , car_under : givenprice,logged_in : req.session.username});
        }
        else if(givenprice == "70 - 100"){
            const use_rental = await rental.find({ rent_per_hour: { $gte: 70, $lte: 100 }});
            res.render('rental',{ use_rental : use_rental , role : req.session.role  , car_under : givenprice, logged_in : req.session.username});
        }
        else if(givenprice == "100++"){
            const use_rental = await rental.find({ rent_per_hour: { $gte: 100 }});
            res.render('rental',{ use_rental : use_rental , role : req.session.role  , car_under : givenprice, logged_in : req.session.username});
        }
        else{
            res.send(' problem bro ')
        }
            }
            catch{
                err => { console.log(err);}
            }
});

// https://gist.github.com/madaf/b37ccbc5176172763ccfb8187ef02993


// Services 
app.get('/services', (req,res)=>{
try{
    res.render('services' , { logged_in: req.session.username,role : req.session.role });
}
catch(err){
    console.log(err);
}
});
//services category
app.get('/services/:category', async (req,res)=>{
    try{
const given_category = req.params.category;
if(given_category == "oil_change"){
    res.render('maintenance', {given_category: given_category , logged_in: req.session.username,role : req.session.role });
}
else if(given_category == "tire_change"){
    res.render('maintenance', {given_category: given_category , logged_in: req.session.username,role : req.session.role });
}
else if(given_category == "safety_inspection"){
    res.render('maintenance', {given_category: given_category, logged_in: req.session.username,role : req.session.role });
}
else{
    res.send(' no-data found ');
}
    }
    catch(err){
        console.log(err);
    }
});
// to book service appointment 
app.post('/services/:category', async (req,res)=>{
    try{
        if(req.session.role == "user"){
            const newappointment = new appointment ({
                car_name : req.body.car_name,
                car_year: req.body.car_year,
                model: req.body.model,
                fuel_type: req.body.fuel_type,
                booked_by: req.body.booked_by,
                phone_no : req.body.phone_no,
                category:req.body.category,
                discount_app : "10%"
            });
        newappointment.save();
        res.redirect('/services');
    }
    else{
        const newappointment = new appointment({
            car_name : req.body.car_name,
            car_year: req.body.car_year,
            model: req.body.model,
            fuel_type: req.body.fuel_type,
            booked_by: req.body.booked_by,
            phone_no : req.body.phone_no,
            category:req.body.category
    
            });
      await   newappointment.save();
        res.redirect('/services');
        }
    }
    catch(err){
        console.log(err);
    }

    });
app.get('/support',(req,res)=>{
try{
    if(req.session.username){
    res.render('support', { logged_in : req.session.username, role : req.session.role});
    }
    else{
        res.render('support', { logged_in : req.session.username, role : "random"});
    }
}
catch(err){
    console.log(err);
}
});
app.get('/parts', (req,res)=>{
    try{
    if(req.session.username){
    res.render('parts', { logged_in : req.session.username, role : req.session.role});
    }
    else{
        res.render('parts', { logged_in : req.session.username, role : "random"});
    }
}
catch(err){
    console.log(err);
}
});
//  Shows all other users
app.get('/profile', async (req, res) => {
    try {
        if (req.session.username) { // Checking if the user is logged in
            const use_profile = await profile.findOne({ username: req.session.username });
            if (use_profile) { // User profile exists
                if ( req.session.role === "admin") { // If user is admin
                    const profiles = await profile.find({});
                    res.render('profiles', { profiles: profiles, role: req.session.role, logged_in : req.session.username });                    
                } else { // If user is not admin
                    const newaccessdenied = new accessdenied({
                        username: req.session.username,
                        date : Date.now(),
                        page : "profile"
                    });
                    await newaccessdenied.save();
                    res.send('Not authorized');
                }
            } else {
                // User profile does not exist
                res.send('Profile not found');
            }
        } else {
            // User is not logged in
            res.send('Login required');
        }
    } catch (err) {
        console.error('Error in /profile route:', err);
        res.status(500).send('An error occurred');
    }
});

// Updates Role of user
app.get('/update_role/:id',async (req,res)=>{
    try {
        if (req.session.username) { // Checking if the user is logged in
                if (req.session.role === "admin") { // If user is admin
                    profile.findById(req.params.id)
                    .then(found_profile => {
                        res.render('update_role', {profile: found_profile, role: req.session.role, logged_in : req.session.username });
                    })
                    .catch(err=> {
                        console.log(err);
                    });                   
                } else { // If user is not admin
                    const newaccessdenied = new accessdenied({
                        username: req.session.username,
                        date : Date.now(),
                        page : "update role "
                    });
                    await newaccessdenied.save();
                    res.send('Not authorized');
                }
        } else {
            // User is not logged in
            res.send('Login required');
        }
    }     catch(err){
        console.log(err);
    }
});
// Updates role (different for admin role)
app.post('/update_role/:id',async (req, res) => {
const{role} = req.body
 try{
     if(role =="admin"){
         res.render('check_admin', { role: req.session.role, logged_in : req.session.username})
     }
     else{
         await profile.findByIdAndUpdate(req.params.id, {role:role});
         res.redirect('/profile');
     }
 }
 catch(err){
    console.log(err);
}
 });
// Admin Authentication to given promotion to admin
app.post('/check_admin', async (req, res) => {
    const { username, admin_code } = req.body;
    try {
                if (admin_code == "notadmin") {
                    const new_role = "admin";
                    const use_profile = await profile.findOne({ username: username });
                    // to check if the user exists in our database
                    if (use_profile) {
                        await profile.updateOne({ username: username }, { $set: { role: new_role } });
                        res.redirect('/profile');
                    } else {
                        res.send('The username you are trying to give authorization does not exist');
                    }
        }
        else{
            const newaccessdenied = new accessdenied({
                username: req.session.username,
                date : Date.now(),
                page : "check admin "
            });
            await newaccessdenied.save();
            res.send(' not correct admin code');
        }
    }
    catch(err){
        console.log(err);
    }
});
// uses key and certificate . pem file for the https 
const options={
    key:fs.readFileSync('key.pem'),
    cert: fs.readFileSync('certificate.pem')
};
https.createServer(options,app).listen(PORT_NUMBER,()=>{
    console.log(`Server running on ${PORT_NUMBER}`);
});