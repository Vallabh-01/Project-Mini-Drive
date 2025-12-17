import { useEffect, useMemo, useRef, useState } from "react";

const seed = [
  { id:"f1", name:"IMG_100000.png", kind:"PNG file", type:"image/png", size:5_000_000, uploaded:"Aug 2, 2025", status:"Private", path:"/Pictures", owners:["Ava"], url:"/mock/IMG_100000.png" },
  { id:"f2", name:"Startup pitch.avi", kind:"AVI file", type:"video/avi", size:105_000_000, uploaded:"Aug 1, 2025", status:"Shared", path:"/Videos", owners:["Sam","Lee"], url:"/mock/startup.avi" },
  { id:"f3", name:"Freestyle beat.mp3", kind:"MP3 file", type:"audio/mpeg", size:21_000_000, uploaded:"Jul 21, 2025", status:"Shared", path:"/Audio", owners:["Ava"], url:"/mock/beat.mp3" },
  { id:"f4", name:"Work proposal.docx", kind:"DOCx file", type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document", size:500_000, uploaded:"Jul 12, 2025", status:"Private", path:"/Work", owners:["Alex"], url:"/mock/proposal.docx" }
];

export function formatBytes(n){
  if (n == null) return "—";
  const u = ["B","KB","MB","GB","TB"]; let i=0; let v=n;
  while (v >= 1024 && i < u.length-1){ v/=1024; i++; }
  return `${v.toFixed(v<10 && i>0 ? 1 : 0)} ${u[i]}`;
}

export function useFiles(){
  const [files,setFiles] = useState(seed);
  const [query,setQuery] = useState("");
  const [selected,setSelected] = useState(null); // file id
  const [toast,setToast] = useState(null);       // {message, actionLabel?, onAction?}
  const timers = useRef([]);

  useEffect(()=>()=>{ timers.current.forEach(clearTimeout); },[]);

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return files;
    return files.filter(f =>
      [f.name,f.kind,f.type,f.path,f.status].some(x => (x||"").toLowerCase().includes(q))
    );
  },[files,query]);

  const get = id => files.find(f=>f.id===id);

  const remove = id => {
    const prev = files;
    setFiles(prev.filter(f=>f.id!==id));
    setToast({
      message:"File moved to trash",
      actionLabel:"Undo",
      onAction:()=> setFiles(prev)
    });
  };

  const share = async (id) => {
    const link = `${location.origin}/share/${id}`;
    try { await navigator.clipboard.writeText(link); 
      setToast({message:"Link copied to clipboard"});
    } catch { setToast({message:link}); }
    return link;
  };

  const download = async (id) => {
    const f = get(id);
    const a = document.createElement("a");
    a.href = f.blobUrl || f.url || "#";
    a.download = f.name;
    document.body.appendChild(a);
    a.click(); a.remove();
  };

  return {
    files, setFiles,
    filtered,
    query, setQuery,
    selected,
    showDetails:setSelected,
    hideDetails:()=>setSelected(null),
    get,
    actions:{ remove, share, download },
    toast, setToast
  };
}
