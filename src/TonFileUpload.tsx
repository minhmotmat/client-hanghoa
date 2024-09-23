// FileUpload.tsx
import React, { useState } from 'react';

const TonFileUpload = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            alert("Please upload a file");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-tonkho`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('File processed successfully:', jsonResponse);
                alert("File processed and saved as JSON successfully");
            } else {
                alert("Failed to process the file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
                <button type="submit">Upload File</button>
            </form>
        </div>
    );
};

export default TonFileUpload;
