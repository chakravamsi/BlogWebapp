const express=require('express');
const app=express();
const cors=require('cors');
const mysql=require('mysql2');
const bcrypt=require('bcrypt');
require('dotenv').config();
const PORT = process.env.PORT || 3000;


app.use(cors({origin:'*'}))
app.use(express.json({limit:'10MB'}))
app.use(express.urlencoded({extended : true,limit :'10mb'}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});



db.connect((err) => {
    if (err) {
        console.error(" Connection to database failed!", err);
        return;
    }
    console.log("Database connected successfully!");

    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            Name VARCHAR(50),
            phoneNumber VARCHAR(15),
            emailAddress VARCHAR(100) UNIQUE,
            password VARCHAR(250),
            CreatedAt DATETIME DEFAULT NOW(),
            role VARCHAR(10) DEFAULT 'user'
        );
    `;

    db.query(createUsersTable, (err) => {
        if (err) {
            console.error(" Error creating Users table:", err);
        } else {
            console.log(" Users table is ready.");
        }
    });

    const createBlogsTable = `
        CREATE TABLE IF NOT EXISTS Blogs (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            UserID INT,
            BlogCategory VARCHAR(50),
            BlogTitle VARCHAR(100),
            BlogContent VARCHAR(2500),
            BlogPreviewContent VARCHAR(100),
            CreatedAt DATETIME DEFAULT NOW(),
            isFeatured BOOLEAN DEFAULT FALSE,
            BlogImageURL VARCHAR(500),
            FOREIGN KEY(UserID) REFERENCES Users(ID)
        );
    `;

    db.query(createBlogsTable, (err) => {
        if (err) {
            console.error(" Error creating Blogs table:", err);
        } else {
            console.log(" Blogs table is ready.");
        }
    });
});

app.get('/',(req,res)=>{
    console.log("In base route");
    res.status(200).json("You are in base route")
})

app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM Users WHERE emailAddress = ?`, [email], async (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Something went wrong" });
        }
        if (result.length === 0) {
            return res.status(401).json({ isMatched: false, message: "User not found" });
        }

        const passwordFromDB = result[0].password;
        const UserID = result[0].ID;
        const role = result[0].role; 

        const isMatched = await bcrypt.compare(password, passwordFromDB);

        return res.status(200).json({
            isMatched,
            UserID,
            role 
        });
    });
});



app.post('/user/registration',async (req,res)=>{
    
    let {name,phoneNumber,emailAddress,password} = req.body

    db.query(`select * from Users where emailAddress = ?`, [emailAddress], async (error, results)=>{
        if(error){
            console.error("Database error:", error);
            return res.status(500).json("something went wrong");
        }
        if(results.length > 0){
            return res.status(400).json("User already exists with this email");
        }
    
    let hashedpassword= await bcrypt.hash(password,10)
    console.log('After Assinging :',name,phoneNumber,emailAddress,password,hashedpassword)
    let result = db.query(`insert into Users(Name,phoneNumber,emailAddress,password) values ('${name}','${phoneNumber}','${emailAddress}','${hashedpassword}')`,(error,result)=>{
        if(error){
            return res.status(500).json("Something went wrong")
        }
        return res.status(200).json("User registration successfully")
    }
);
    })
  
     
})


app.post('/blog/newBlog',(req,res)=>{
    console.log(req.body);

    let {UserID, category, title, content, imageURL} = req.body;
    const preview = content.length > 50 ? content.slice(0, 50) + "...................." : content;

    db.query(`INSERT INTO Blogs(UserID, BlogCategory, BlogTitle, BlogContent, BlogPreviewContent, BlogImageURL) VALUES(?, ?, ?, ?, ?, ?)`,
        [UserID, category, title, content, preview, imageURL],
        (error, result) => {
            if(error){
                console.log(error)
                return res.status(500).json("Something went wrong");
            }
            return res.status(200).json("Blog posted successfully");
        }
    );
});


app.get('/blog/getAllBlogs',(req,res)=>{
    console.log("Fetching All blogs")
    res.status(200).json("Sent data from server")
})

app.get('/blog/GetBlog/:ID', (req, res) => {
    const blogID = req.params.ID;

    db.query(`SELECT * FROM Blogs WHERE ID = ?`, [blogID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json("Error getting blog");
        }
        return res.status(200).json(result); 
    });
});


app.get('/blog/Category/:category', (req, res) => {
    const category = req.params.category;
    console.log("Fetching category:", category);

    db.query(
        "SELECT * FROM Blogs WHERE BlogCategory = ?",
        [category],
        (error, results) => {
            if (error) {
                console.error("Error fetching category blogs:", error);
                return res.status(500).json({ message: "Server error", error });
            }
            console.log("Results:", results);
            return res.status(200).json(results);
        }
    );
});



app.get('/blog/getUserBlogs/:userID', (req, res) => {
    const userID = req.params.userID;

    db.query(`SELECT * FROM Blogs WHERE UserID = ? ORDER BY ID DESC`, [userID], (error, results) => {
        if (error) {
            console.error("Error fetching blogs:", error);
            return res.status(500).json("Failed to get user blogs");
        }
        return res.status(200).json(results);
    });
});

app.delete('/blog/delete/:id', (req, res) => {
    const blogID = req.params.id;

    db.query(`DELETE FROM Blogs WHERE ID = ?`, [blogID], (err, result) => {
        if (err) {
            console.error("Error deleting blog:", err);
            return res.status(500).json({ message: "Failed to delete blog" });
        }
        return res.status(200).json({ message: "Blog deleted successfully" });
    });
});

app.patch('/blog/feature/:id', (req, res) => {
    const blogID = req.params.id;
    const query = `UPDATE Blogs SET isFeatured = 1 WHERE ID = ?`;

    db.query(query, [blogID], (err, result) => {
        if (err) {
            console.error("Failed to feature blog:", err);
            return res.status(500).json({ message: "Failed to feature blog" });
        }
        res.status(200).json({ message: "Blog featured successfully" });
    });
});

app.put('/blog/update/:id', (req, res) => {
    const blogID = req.params.id;
    const { title, content, category, imageURL } = req.body;
    const preview = content.length > 50 ? content.slice(0, 50) + "...................." : content;

    const query = `
        UPDATE Blogs 
        SET BlogTitle = ?, BlogContent = ?, BlogCategory = ?, BlogPreviewContent = ?, BlogImageURL = ?
        WHERE ID = ?`;

    db.query(query, [title, content, category, preview, imageURL, blogID], (err, result) => {
        if (err) {
            console.error("Error updating blog:", err);
            return res.status(500).json({ message: "Update failed" });
        }
        res.status(200).json({ message: "Blog updated successfully" });
    });
});



app.listen(PORT,()=>{
    console.log("Server started at port 3000");
})
