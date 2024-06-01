import React from "react";
import ReactPlayer from "react-player";
import {Drawer} from 'antd';
// @ts-ignore
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { Height } from "@mui/icons-material";

interface IProps {
    fileName : string;
    filePath : string;
    setOpenFilePreviewer : (e : boolean) => void;
    openFilePreviewer : boolean;
}

const FilePreviewer = ({fileName,filePath, setOpenFilePreviewer,openFilePreviewer} : IProps) => {
    const getFileExt = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
    console.log(filePath);
    const docs = [{
        uri: filePath
    }]
    console.log("File Ext",getFileExt);
return (
<div data-testid="FilePreviewer_Container" className="bg-blue-300">
<Drawer
      title="File Previewer"
      placement="right"
      open={openFilePreviewer}
      onClose={() => setOpenFilePreviewer(false)}
      width={600}
    >
        <div className="w-full p-4 h-full flex flex-col justify-start items-center gap-8">
            <span className="text-blue-500 font-medium text-lg">{fileName}</span>
   { getFileExt === "mp4" || getFileExt === "mov" ? <div className="w-full h-[10rem]">
 <ReactPlayer controls url={filePath}/>
 </div>
:
<div className="w-full h-full justify-center items-center">
 <DocViewer
pluginRenderers={DocViewerRenderers}
documents={docs}
style={{width: 500, height: 700}}
/>
</div>
}
</div>
    </Drawer>

</div>
)
}

export default FilePreviewer;


