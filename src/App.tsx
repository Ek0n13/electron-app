import { useState } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';

declare global {
  interface Window {
    electron: {
      readTextFile: (filePath: string) => Promise<string | null>;
      readDirectory: (directory: string) => Promise<string[]>;
      openFile: (filePath: string, directory: string) => void;
      directoryDialog: () => Promise<string>;
    }
  }
}

function App() {
  const [filePath, setFilePath] = useState("");
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileRead = async () => {
    if (!filePath) return;

    const content = await window.electron.readTextFile(filePath);
    setFileContent(content);
  };

  return (
    <div className='main-container'>
      <h1>Electron + React</h1>
      <input
        type='text'
        placeholder='Enter file path'
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      />
      <button onClick={handleFileRead}>Read File</button>
      <pre>{fileContent}</pre>
      <PdfsList />
    </div>
  );

  // const [count, setCount] = useState(0)

  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

function PdfsList() {
  const [pdfList, setPdfList] = useState<string[]>([]);
  const [directory, setDirectory] = useState<string | null>("");

  const handleDirectoryDialog = async () => {
    const dir = await window.electron.directoryDialog();
    setDirectory(dir);
  }

  const handleDirectoryRead = async () => {
    if (!directory) return;

    const fileList = await window.electron.readDirectory(directory);
    setPdfList(fileList);
  }

  const handleOnClick = (event: React.MouseEvent<HTMLAnchorElement>, fileName: string) => {
    event.preventDefault();
    if (!directory) return;
    window.electron.openFile(fileName, directory);
  }

  return (
    <div>
      <button onClick={handleDirectoryDialog}>Choose directory</button>
      <span>{directory}</span><br></br>
      <button onClick={handleDirectoryRead}>Read directory</button>
      <ul>
        {pdfList.map((value, index) => (
          <li key={index}>
            <a href='#' onClick={(event) => handleOnClick(event, value)}>{value}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
