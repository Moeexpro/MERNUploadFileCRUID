import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  CloudUploadOutlined,
  Delete,
  Preview,
  Download,
  AccountCircle,
} from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteFileAPI,
  getFilesAPI,
  uploadFilesAPI,
} from "../APIReducer/APIReducer";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import FilePreviewer from "../FilePreviewerSlideout/FilePreviewer";
import SearchIcon from "@mui/icons-material/Search";

interface IFileObj {
  _id: string;
  file: string;
  fileName: string;
  file64: string;
  message: string;
}

interface ITableObj {
  id: string;
  fileName: string;
  fileURL: string;
  filePath64: string;
}

const FileContainer = () => {
  const queryclient = useQueryClient();
  const [filePath, setFilePath] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [fileNamePreviewer, setFileNamePreviewer] = useState<string>();
  const [filePathPreviewer, setFilePathPreviewer] = useState<string>();
  const [openFilePreviewer, setOpenFilePreviewer] = useState<boolean>(false);
  const [deletingFile, setDeletingFile] = useState<boolean>(false);
  const [downloadingFile, setDownloadingFile] = useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [apiMessage, setAPIMessage] = useState<string>();
  const [tableData, setTableData] = useState<ITableObj[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchTableData, setSearchTableData] = useState<ITableObj[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(true);
  const handleFileUpload = (e: any) => {
    const fileObj = e.target.files[0];
    setUploadingFiles(false);
    setFileName(fileObj.name);
    const reader = new FileReader();
    reader.readAsDataURL(fileObj);
    reader.onload = (event: any) => {
      setFilePath(event.target.result.split(",")[1]);
    };
    reader.onerror = (error) => {
      console.log("Error", error);
    };
  };
  const handleDeleteFile = async (cellvalues: any) => {
    setDeletingFile(true);
    await deleteFile(cellvalues.id);
    setDeletingFile(false);
  };
  const timeout = async (value: number) => {
    return new Promise((res) => setTimeout(res, value));
  };
  const handlePreviewFile = async (cellvalues: any) => {
    setFilePathPreviewer("");
    setFileNamePreviewer(cellvalues?.row?.fileName);
    setFilePathPreviewer(cellvalues?.row?.fileURL);
    await timeout(500);
    setOpenFilePreviewer(true);
  };
  const handleFileTypeBase64 = (fileName: string) => {
    const checkEXT = fileName?.substring(
      fileName?.lastIndexOf(".") + 1,
      fileName?.length
    );
    switch (checkEXT) {
      case "pdf":
        return "application/pdf";
      case "doc":
        return "application/msword";
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "mp4":
        return "video/mp4";
      default:
        return "application/octet-stream";
    }
  };
  const handleDownloadFile = async (cellvalues: any) => {
    setDownloadingFile(true);
    const downloadLink = document.createElement("a");
    downloadLink.href = `data:${handleFileTypeBase64(
      cellvalues.row.fileName
    )};base64,${cellvalues.row.filePath64}`;
    downloadLink.download = cellvalues.row.fileName;
    downloadLink.click();
    setDownloadingFile(false);
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 170 },
    { field: "fileName", headerName: "FileName", width: 290 },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (cellvalues) => {
        return (
          <IconButton
            aria-label="delete"
            disabled={
              deletingFile === true &&
              filesData?.some(
                (file: IFileObj) => file._id === cellvalues.id
              ) === true
            }
            onClick={() => handleDeleteFile(cellvalues)}
          >
            <Delete className="text-red-500" />
          </IconButton>
        );
      },
    },
    {
      field: "preview",
      headerName: "Preview",
      width: 150,
      renderCell: (cellvalues) => {
        return (
          <IconButton
            aria-label="preview"
            onClick={() => handlePreviewFile(cellvalues)}
          >
            <Preview className="text-blue-300" />
          </IconButton>
        );
      },
    },
    {
      field: "download",
      headerName: "Download",
      width: 150,
      renderCell: (cellvalues) => {
        return (
          <IconButton
            aria-label="download"
            disabled={
              downloadingFile === true &&
              filesData?.some(
                (file: IFileObj) => file._id === cellvalues.id
              ) === true
            }
            onClick={() => handleDownloadFile(cellvalues)}
          >
            <Download className="text-blue-500" />
          </IconButton>
        );
      },
    },
  ];

  const handleFileUploadSubmission = async () => {
    setUploadingFiles(true);
    const APIPayload = {
      filebase64: filePath,
      fileName: fileName,
    };
    await uploadFiles(APIPayload);
    setUploadingFiles(false);
  };
  const {
    data: filesData,
    isLoading: filesGetLoader,
    isFetching: filesGetLoad,
  } = useQuery({
    queryFn: async () => {
      const res = await getFilesAPI();
      return res;
    },
    queryKey: ["FilesUpdate"],
    refetchOnWindowFocus: false,
    retry: false,
  });
  const { mutateAsync: uploadFiles } = useMutation({
    mutationFn: uploadFilesAPI,
    onMutate: () => {
      setToastOpen(false);
    },
    onSuccess: async (response) => {
      setAPIMessage(response);
      setToastOpen(true);
      await queryclient.invalidateQueries({ queryKey: ["FilesUpdate"] });
    },
    onError: (response: any) => {
      setAPIMessage(response);
      setToastOpen(true);
    },
  });
  const { mutateAsync: deleteFile } = useMutation({
    mutationFn: deleteFileAPI,
    onMutate: () => {
      setToastOpen(false);
    },
    onSuccess: async (response) => {
      setAPIMessage(response);
      setToastOpen(true);
      await queryclient.invalidateQueries({ queryKey: ["FilesUpdate"] });
    },
    onError: (error: any) => {
      console.log("er", error);
      setAPIMessage(error);
      setToastOpen(true);
    },
  });

  const getTableData = () => {
    if (filesData && filesData?.length > 0 && filesData !== undefined) {
      const finalFilesData = filesData.map((file: IFileObj) => {
        return {
          id: file._id,
          fileName: file.fileName,
          fileURL: file.file,
          filePath64: file.file64,
        };
      });
      setTableData(finalFilesData);
      setSearchTableData(finalFilesData);
    } else {
      setTableData([]);
      setSearchTableData([]);
    }
  };
  const handleSearchFileFunc = (searchVal: string) => {
    const val = searchVal?.toLowerCase();
    setSearchValue(searchVal);
    if (val?.length > 0) {
      const filteredSearch = tableData?.filter((file: ITableObj) =>
        file?.fileName?.toLowerCase()?.includes(val)
      );
      setSearchTableData(filteredSearch);
    } else {
      setSearchTableData(tableData);
    }
  };
  useEffect(() => {
    getTableData();
  }, [filesData]);
  if (filesGetLoader || filesGetLoad)
    return (
      <div
        data-testid="FilesLoader_Container"
        className="w-screen h-screen flex justify-center items-center"
      >
        <CircularProgress />
      </div>
    );
  return (
    <div
      data-testid="FilesMain_Container"
      className="min-w-[1440px] h-screen md:w-screen md:h-screen"
    >
      <div
        data-testid="FilesProject_Container"
        className="w-full h-full p-4 flex flex-col gap-8"
      >
        <span className="text-sm w-full flex flex-row justify-center text-pretty sm:text-lg text-blue-600 font-semibold font-serif">
          MERN Multi File Upload CRUID
        </span>
        <div
          data-testid="UploadFiles_Container"
          className="flex flex-row p-8 justify-between rounded-md bg-slate-500 w-full"
        >
          <input type="file" onChange={(e) => handleFileUpload(e)}></input>
          <Button
            component="label"
            role={undefined}
            onClick={async () => await handleFileUploadSubmission()}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadOutlined />}
            className="text-xs sm:text-sm"
            disabled={uploadingFiles}
          >
            Upload file
          </Button>
        </div>
        <div
          data-testId="SearchBar_Container"
          className="w-fit hover:bg-teal-100"
        >
          <TextField
            id="input-with-icon-textfield"
            placeholder="Search FileName"
            onChange={(e: {
              target: {
                value: string;
              };
            }) => {
              handleSearchFileFunc(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </div>
        {searchTableData?.length > 0 && (
          <div data-testid="FilesTable_Container" className="flex w-full overflow-x-scroll">
            <DataGrid rows={searchTableData} columns={columns} />
          </div>
        )}
        <div data-testid="FilesPreviewer">
          {fileNamePreviewer && filePathPreviewer && (
            <FilePreviewer
              fileName={fileNamePreviewer}
              filePath={filePathPreviewer}
              setOpenFilePreviewer={setOpenFilePreviewer}
              openFilePreviewer={openFilePreviewer}
            />
          )}
        </div>
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          message={apiMessage}
        />
      </div>
    </div>
  );
};

export default FileContainer;
