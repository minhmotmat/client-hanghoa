import React, { useState } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState({
    barcodes: null as File | null,
    output: null as File | null,
    dathang: null as File | null,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();

  //     const formData = new FormData();
  //     if (files.barcodes) formData.append("barcodes", files.barcodes);
  //     if (files.output) formData.append("output", files.output);
  //     if (files.dathang) formData.append("dathang", files.dathang);

  //     try {
  //       const response = await axios.post("/upload", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       console.log("Files processed:", response.data);
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         console.error("Error uploading files:", error.response?.data);
  //       } else {
  //         console.error("Error uploading files:", error);
  //       }
  //     }
  //   };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (files.barcodes) formData.append("barcodes", files.barcodes);
    if (files.output) formData.append("output", files.output);
    if (files.dathang) formData.append("dathang", files.dathang);

    try {
      // Update the URL to match your backend server (assuming it's running on localhost:5000)
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Files processed:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error uploading files:",
          error.response?.data || error.message
        );
      } else {
        console.error("Error uploading files:", error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <strong>Upload barcodes.txt:</strong>
          <input
            type="file"
            name="barcodes"
            accept=".txt"
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Upload output.csv:</strong>
          <input
            type="file"
            name="output"
            accept=".csv"
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Upload dathang.xlsx:</strong>
          <input
            type="file"
            name="dathang"
            accept=".xlsx"
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Upload Files</button>
    </form>
  );
};

export default FileUpload;
