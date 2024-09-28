import React, { useState } from "react";
import axios from "axios";

const DatHang: React.FC = () => {
  const [btchFile, setBtchFile] = useState<File | null>(null);
  const [bctkFile, setBctkFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const isProduction = import.meta.env.MODE === 'production';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!btchFile || !bctkFile) {
      setError("Both files are required.");
      return;
    }

    const formData = new FormData();
    formData.append("btch", btchFile);
    formData.append("bctk", bctkFile);
    const dathangAPI = isProduction ? `/api/dathang` : `${import.meta.env.VITE_API_URL}/dathang`

    setLoading(true); // Start loading

    try {
      const response = await axios.post(dathangAPI, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: 'blob' // Important: Set response type to blob
      });

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'result.xlsx'); // Set the file name

      // Append to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      setError(null);
      // Reset file inputs
      setBtchFile(null);
      setBctkFile(null);
    } catch (err) {
      console.error(err);
      setError("An error occurred while uploading the files.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <h2>Upload BH and BCTK Files</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="btchFile">BH File</label>
          <input
            id="btchFile"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              setBtchFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <div>
          <label htmlFor="bctkFile">BCTK File</label>
          <input
            id="bctkFile"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              setBctkFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DatHang;
