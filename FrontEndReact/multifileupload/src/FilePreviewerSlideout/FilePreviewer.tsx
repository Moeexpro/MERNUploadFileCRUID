import React from "react";
import ReactPlayer from "react-player";
import {Drawer} from 'antd';
// @ts-ignore
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

interface IProps {
    fileName : string;
    filePath : string;
    setOpenFilePreviewer : (e : boolean) => void;
    openFilePreviewer : boolean;
}

const FilePreviewer = ({fileName,filePath, setOpenFilePreviewer,openFilePreviewer} : IProps) => {
    const getFileExt = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
    const docs = [{
        uri: filePath,
        fileType: getFileExt
    }]
return (
<div data-testid="FilePreviewer_Container">
<Drawer
      title="File Previewer"
      placement="right"
      //className="w-[600px] h-screen bg-blue-300"
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
style={{width: 500, height: 700, overflowX: 'scroll'}}
/>
</div>
}
</div>
    </Drawer>

</div>
)
}

export default FilePreviewer;


