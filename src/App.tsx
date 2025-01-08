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
      showContextMenu: (x: number, y: number) => void;
    }
  }
}

function App() {
  return (
    <div id='main-container' className='p-4 grid grid-cols-4 gap-2 leading-10 h-screen'>
      {/* <div className='p-4 w-full bg-gray-400 col-span-1'>
        <span>item 1</span>
      </div>
      <div className='p-4 w-full bg-gray-400 col-span-2'>
        <span>item 2</span>
      </div> */}
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
    <div
      id='read-text-file'
      className='p-4 w-full bg-gray-400 col-span-1 rounded-md'
    >
      <input
        type='text'
        placeholder='Enter file path'
        className='w-full px-2 rounded-md'
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      />
      <button
        className='flex justify-self-stretch'
        onClick={handleFileRead}
      >Read File</button>
      <pre className={fileContent ? '' : 'hidden'}>{fileContent}</pre>
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

  const handleOpenFile = (event: React.MouseEvent<HTMLInputElement>, fileName: string) => {
    event.preventDefault();
    
    window.electron.openFile(fileName, directory!);
  }
  
  const handleYTSearch = (event: React.MouseEvent<HTMLInputElement>, fileString: string) => {
    event.preventDefault();
    
    window.electron.fileYTSearch(fileString);
  }

  // const test = (event: React.MouseEvent<HTMLAnchorElement>) => {
  //   event.preventDefault();

  //   window.electron.showContextMenu(event.clientX, event.clientY);
  // }

  return (
    <div id='pdfs-list' className='p-4 w-full bg-gray-400 col-span-3 rounded-md'>
      <div
        id='buttons'
        className='flex justify-center'
      >
        <button onClick={handleDirectoryDialog}>Choose directory</button>
        <button onClick={handleDirectoryRead}>Read directory</button>
      </div>
      <pre
        className={'text-center' + (directory ? '' : ' hidden')}
      >{directory}</pre>
      <ul
        className={'divide-y' + (pdfList.length === 0 ? ' hidden' : '')}
      >File List:
        {pdfList.map((value, index) => (
          <li className='mx-4 px-2 flex justify-between items-center' key={'open-' + index}>
            <span>{value}</span>
            <div className='my-1 flex'>
              <input
                type='button'
                value={'Open File'}
                className='mx-4'
                onClick={(event) => handleOpenFile(event, value)}
              />
              <input
                type='button'
                value={'Search YT'}
                className=''
                onClick={(event) => handleYTSearch(event, value)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
