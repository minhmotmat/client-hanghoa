import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

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

  const downloadFile = (workbook: XLSX.WorkBook, fileName: string) => {
    // Write workbook to binary string
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Create a Blob from the binary string
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a link and trigger the download
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

    try {
      const response = await axios.post(
        "https://server-hanghoa.onrender.com:10000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
