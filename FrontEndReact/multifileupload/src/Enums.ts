

export const apiPaths = {
    base : process.env.REACT_APP_API_URL ?? "https://mernuploadbe.netlify.app/.netlify/functions/api/",
    uploadFiles : 'uploadFiles',
    getFiles : 'getFiles',
    deleteFile : 'deleteFiles',
    updateFile: 'updateFile'
}