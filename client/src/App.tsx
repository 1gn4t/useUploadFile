import { useState } from "react";
import "./App.css";

const hostUrl = "http://localhost:5000/upload";

type responseData = {
  fileName: string;
  filePath: string;
};

// транспорт
const uploadFileTransport = async (body: FormData) => {
  const res = await fetch(hostUrl, {
    method: "POST",
    body,
  });

  const responseData: responseData = await res.json();

  return responseData;
};

// хук для загрузки
const useUploadFile = (transport: (body: FormData) => Promise<responseData>) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<responseData | null>(null);

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // проверяем наличие файла
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      setFile(file); // кладем в стейт файл

      const data = new FormData();
      data.append("file", file); // создаем специальный объект для передачи файла

      const response = await transport(data); // транспорт

      setUploaded(response); // кладем в стейт данные о загруженном файле
    }
  };

  return { upload, file, uploaded };
};

function App() {
  const { upload, file, uploaded } = useUploadFile(uploadFileTransport);

  return (
    <>
      <input type="file" onChange={upload} multiple />

      {file && <p>{file.name}</p>}
      {uploaded && <p>{uploaded.filePath}</p>}
      <img src={uploaded?.filePath} width={200}></img>
    </>
  );
}

export default App;
