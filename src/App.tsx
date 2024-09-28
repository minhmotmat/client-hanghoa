import React from "react";
import FileUpload from "./FileUpload";
import TonFileUpload from "./TonFileUpload";
import DatHang from "./DatHang"; // Import the new component

const App: React.FC = () => {
  return (
    <>
      <div>
        <h1>Xử lý hàng về</h1>
        <FileUpload />
      </div>
      <div>
        <h1>Upload Tồn Kho</h1>
        <TonFileUpload />
      </div>
      <div>
        <DatHang /> {/* Include the new component for uploading BTCH and BCTK */}
      </div>
    </>
  );
};

export default App;
