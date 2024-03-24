MERN Upload File CRUID Project is developed with React, Typescript, React Query, Tailwind Css, MUI, Express, Node and MongoDB.

User can perform following operations: 

1: User can upload a file.
2: User can then perform Cruid operations on uploaded file through MUI table such as preview file, delete, and download.
3: File is previewed in a drawer slideout which opens from right after clicking on preview icon of file in table.
4: User can also preview, delete and download video files.


- Note: BE and FE are not yet deployed, BE Node will run on localhost:3200, while FE will run on localhost:3000
- Ignore warning of File Previewer library when FE is loaded just click on X icon.

  Important: To run Project, follow these steps:

  1: First run BE Node server, to make sure BE API's in express work, Open new terminal in VS Code after cloning project and run following command after this PS F:\Mern Stack Projects\MultiFileUplaodReact+Node+MongoDB\MultiFileUploadMERN> npm install --legacy-peer-deps
  
  2: This will install your BE node modules, now run command cd backendexpressnode
  
  3: Now replace line 13 in App.js file in backendexpressnode folder and add your own connection string after mongoose.connect.
  
  4: Now run command node .\App.js to make API run on localhost:3200, you will see this after running this command ![image](https://github.com/Moeexpro/MERNUploadFileCRUID/assets/45965772/f4e1d89f-5fed-4cdf-acf1-253076d1e447)

  
  5: To run FE, open new terminal and enter command cd FrontEndReact and click enter
  
  6: Now enter command cd multifileupload and click enter
  
  7: run command npm install --legacy-peer-deps
  
  8: Lastly, run commnand npm start, to make your FE run on localhost:3000, make sure your BE API's are giving 200 status code, check network tab for it.
  


  Thanks & Happy Coding!.
