import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState({
    barcodes: null as File | null,
    output: null as File | null,
    dathang: null as File | null,
  });
  const isProduction = import.meta.env.MODE === "production";
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const downloadFile = (workbook: XLSX.WorkBook, fileName: string) => {
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (files.barcodes) formData.append("barcodes", files.barcodes);
    if (files.output) formData.append("output", files.output);
    if (files.dathang) formData.append("dathang", files.dathang);
    const api = isProduction
      ? `/api/upload`
      : `${import.meta.env.VITE_API_URL}/upload`;
    try {
      const response = await axios.post(api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { allResults, groupedResults } = response.data;

      if (Array.isArray(allResults) && typeof groupedResults === "object") {
        const allWorksheet = XLSX.utils.json_to_sheet(allResults);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, allWorksheet, "All Results");

        Object.keys(groupedResults).forEach((groupKey) => {
          const groupData = groupedResults[groupKey];
          const groupWorksheet = XLSX.utils.json_to_sheet(groupData);
          XLSX.utils.book_append_sheet(workbook, groupWorksheet, groupKey);
        });

        downloadFile(workbook, "results.xlsx");

        console.log("Files processed successfully.");
      } else {
        console.error("Invalid data format received from the server.");
      }
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
