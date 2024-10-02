
import React, { useState } from 'react';
import axios from 'axios';

const X = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post(`${import.meta.env.VITE_APP_URL}transcribe`, formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      },
    })
    .then((response) => {
      setUploadSuccess(true);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <div>
      <input type="file" accept="audio/*,image/*  " onChange={handleFileChange} />
      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          <button onClick={handleUpload}>Upload File</button>
          {uploadProgress > 0 && (
            <p>Uploading... {uploadProgress}%</p>
          )}
          {uploadSuccess && (
            <p>File uploaded successfully!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default X;

