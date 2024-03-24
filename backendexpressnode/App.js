const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());
const FileSchema = require('./Models/Files');

mongoose.connect("mongodb+srv://moeezamir79:Moeexpro8083@cluster0.nx9opu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Connected to MongoDB")
    app.listen(3200, () => {
        console.log(`Server ruhning at PORT http://localhost:${3200}`);
    })
})

app.get('/',(req,res)=>{
    res.json({
        name: "Moeez"
    })
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Post API for uploading Files...
app.post('/api/uploadFiles', async (req, res) => {
    const { filebase64, fileName } = req.body;
    try {
        await FileSchema.create({
            file: filebase64,
            fileName : fileName
        }).then((resp) => {
            res.setHeader("Access-Control-Allow-Origin","*");
            res.status(200).json({
                data: resp,
                message: "File Uploaded Successfully"
            })
        })
    }
    catch (error) {
        !filebase64 && res.status(400).json({
            data: null,
            message: "file not sent in payload"
        })
        filebase64 && res.status(500).json({
            data: null,
            message: error.message
        })
    }
})

// Get API to fetch all uploaded files...
app.get('/api/getFiles', async (req, res) => {
    try {
        await FileSchema.find().then((response) => {
            res.status(200).json({
                data: response,
                message: "Files Fetched Success"
            })
        })
    }
    catch (error) {
        res.status(500).json({
            data: null,
            message: error.message
        })
    }
})

// Delete API to delete uploaded files... 
app.delete('/api/deleteFiles/:id',async(req,res)=> {
try{
    await FileSchema.findByIdAndDelete(req.params.id).then(()=>{
        res.status(200).json({
            message : "File Deleted Successfully"
        })
    })
}
catch(error)
{
    res.status(500).send(error.message);
}
})