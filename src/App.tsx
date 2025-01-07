import { useState } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';

declare global {
  interface Window {
    electron: {
      readTextFile: (filePath: string) => Promise<string | null>;
      readDirectory: (directory: string) => Promise<string[]>;
      directoryDialog: () => Promise<string | null>;

      openFile: (filePath: string, directory: string) => void;
      fileYTSearch: (fileString: string) => void;
    }
  }
}

function App() {
  return (
    <div className='main-container'>
      <ReadTextFile />
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

function ReadTextFile() {
  const [filePath, setFilePath] = useState("");
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileRead = async () => {
    if (!filePath) return;

    const content = await window.electron.readTextFile(filePath);
    setFileContent(content);
  };

  return (
    <div className='read-text-file'>
      <h1>Electron + React</h1>
      <input
        type='text'
        placeholder='Enter file path'
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      />
      <button onClick={handleFileRead}>Read File</button>
      <pre className={fileContent ? '' : 'dnone'}>{fileContent}</pre>
    </div>
  )
}

function PdfsList() {
  const [pdfList, setPdfList] = useState<string[]>([]);
  const [directory, setDirectory] = useState<string | null>("");

  const handleDirectoryDialog = async () => {
    const dir = await window.electron.directoryDialog();

    if (!dir) setPdfList([]);

    setDirectory(dir);
  }

  const handleDirectoryRead = async () => {
    if (!directory) return;

    const fileList = await window.electron.readDirectory(directory);
    setPdfList(fileList);
  }

  const handleOnClick = (event: React.MouseEvent<HTMLAnchorElement>, fileName: string) => {
    event.preventDefault();
    
    window.electron.openFile(fileName, directory!);
  }
  
  const handleYTSearch = (event: React.MouseEvent<HTMLAnchorElement>, fileString: string) => {
    event.preventDefault();
    
    window.electron.fileYTSearch(fileString);
  }

  return (
    <div className='pdfs-list'>
      <button onClick={handleDirectoryDialog}>Choose directory</button>
      <button onClick={handleDirectoryRead}>Read directory</button><br />
      <pre className={directory ? '' : 'dnone'}>{directory}</pre>
      <figure className={'list-container' + (pdfList.length === 0 ? ' dnone' : '')}>
        <figcaption>Open PDF</figcaption>
        <ul>
          {pdfList.map((value, index) => (
            <li key={index}>
              <a href='#' onClick={(event) => handleOnClick(event, value)}>{value}</a>
            </li>
          ))}
        </ul>
        <figcaption>Search on YouTube</figcaption>
        <ul>
        {pdfList.map((value, index) => (
          <li key={"search-" + index}>
            <a href='#' onClick={(event) => handleYTSearch(event, value)}>{value.replace('.pdf', '')}</a>
          </li>
        ))}
      </ul>
      </figure>
    </div>
  );
}

export default App;
