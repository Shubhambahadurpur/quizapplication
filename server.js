let express = require('express');
let app = express();
let fs = require('fs');
let multer = require('multer');
let ejs = require('ejs');
let path = require('path');
let globalArray = [];
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const upload = multer({ dest: 'uploads/' })

app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {    // home page route to show the quiz
    fs.readFile("dat.txt", "utf-8", (err, data) => {        // reading dat.txt file having array of file name
        if (err) throw err;
        else {
            let fname = JSON.parse(data);   // getting the array of files of quiz
            let total = fname.length;       // number of quiz
            fs.readFile("score.txt", "utf-8", (err, data) => {      // reading the score file
                if (err) throw err;
                else {
                    if (data === "") {          // if score is empty
                        let scArray = [];       // empty array will be created
                        res.render("quiz.ejs", { total, fname, scArray });      // render the quiz.ejs file having all the quiz
                    }
                    else {
                        let scArray = JSON.parse(data);             // get the score from score.txt
                        res.render("quiz.ejs", { total, fname, scArray });      // render the quiz.ejs
                    }
                }
            })

        }
    })
})



app.get("/uploadfile", (req, res) => {          // route for uploading the file 
    res.sendFile(__dirname + "/public/as.html");    // send the as.html file
})
app.post("/uploadfile", upload.single("qus"), (req, res) => {   // route for handling the post request from the as.html
    let count;
    // let ar = [];
    fs.readFile("./dat.txt", "utf-8", (err, data) => {      // reading dat.txt containing the file names of different quiz
        if (err) throw err;
        else {
            let ar = JSON.parse(data);                  // getting array of name 'ar' of files names
            ar.push(req.file.filename);                 // pushing the new file name in the 'ar' array
            let filename = req.file.filename;
            let temp = JSON.stringify(ar);              // converting 'ar' array into string
            fs.writeFile("dat.txt", temp, (err) => {    // writing into the file
                if (err) throw err;
                fs.readFile("score.txt","utf-8",(err,data)=>{
                    if (err) throw err;
                    else {
                        let arr = [];
                        if (data === "") {  
                            let obj={
                                file:filename,
                                hs:0,
                                cs:0
                            }
                            arr.push(obj);
                        }
                        else{
                            arr = JSON.parse(data);
                                let obj={
                                    file:filename,
                                    hs:0,
                                    cs:0
                                }
                                arr.push(obj);
                        }
                        fs.writeFile("score.txt",JSON.stringify(arr),(err,data)=>{
                            if(err) throw err;
                        })
                    }
                })
            })
        }
    })

    res.sendFile(__dirname + "/public/success.html");     // sending a file into response
});


let key;
// app.get("/quizdash", (req, res) => {        // handling the request on '/quizdash' route
//     let qfile = `uploads/${req.query.filename}`;    // getting the pathname of the specific file 
//     let nfile = `${req.query.filename}`;            // getting the file name
//     fs.readFile(qfile, "utf-8", (err, data) => {    // reading the file having questions
//         if (err) throw err;
//         else {
//             let array = JSON.parse(data);           // getting the questions and storing into the 'array' named array
//             res.render("question", { array, nfile });   // rendering the question.ejs 
//         }
//     })
// })

app.get("/question", (req, res) => {    // handling the request on the '/question' route
    res.send("ok");

})
app.post("/question", (req, res) => {   // handling the post request on '/question' route
    key = req.body.id;
    res.send("ok");

})

app.get("/score", (req, res) => {   // for handling the request on '/score' route
    res.send("ok");
})
app.post("/score", (req, res) => {  // for handling the post request on '/score' route
    let cnt = 0;
    let newArray = [];
    console.log(req.body.score);
    let myArr = req.body.score;
    let filename = req.body.myFile.trim();
    let fle = `/uploads/${filename}`;     // path of the file having questions and ans

    fs.readFile(__dirname+fle,"utf-8",(err,data)=>{
        if(err){
            throw err;
        }
        else{
            let fileArr = JSON.parse(data);
            for(let i = 0;i < myArr.length;i++)
            {
                for(let j = 0;j < fileArr.length;j++)
                {
                    if(myArr[i].id === fileArr[j].id)
                    {
                        if(myArr[i].answer === fileArr[j].ans)
                        {
                            cnt++;
                        }
                    }
                }
            }
            // console.log("value=",cnt);
        }

        fs.readFile("dat.txt", "utf-8", (err, data) => {    // reading the file dat.txt
            let index = -1;
            if (err) throw err;
            else {
                let fileArray = JSON.parse(data);
                for (let i = 0; i < fileArray.length; i++) {
                    if (fileArray[i] === filename) {         // finding the file name
                        index = i; // getting the index of that file
                        break;
                    }
                }
            }
    
                fs.readFile("score.txt", "utf-8", (err, data) => {      // reading the score.txt file
                    let arr = [];
                    if (err) throw err;
                    else {
                        if (data === "") {  
                            let obj={
                                file:filename,
                                hs:cnt,
                                cs:cnt
                            }
                            arr.push(obj);
                        }
                        else {               
                            arr = JSON.parse(data);  
                            flag = 0; 
                            for(let i = 0;i < arr.length;i++)
                            {
                                if(arr[i].file === filename)
                                {   arr[i].cs = cnt;
                                    console.log(cnt,arr[i]);
                                    if(cnt > arr[i].hs){
                                        arr[i].hs = cnt;
                                    }
                                    flag = 1;
                                    break;
                                }
                            }
                            if(flag === 0)
                            {
                                let object = {
                                    file:filename,
                                    hs:cnt,
                                    cs:cnt
                                }
                                arr.push(object);
                            }
                        }

                        fs.writeFile("score.txt", JSON.stringify(arr), (err) => {   // writing score array in file
                            if (err){
                                throw err;
                                }
                            res.json(filename);
                            return;
                        })
                    }
                })
        })
    })
})





app.get("/abc", (req, res) => {         // handling the request on the '/abc' request
    fs.readFile("score.txt","utf-8",(err,data)=>{
        let arr;
        if(err)
        {
            res.send(err);
        }
        else{
            let array = JSON.parse(data);
            console.log(req.query.file);
            let newFile = req.query.file;
            console.log(newFile)
            let index;
            for(let i = 0;i < array.length;i++)
            {
                if(newFile === array[i].file)
                index = i;
            }
                let fname =  `/uploads/${newFile}`;
                    fs.readFile(__dirname+fname,"utf-8",(err,data)=>{
                        if(err)
                        res.send(err);
                        else{
                            arr = JSON.parse(data);
                            res.render("score", { marks:array[index].cs, totalMarks:arr.length });  
                        }
                    })
                  
        }
    })
    
    
})





function _readFile(filename, callback) {
    let trimedFile = filename.trim();
    fs.readFile(__dirname+`/${trimedFile}`, "utf-8", (err, data) => {
       if(err)
       {
        throw err;
       }
       else{
        callback(err, data);
       }
        

    })
}


app.get("/quizdash", (req, res) => {        // handling the request on '/quizdash' route
    let qfile = `uploads/${req.query.filename}`;    // getting the pathname of the specific file 
    let nfile = `${req.query.filename}`;            // getting the file name

    _readFile(qfile, (err, data) => {
        let array = JSON.parse(data);  // getting the questions and storing into the 'array' named array
        // console.log(array);
        let a=[],b=[];
        let nArr = [];
        for(let i = 0;i < 5;i++)
        {
            a[i] = array[(Math.floor(Math.random() * array.length))];
            b = [... new Set(a)];
        }
        for (let i = 0; i < b.length; i++) {
            nArr[i] = b[i];
            
        }
        
        console.log(nArr);
        res.render("question", { nArr,array, nfile });   // rendering the question.ejs 

    })

})

app.get('/*', (req, res) => {       // handling the unhandled request
    res.send("404 not found")
})

app.listen(8000, () => {            // listning the port 8000
    console.log("server initiated");
})

