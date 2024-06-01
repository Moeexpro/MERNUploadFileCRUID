const moment = require('moment');

const handleBlobHeaders = (fileName) => {
    const checkEXT = fileName?.substring(
        fileName?.lastIndexOf(".") + 1,
        fileName?.length);
    switch(checkEXT)
    {
        case "pdf": return {
            blobContentType: 'application/pdf'
        };
        case "doc": return {
            blobContentType: 'application/msword'
        };
        case "jpeg": return {
            blobContentType: 'image/jpeg'
        };
        case "png": return {
            blobContentType: 'image/png'
        }
        case "mp4": return {
            blobContentType: 'video/mp4'
        }
        default: return {
           blobContentType : 'application/octet-stream'
        }
    }
}

const handleUploadToBlobStorage = async(base64File,containerName,blobName,blobServiceClient) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure the container exists
    await containerClient.createIfNotExists();

    // Create a block blob client
    const uniqueBlobName = `${moment(new Date()).format('DDMMYYHHMMss')}-${blobName}`;
    console.log(uniqueBlobName);
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueBlobName);

    // Convert base64 to buffer
    const buffer = Buffer.from(base64File, 'base64');

    // Upload the buffer
    console.log("File EXT",handleBlobHeaders(blobName));
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: handleBlobHeaders(blobName)
    });

    // Get the URL of the uploaded blob
    const blobUrl = blockBlobClient.url;
    return blobUrl;
}   

module.exports.handleUploadToBlob = handleUploadToBlobStorage;