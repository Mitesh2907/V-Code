import React, { useState, useEffect, useRef } from 'react';
import {
  Folder, File, FileText,
  Maximize2, Minimize2, Plus, FolderPlus, FilePlus,
  ChevronRight, X, Edit, Download,
  FolderOpen, FileCode, Video, MessageSquare,
  Trash2
} from 'lucide-react';

import VideoCallPanel from '../../components/video/VideoCallPanel';
import ChatPanel from '../../components/chat/ChatPanel';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { SkeletonEditor } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';
import api from "../../configs/api";
import Editor from "@monaco-editor/react";
import { useTheme } from "../../contexts/ThemeContext";

const EditorPage = () => {
  const { theme } = useTheme();
  const editorRef = useRef(null);
  const [dirtyFiles, setDirtyFiles] = useState({});
  const navigate = useNavigate();
  const { roomId } = useParams();
  const isRoomMode = !!roomId;
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [openFiles, setOpenFiles] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fileContents, setFileContents] = useState({});
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [showExplorer, setShowExplorer] = useState(true);
  const [code, setCode] = useState(`// Welcome to V-Code Collaborative Editor
// Create files and folders using the + buttons
// Your changes sync in real-time with your team

// Example: Simple React Component
function WelcomeMessage({ name }) {
  return \`Hello, \${name}! Start coding together.\`;
}

// Try editing this code
const result = WelcomeMessage("Developer");
console.log(result);`);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [fileSystem, setFileSystem] = useState(null);
  const [creatingItem, setCreatingItem] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState([]);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    target: null,
  });

  const ContextItem = ({ label, onClick, danger }) => (
    <div
      onClick={onClick}
      className={`px-3 py-1.5 cursor-pointer 
      hover:bg-[#334155]
      ${danger ? 'text-red-400' : 'text-gray-200'}`}
    >
      {label}
    </div>
  );


  const handleRightClick = (e, item = null) => {
    e.preventDefault();

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      target: item,
    });
  };

  const handleCreate = async (name) => {
    const siblings =
      creatingItem.parentId === null
        ? fileSystem.children
        : findItemById(fileSystem, creatingItem.parentId)?.children || [];

    if (siblings.some(i => i.name === name)) {
      toast.error("Already exists");
      return;
    }

    if (!name.trim()) {
      setCreatingItem(null);
      return;
    }
    if (creatingItem.type === "file") {
      await api.post("/editor/file", {
        roomId,
        name,
        folderId: creatingItem.parentId,
      });
    } else {
      await api.post("/editor/folder", {
        roomId,
        name,
        parentId: creatingItem.parentId,
      });
    }

    setCreatingItem(null);

    const { data } = await api.get(`/editor/room/${roomId}`);
    setFileSystem(data.tree);
  };


  const defineThemes = (monaco) => {
    monaco.editor.defineTheme("vcode-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0f172a", // dark slate
        "editorLineNumber.foreground": "#64748b",
        "editorCursor.foreground": "#38bdf8",
        "editor.lineHighlightBackground": "#020617",
      },
    });

    monaco.editor.defineTheme("vcode-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#ffffff",
        "editorLineNumber.foreground": "#64748b",
        "editorCursor.foreground": "#2563eb",
        "editor.lineHighlightBackground": "#f1f5f9",
      },
    });
  };



  const closeTab = (fileId, e) => {
    e.stopPropagation();

    if (dirtyFiles[fileId]) {
      const ok = confirm("Unsaved changes. Close anyway?");
      if (!ok) return;
    }

    setDirtyFiles(prev => {
      const copy = { ...prev };
      delete copy[fileId];
      return copy;
    });

    setFileContents(prev => {
      const copy = { ...prev };
      delete copy[fileId];
      return copy;
    });

    setOpenFiles(prev => {
      const remaining = prev.filter(f => f.id !== fileId);

      if (activeFile?.id === fileId) {
        if (remaining.length > 0) {
          setActiveFile(remaining[0]);
          const nextFile = remaining[0];

          setCode(
            fileContents[nextFile.id] !== undefined
              ? fileContents[nextFile.id]
              : nextFile.content
          );

        } else {
          setActiveFile(null);
          setCode('');
        }
      }

      return remaining;
    });
  };


  const hasUnsavedChanges = () => {
    return Object.values(dirtyFiles).some(Boolean);
  };


  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column,
      });
    });
  };

  useEffect(() => {
  if (!roomId) return;

  api.get(`/chat/unread/${roomId}`)
    .then(({ data }) => {
      setUnreadCount(data.unreadCount);
    });

}, [roomId, showChat]);



  const fetchUnread = async () => {
    if (!roomId) return;

    try {
      const { data } = await api.get(`/chat/unread/${roomId}`);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.log("Failed to fetch unread count");
    }
  };

  useEffect(() => {
    fetchUnread();
  }, [roomId]);



  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setShowExplorer(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  useEffect(() => {
    if (!fileSystem) return;

    const firstFile = findFirstFile(fileSystem);
    if (firstFile) {
      setActiveFile(firstFile);
      setCode(firstFile.content);
      setOpenFiles([firstFile]);
    }
  }, [fileSystem]);


  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!hasUnsavedChanges()) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirtyFiles]);



  useEffect(() => {
    if (!fileSystem) return;

    setExpandedFolders(prev =>
      prev.length === 0 ? [fileSystem.id] : prev
    );
  }, [fileSystem]);


  useEffect(() => {
    const close = () =>
      setContextMenu(prev => ({ ...prev, visible: false }));

    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);


  useEffect(() => {
  const loadEditor = async () => {
    try {
      const { data } = await api.get(`/editor/room/${roomId}`);
      setFileSystem(data.tree);
    } catch (error) {

      if (error.response?.status === 403) {
        toast.error(
          error.response?.data?.message || "Room is closed"
        );

        navigate("/rooms"); // redirect back
        return;
      }

      toast.error("Editor load failed");
    }
  };

  loadEditor();
}, [roomId, navigate]);



  useEffect(() => {
    if (!fileSystem || activeFile) return;

    const firstFile = findFirstFile(fileSystem);
    if (firstFile) {
      setActiveFile(firstFile);
      setCode(firstFile.content);
    }
  }, [fileSystem]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!activeFile) return;

        if (autoSave) {
          toast("Auto-save is ON", { icon: "ℹ️" });
          return;
        }

        saveToDB(code);
        toast.success("File saved");
      }
    };


    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFile, code, autoSave]);


  const saveToDB = async (content) => {
    if (!activeFile) return;

    await api.post("/editor/save", {
      roomId,
      fileId: activeFile.id,
      content
    });

    setActiveFile(prev => ({
      ...prev,
      content,
    }));

    setDirtyFiles(prev => ({
      ...prev,
      [activeFile.id]: false,
    }));
  };



  const saveTimeout = useRef(null);

  const handleChange = (value) => {
    if (!activeFile) return;

    setCode(value);

    setFileContents(prev => ({
      ...prev,
      [activeFile.id]: value,
    }));

    setDirtyFiles(prev => ({
      ...prev,
      [activeFile.id]: value !== activeFile.content,
    }));

    if (!autoSave) return;

    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveToDB(value);
    }, 500);
  };

  const getAllFileIdsInFolder = (folder) => {
    let ids = [];

    folder.children?.forEach(item => {
      if (item.type === "file") {
        ids.push(item.id);
      }
      if (item.type === "folder") {
        ids = ids.concat(getAllFileIdsInFolder(item));
      }
    });

    return ids;
  };


  const getLanguageFromExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby'
    };
    return languageMap[ext] || 'text';
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const isClosing = prev.includes(folderId);

      if (isClosing) {
        const folder = findItemById(fileSystem, folderId);
        if (folder) {
          const idsToClose = getAllFileIdsInFolder(folder);

          setOpenFiles(prev =>
            prev.filter(f => !idsToClose.includes(f.id))
          );

          // active file bhi close ho to reset
          if (activeFile && idsToClose.includes(activeFile.id)) {
            setActiveFile(null);
            setCode('');
          }
        }
      }

      return isClosing
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId];
    });
  };


  const deleteRecursive = (items, itemId) => {
    return items.filter(item => {
      if (item.id === itemId) return false;
      if (item.type === 'folder' && item.children) {
        item.children = deleteRecursive(item.children, itemId);
      }
      return true;
    });
  };


  const deleteItem = async (item) => {
    if (!confirm("Are you sure?")) return;

    try {
      await api.delete("/editor/item", {
        data: {
          itemId: item.id,
          type: item.type, // "file" | "folder"
        },
      });


      const { data } = await api.get(`/editor/room/${roomId}`);
      setFileSystem(data.tree);

      if (activeFile?.id === item.id) {
        setActiveFile(null);
        setCode("");
      }

      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };



  const findFirstFile = (folder) => {
    for (const item of folder.children) {
      if (item.type === 'file') return item;
      if (item.type === 'folder' && item.children) {
        const file = findFirstFile(item);
        if (file) return file;
      }
    }
    return null;
  };


  const renameItem = async (item) => {
    const newName = prompt("New name");
    if (!newName || newName === item.name) return;

    try {
      await api.patch("/editor/rename", {
        itemId: item.id,
        type: item.type,   // "file" | "folder"
        newName,
      });

      // 🔁 tree reload
      const { data } = await api.get(`/editor/room/${roomId}`);
      setFileSystem(data.tree);

      toast.success("Renamed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Rename failed");
    }
  };



  const findItemById = (folder, id) => {
    for (const item of folder.children) {
      if (item.id === id) return item;
      if (item.type === 'folder' && item.children) {
        const found = findItemById(item, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectFile = (file) => {
    setActiveFile(file);

    const savedCode =
      fileContents[file.id] !== undefined
        ? fileContents[file.id]
        : file.content;

    setCode(savedCode);

    setOpenFiles(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) return prev;
      return [...prev, file];
    });
  };


  const itemExists = (name, items) => {
    return items.some(item => item.name === name);
  };

  const downloadFile = () => {
    if (!activeFile) return;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${activeFile.name}`);
  };

  const shareRoom = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(link);
    toast.success('Room link copied!');
  };

  const renderFileTree = (folder, depth = 0) => {
    return folder.children.map(item => (
      <div key={item.id}>
        <div
          className={`group flex items-center px-2 py-1.5 rounded
          hover:bg-gray-700/50
          ${activeFile?.id === item.id ? 'bg-blue-900/30' : ''}`}
          style={{ paddingLeft: `${depth === 0 ? 0 : depth * 20 + 12}px` }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRightClick(e, item);
          }}

        >
          {/* FOLDER */}
          {/* ACTIONS */}
          {item.type === "folder" && (
            <>
              <ChevronRight
                className={`h-4 w-4 mr-1.5 transition-transform ${expandedFolders.includes(item.id) ? "rotate-90" : ""
                  }`}
                onClick={() => toggleFolder(item.id)}
              />

              <Folder className="h-4 w-4 mr-1.5 text-blue-400" />

              <span
                className="flex-1 text-sm truncate cursor-pointer"
                onClick={() => toggleFolder(item.id)}
              >
                {item.name}
              </span>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    renameItem(item);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </>
          )}




          {/* FILE */}
          {item.type === "file" && (
            <>
              <div className="w-5 mr-1.5" />
              <File className="h-4 w-4 mr-1.5 text-gray-300" />
              <span
                className="flex-1 text-sm truncate cursor-pointer"
                onClick={() => selectFile(item)}
              >
                {item.name}
              </span>
            </>
          )}

        </div>

        {/* CHILDREN */}
        {item.type === "folder" &&
          expandedFolders.includes(item.id) &&
          item.children &&
          renderFileTree(item, depth + 1)}

        {/* INLINE CREATE INPUT */}
        {creatingItem && creatingItem.parentId === item.id && (
          <div
            className="ml-6 my-1"
            style={{ paddingLeft: `${(depth + 1) * 20}px` }}
          >
            <input
              autoFocus
              className="w-full bg-gray-800 text-sm px-2 py-1 rounded outline-none border border-blue-500"
              placeholder={
                creatingItem.type === "file" ? "New File" : "New Folder"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate(e.target.value);
                if (e.key === "Escape") setCreatingItem(null);
              }}
              onBlur={() => setCreatingItem(null)}
            />
          </div>
        )}
      </div>
    ));
  };


  if (loading || !fileSystem) {
    return <SkeletonEditor />;
  }

  return (
    <div
  className={`flex flex-col transition-colors duration-300
    ${theme === "dark"
      ? "bg-gray-900 text-gray-100"
      : "bg-gray-100 text-gray-900"
    }
    ${isFullscreen
      ? "fixed inset-0 z-50 h-screen"
      : "pt-16 h-[calc(100vh-4rem)]"
    }
  `}
>


      {/* Top Bar (compact, VS Code like) */}
      <div
        className={`border-b px-3 py-2
    ${theme === "dark"
            ? "bg-gray-900 border-gray-800 text-gray-100"
            : "bg-white border-gray-200 text-gray-900"
          }
  `}
      >

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileCode className="h-4 w-4 text-gray-300" />
            <div className="flex items-baseline space-x-3">
              <span className="text-sm text-gray-200 font-medium truncate">{activeFile?.name || 'README.md'}</span>
              <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-800 rounded">{activeFile ? getLanguageFromExtension(activeFile.name).toUpperCase() : 'MD'}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">{isRoomMode ? `Room: ${roomName || roomId}` : 'Solo Mode'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isRoomMode && (
              <>
                {/* Auto-save Toggle */}
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className="flex items-center space-x-1 text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                >
                  <span className={`h-2 w-2 rounded-full ${autoSave ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="text-gray-300">
                    Auto-save {autoSave ? 'On' : 'Off'}
                  </span>
                </button>

                {/* Video + Chat */}
                <Button variant="ghost" size="sm" onClick={() => setShowVideoCall(true)} icon={Video} />
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowChat(true);
                    }}


                    icon={MessageSquare}
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </div>

              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={downloadFile}
              disabled={!activeFile}
              icon={Download}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={isFullscreen ? Minimize2 : Maximize2}
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            />
          </div>
        </div>
      </div>

      {/* Solo Mode banner (subtle) */}
      {!isRoomMode && (
        <div className="bg-gray-800 border-b border-gray-700 px-3 py-1 flex items-center justify-between text-sm text-gray-400">
          <div className="text-sm text-gray-400">Solo Mode — <span className="text-gray-300">Create a room to collaborate</span></div>
          <div>
            <Button variant="primary" size="sm" onClick={() => navigate('/create')} className="text-xs px-3 py-1">
              Create Room
            </Button>
          </div>
        </div>
      )}

      {/* Video Call Panel */}
      {showVideoCall && (
        <VideoCallPanel onClose={() => setShowVideoCall(false)} />
      )}
      {/* Chat Panel */}
      {showChat && (
        <ChatPanel
          onClose={() => {
            setShowChat(false);
            fetchUnread(); 
          }}
        />
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* File Explorer Sidebar */}
        {showExplorer &&
          <div
            className={`w-48 border-r flex flex-col text-sm
    ${theme === "dark"
                ? "bg-gray-900 border-gray-800 text-gray-100"
                : "bg-white border-gray-200 text-gray-900"
              }
  `}
          >

            {/* Explorer Header */}
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                EXPLORER
              </h3>

              <div className="flex items-center gap-1">
                {/* New File */}
                <button
                  title="New File"
                  onClick={() => setCreatingItem({ type: "file", parentId: null })}
                  className="p-1 rounded hover:bg-gray-700"
                >
                  <FilePlus className="h-4 w-4" />
                </button>

                {/* New Folder */}
                <button
                  title="New Folder"
                  onClick={() => setCreatingItem({ type: "folder", parentId: null })}
                  className="p-1 rounded hover:bg-gray-700"
                >
                  <FolderPlus className="h-4 w-4" />
                </button>

                {/* Refresh */}
                <button
                  title="Refresh"
                  onClick={async () => {
                    const { data } = await api.get(`/editor/room/${roomId}`);
                    setFileSystem(data.tree);
                  }}
                  className="p-1 rounded hover:bg-gray-700"
                >
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </button>

                {/* 🔥 TOGGLE EXPLORER (ADD THIS) */}
                <button
                  title={showExplorer ? "Hide Explorer (Ctrl+B)" : "Show Explorer (Ctrl+B)"}
                  onClick={() => setShowExplorer(prev => !prev)}
                  className="p-1 rounded hover:bg-gray-700"
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${showExplorer ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>
            </div>


            {/* Explorer Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-4">
                <div
                  className="flex items-center px-2 py-1 hover:bg-gray-700/40 rounded cursor-pointer font-medium"
                  onClick={() => toggleFolder(fileSystem.id)}
                >
                  <ChevronRight
                    className={`h-4 w-4 mr-1.5 transition-transform ${expandedFolders.includes(fileSystem.id) ? 'rotate-90' : ''
                      }`}
                  />
                  <Folder className="h-4 w-4 mr-1.5 text-blue-400" />
                  {fileSystem.name}
                </div>

                {expandedFolders.includes(fileSystem.id) && (
                  <div className="mt-1">
                    {renderFileTree(fileSystem)}
                  </div>
                )}
                {/* ROOT LEVEL CREATE INPUT */}
                {creatingItem && creatingItem.parentId === null && (
                  <div className="mt-1 ml-6">
                    <input
                      autoFocus
                      className="w-full bg-gray-800 text-sm px-2 py-1 rounded outline-none border border-blue-500"
                      placeholder={
                        creatingItem.type === "file" ? "New File" : "New Folder"
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreate(e.target.value);
                        if (e.key === "Escape") setCreatingItem(null);
                      }}
                      onBlur={() => setCreatingItem(null)}
                    />
                  </div>
                )}

              </div>
            </div>

          </div>
        }



        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs (compact) */}
          <div
            className={`border-b
    ${theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-100 border-gray-200"
              }
  `}
          >

            <div className="flex items-center px-2 overflow-x-auto space-x-1">
              {openFiles.map(file => (
                <div
                  key={file.id}
                  className={`group relative flex items-center px-3 py-2 text-xs font-medium
      ${activeFile?.id === file.id
                      ? 'bg-gray-800 text-gray-100 border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  onClick={() => selectFile(file)}
                >
                  <FileText className="h-3.5 w-3.5 mr-2 flex-shrink-0" />

                  <span className="truncate max-w-[120px]">
                    {file.name}
                    {dirtyFiles[file.id] && <span className="ml-1 text-blue-400">●</span>}
                  </span>

                  {/* CLOSE ICON — VS CODE STYLE */}
                  <button
                    onClick={(e) => closeTab(file.id, e)}
                    className="ml-2 opacity-0 group-hover:opacity-100
        text-gray-400 hover:text-white"
                    title="Close"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}


            {/* Code Textarea */}
            <div className="flex-1 relative">
              <Editor
                key={theme}
                beforeMount={defineThemes}
                theme={theme === "dark" ? "vcode-dark" : "vcode-light"}
                height="100%"
                language={activeFile ? getLanguageFromExtension(activeFile.name) : "javascript"}
                value={code}
                onChange={(value) => handleChange(value || "")}
                onMount={handleEditorMount}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />


              {/* Language Badge */}
              {activeFile && (
                <div className="absolute bottom-4 right-4 px-2 py-1 bg-gray-800/80 rounded text-xs text-gray-400">
                  {getLanguageFromExtension(activeFile.name).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Editor Status Bar */}
          <div
            className={`border-t px-4 py-2
    ${theme === "dark"
                ? "bg-gray-800 border-gray-700 text-gray-400"
                : "bg-gray-100 border-gray-200 text-gray-600"
              }
  `}
          >

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className={`h-2 w-2 rounded-full ${autoSave ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span>Auto-save {autoSave ? 'On' : 'Off'}</span>
                </div>



                <div className="hidden md:flex items-center text-gray-400">
                  <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                  <span className="mx-2">•</span>
                  <span>Lines: {code.split('\n').length}</span>
                  <span className="mx-2">•</span>
                  <span>Chars: {code.length}</span>
                </div>

              </div>

              <div className="flex items-center space-x-2">

              </div>
            </div>
          </div>
        </div>
      </div>

      {contextMenu.visible && contextMenu.target && (
        <div
          className="fixed z-50 bg-[#1e293b] border border-[#334155]
    rounded shadow-lg text-sm w-44"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {/* ONLY FOLDER OPTIONS */}
          {contextMenu.target.type === "folder" && (
            <>
              <ContextItem
                label="New File"
                onClick={() => {
                  setCreatingItem({
                    type: "file",
                    parentId: contextMenu.target.id,
                  });
                  setContextMenu(p => ({ ...p, visible: false }));
                }}
              />
              <ContextItem
                label="New Folder"
                onClick={() => {
                  setCreatingItem({
                    type: "folder",
                    parentId: contextMenu.target.id,
                  });
                  setContextMenu(p => ({ ...p, visible: false }));
                }}
              />
              <div className="border-t border-[#334155] my-1" />
            </>
          )}

          {/* COMMON (FILE + FOLDER) */}
          <ContextItem
            label="Rename"
            onClick={() => {
              renameItem(contextMenu.target);
              setContextMenu({ visible: false });
            }}
          />

          <ContextItem
            label="Delete"
            danger
            onClick={() => {
              deleteItem(contextMenu.target);
              setContextMenu({ visible: false });
            }}
          />

        </div>
      )}





    </div>
  );
};

// Helper function to count files
const countFiles = (folder) => {
  let count = 0;
  const countRecursive = (items) => {
    items.forEach(item => {
      if (item.type === 'file') count++;
      if (item.type === 'folder' && item.children) {
        countRecursive(item.children);
      }
    });
  };
  countRecursive(folder.children);
  return count;
};

export default EditorPage;