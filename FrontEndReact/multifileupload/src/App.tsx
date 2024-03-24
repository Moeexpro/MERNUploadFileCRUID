import React from "react";
import { Button } from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import FileContainer from "./FileUploaderandPreviewerContainer/FileContainer";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient} >
    <FileContainer />
    </QueryClientProvider>
  );
}

export default App;
