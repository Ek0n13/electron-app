import { useState } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';

declare global {
  interface Window {
    electron: {
      joinPaths: (...paths: string[]) => Promise<string | null>;

      readTextFile: (filePath: string) => Promise<string | null>;
      readDirectory: (directory: string) => Promise<string[]>;
      directoryDialog: () => Promise<string | null>;
      getChildDirectories: (directory: string) => Promise<string[]>;

      openFile: (filePath: string, directory: string) => void;
      fileYTSearch: (fileString: string) => void;
      showContextMenu: (x: number, y: number) => void;
    }
  }

  type DirList = {
    className: string,
    setActiveDirectory: React.Dispatch<React.SetStateAction<string | null>>,
    setPdfsList: React.Dispatch<React.SetStateAction<string[]>>,
  }

  type PdfList = {
    className: string,
    activeDirectory: string | null,
    pdfList: string[],
  }
}


function App() {
  const [activeDirectory, setActiveDirectory] = useState<string | null>('');
  const [pdfsList, setPdfsList] = useState<string[]>([]);

  return (
    <div id='main-container' className='p-4 grid grid-cols-6 gap-2 leading-10 h-screen'>
      {/* <ReadTextFile className='p-4 w-full bg-gray-400 col-span-1 rounded-md' /> */}
      <DirectoriesList className='p-4 w-full bg-gray-400 col-span-2 rounded-md' setActiveDirectory={setActiveDirectory} setPdfsList={setPdfsList} />
      <PdfsList className='p-4 w-full bg-gray-400 col-span-4 rounded-md' activeDirectory={activeDirectory} pdfList={pdfsList}/>
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

// function ReadTextFile({ className } : { className : string }) {
//   const [filePath, setFilePath] = useState("");
//   const [fileContent, setFileContent] = useState<string | null>(null);

//   const handleFileRead = async () => {
//     const content = await window.electron.readTextFile(filePath!);
//     setFileContent(content);
//   };

//   return (
//     <div id='read-text-file' className={className}>
//       <input
//         type='text'
//         placeholder='Enter file path'
//         className='w-full px-2 rounded-md'
//         value={filePath}
//         onChange={(e) => setFilePath(e.target.value)}
//       />
//       <button
//         className='flex justify-self-stretch'
//         onClick={handleFileRead}
//       >Read File</button>
//       <pre className={fileContent ? '' : 'hidden'}>{fileContent}</pre>
//     </div>
//   )
// }

function DirectoriesList(props: DirList) {
  const [parentDirectory, setParentDirectory] = useState<string | null>('');
  const [childrenDirectories, setChildrenDirectories] = useState<string[]>([]);
  const [parentFolder, setParentFolder] = useState<string | undefined>('');

  const handleDirectoryDialog = async () => {
    const dir = await window.electron.directoryDialog();

    if (!dir) {
      props.setPdfsList([]);
      props.setActiveDirectory(null);

      setChildrenDirectories([]);
      setParentDirectory(null);
      setParentFolder('');

      return;
    };

    setParentDirectory(dir);
    setParentFolder(dir?.split('\\').splice(-1)[0]);
  }

  const handleGetChildDirectories = async () => {
    const children = await window.electron.getChildDirectories(parentDirectory!);

    if (!children) return;

    setChildrenDirectories(children);
  }

  const handleDirectoryRead = async(event: React.MouseEvent<HTMLAnchorElement>, folder: string) => {
    event.preventDefault();
    
    const activeDir = await window.electron.joinPaths(parentDirectory!, folder);
    props.setActiveDirectory(activeDir)
    
    const fileList = await window.electron.readDirectory(activeDir!);
    props.setPdfsList(fileList);
    
  }

  return (
    <div id='directories-list' className={props.className}>
      <div
        id='buttons'
        className='flex justify-center'
      >
        <button
          onClick={handleDirectoryDialog}
        >
          Choose Folder
        </button>
        <button
          onClick={handleGetChildDirectories}
        >
          Get Children
        </button>
      </div>
      <pre
        className={'text-center' + (parentDirectory ? '' : ' hidden')}
      >
        {'Parent Folder: ' + parentFolder}
      </pre>
      <ul
        className={'divide-y text-black' + (parentDirectory ? '' : ' hidden')}
      >Folders:
        {childrenDirectories.map((value, index) => (
          <li
            key={index}
            className='mx-4'
          >
            <a
              href='#'
              onClick={(event) => handleDirectoryRead(event, value)}
            >
              {value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PdfsList(props: PdfList) {
  const handleOpenFile = (event: React.MouseEvent<HTMLInputElement>, fileName: string) => {
    event.preventDefault();
    
    window.electron.openFile(fileName, props.activeDirectory!);
  }
  
  const handleYTSearch = (event: React.MouseEvent<HTMLInputElement>, fileString: string) => {
    event.preventDefault();
    
    window.electron.fileYTSearch(fileString);
  }

  return (
    <div id='pdfs-list' className={props.className}>
      <pre
        className={'text-center' + (props.activeDirectory ? '' : ' hidden')}
      >{props.activeDirectory}</pre>
      <ul
        className={'divide-y text-black' + (props.pdfList.length === 0 ? ' hidden' : '')}
      >File List:
        {props.pdfList.map((value, index) => (
          <li
            key={'open-' + index}
            className='mx-4 px-2 flex justify-between items-center text-black'
          >
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
