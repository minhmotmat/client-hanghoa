import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX library

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (files.barcodes) formData.append("barcodes", files.barcodes);
    if (files.output) formData.append("output", files.output);
    if (files.dathang) formData.append("dathang", files.dathang);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Create XLSX file from the allResults JSON
      const allWorkbook = XLSX.utils.book_new();
      const allWorksheet = XLSX.utils.json_to_sheet(response.data.allResults);
      XLSX.utils.book_append_sheet(allWorkbook, allWorksheet, "All Results");
      XLSX.writeFile(allWorkbook, "all_results.xlsx");

      // Create XLSX file from the groupedResults JSON
      console.log(response.data.groupedResults)
      const groupedWorkbook = XLSX.utils.book_new();
      const groupedWorksheet = XLSX.utils.json_to_sheet(response.data.groupedResults);
      XLSX.utils.book_append_sheet(groupedWorkbook, groupedWorksheet, "Grouped Results");
      XLSX.writeFile(groupedWorkbook, "grouped_results.xlsx");

      console.log("Files processed successfully.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error uploading files:", error.response?.data);
      } else {
        console.error("Error uploading files:", error);
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
