import { useEffect, useState } from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import { useCallback } from "react";
import './TextEditor.css'
import {io} from 'socket.io-client'
import {useParams, useNavigate} from 'react-router-dom'
import documentLogo from '../../Assets/document-logo.png'
import axios  from 'axios'
// Messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check"}],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: '-1' }, { indent: '+1' }], 
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

const TextEditor = () => {
    const {id : docId} = useParams()
    const {name: docName} = useParams()
    const {userId} = useParams()
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

    const navigate = useNavigate();

    const diffToast = (mssg) => {
        toast.success(mssg);
    }

    useEffect(()=>{
        const s = io("http://localhost:3001");
        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, []);

    useEffect(()=>{
        if(socket == null || quill == null) return
        const interval = setInterval(()=>{
            socket.emit('save-document', quill.getContents())
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval)
        }
    },[socket, quill])

    useEffect(()=> {
        if(socket == null || quill == null) return
        
        const handler =  (delta) => {
            quill.updateContents(delta)
        }

        socket.on("recieve-changes", handler)

        return() => {
            socket.off('recieve-changes', handler)
        }
    }, [socket, quill])

    useEffect(()=>{
        if(socket == null || quill == null) return

        socket.once('load-document', document=>{
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document', docId, docName, userId)
    }, [socket, quill, docId])

    useEffect(()=> {
        if(socket == null || quill == null) return
        
        const handler =  (delta, oldDelta, source) => {
            if(source !== 'user') return
            socket.emit("send-changes", delta)
        }

        quill.on("text-change", handler)

        return() => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])

    const wrapperRef = useCallback((wrapper)=>{
        if(wrapper == null) return
        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS}})
        q.enable(false)
        q.setText('Loading...')
        setQuill(q);
        return () => {
            wrapperRef.innerHTML = ""
            Quill.destory();
        }
    }, [])

    function handleDelete(docId) {
        async function deleteDocument() {
            if (!docId) {
                console.log("Document ID is null or undefined");
                return;
            }
            try {
                const response = await axios.delete(`http://localhost:8080/documents/${docId}`);
                if (response.status === 200) {
                    diffToast('Event Deleted successfully');
                    navigate('/documents');
                } else {
                    console.log(`Unexpected response status: ${response.status}`);
                }
            } catch (err) {
                console.log(`Error while sending delete request: ${err.message}`);
            }
        }
        deleteDocument();
    }
    



    return(
        <>
        <div className='textEditor_component'>
            <div className='doc-header'>
                <div className='doc_header_image'>
                    <img src={documentLogo} alt='altImage'></img>
                    <p className='docName'>{docName}</p>
                </div>
                <div className='doc_header_options'>
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Insert</span>
                    <span>Format</span>
                    <span>Tools</span>
                    <span>Extention</span>
                    <span>Help</span>
                </div>
                <button className='doc_delete' onClick={() => handleDelete(docId)}><i class="fa-solid fa-trash" style={{marginRight:'0.6rem'}}></i>Delete</button>
                <button className='doc_save'><i class="fa-solid fa-cloud-arrow-up" style={{marginRight:'0.6rem'}}></i>Save</button>
                <button className='doc_share'><i class="fa-solid fa-share-nodes" style={{marginRight:'0.6rem'}}></i>Share</button>
            </div>
            <div className='doc_container' ref ={wrapperRef}></div>
        </div>
        <ToastContainer position='top-center'/>
        </>
    )
}

export default TextEditor;
