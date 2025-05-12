import Editor from '@monaco-editor/react';
import { useState } from 'react';
function Tarefa() {
    const [code, setCode] = useState("");
    function handleSubmit(){
        console.log("Submetendo código:",code)
    }
    return (
        <>
            <Editor
                width="60vw"
                height="50vh"
                language="typescript"
                defaultValue="let x:string = '10';"
                onChange={(value)=>{setCode(value!)}}
            />;
            <button onClick={handleSubmit}>Enviar Solução</button>
        </>
        
        )
}

export default Tarefa;