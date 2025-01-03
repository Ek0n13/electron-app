import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

declare global {
  interface Window {
    electron: {
      readTextFile: (filePath: string) => Promise<string | null>;
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

export default App
