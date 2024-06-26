
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const azureblob = require('@azure/storage-blob');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());
const FileSchema = require('../Models/Files');
const serverless = require('serverless-http');
const functions = require('../devOpsFunctions/AzureFunctions');
const router = express.Router();
router.use(bodyParser.json({ limit: '100mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
// Replace with your Azure Storage account name and key
const accountName = process.env.accountName;
const accountKey = process.env.accountKey;

//MongoPass
const mongoPassword = process.env.mongopass;;


// Create the BlobServiceClient
const blobServiceClient = new azureblob.BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new azureblob.StorageSharedKeyCredential(accountName, accountKey)
);

mongoose.connect(`mongodb+srv://moeezamir79:${mongoPassword}@cluster0.nx9opu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    console.log("Connected to MongoDB")
    app.listen(3200, () => {
        console.log(`Server ruhning at PORT http://localhost:${3200}`);
    })
}).catch((error)=> console.log(error.message));

router.get('/',(req,res)=>{
    res.json({
        name: "Moeez"
    })
})

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Post API for uploading Files...
router.post('/uploadFiles', async (req, res) => {
    const { filebase64, fileName } = req.body;
    const containerName = "files";
    try {
        const checkSameFile = await FileSchema?.find({fileName: fileName});
        console.log(checkSameFile);
        if(checkSameFile?.length === 0)
        {
        if(filebase64?.length > 0 && fileName?.length > 0)
        {
       const fileURL = await functions.handleUploadToBlob(filebase64,containerName,fileName,blobServiceClient);
        await FileSchema.create({
            file: fileURL,
            fileName : fileName,
            file64: filebase64
        }).then((resp) => {
            res.setHeader("Access-Control-Allow-Origin","*");
            res.status(200).json({
                data: resp,
                message: "File Uploaded Successfully"
            })
        })
        
    }

    else
    {
        res.status(400).json({
            message: "Incorrect Payload Data"
        })
    }
}
else
{
    res.status(400).json({
        message: "Same File Already Exists!"
    })
}
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
router.get('/getFiles', async (req, res) => {
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
router.delete('/deleteFiles/:id',async(req,res)=> {
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

//Update FileName API
router.put('/updateFile/:id',async(req,res)=> {
    const {fileName,file} = req.body;
try{
    if(fileName?.length > 0 && file?.length > 0)
    {
const updateResp = await FileSchema.findByIdAndUpdate(req.params.id,req.body);
res.status(200).json({
    message: updateResp
})
    }
    else
    {
        res.status(400).json({
            message: "Invalid Request body"
        })
    }
}
catch(error)
{
    res.status(500).json({
        message:error.message
    })
}
})


app.use('/.netlify/functions/api',router);
module.exports.handler = serverless(app);