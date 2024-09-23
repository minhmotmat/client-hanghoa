import React from "react";
import FileUpload from "./FileUpload";
import TonFileUpload from "./TonFileUpload";

const App: React.FC = () => {
  return (
    <>
      <div>
        <h1>Xử lý hàng về</h1>
        <FileUpload />
      </div>
      <div>
        <h1>Upload Tồn Kho</h1>
        <TonFileUpload/>
      </div>
    </>
  );
};

export default App;
