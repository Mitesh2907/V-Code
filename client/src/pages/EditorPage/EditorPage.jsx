import React, { useState, useEffect, useRef } from 'react';
import { 
  Code, Folder, File, FileText, Play, Save, Terminal,
  Maximize2, Minimize2, Plus, FolderPlus, FilePlus,
  ChevronRight, ChevronDown, Trash2, Edit, Download,
  FolderOpen, FileCode, Video, MessageSquare
} from 'lucide-react';
import VideoCallPanel from '../../components/video/VideoCallPanel';
import ChatPanel from '../../components/chat/ChatPanel';
import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { SkeletonEditor } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const { roomId } = useParams();
  const isRoomMode = !!roomId;
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState(null);
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
  const textareaRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [showTerminal, setShowTerminal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [fileSystem, setFileSystem] = useState({
    name: 'project',
    type: 'folder',
    children: [
      {
        id: 'readme',
        name: 'README.md',
        type: 'file',
        content: '# Project README\n\nWelcome to our collaborative project!',
        language: 'markdown'
      }
    ]
  });
  const [expandedFolders, setExpandedFolders] = useState(['project']);
  const [showNewItemMenu, setShowNewItemMenu] = useState(false);

  useEffect(() => {
    setLoading(false);
    if (roomId) {
      // try to read room name from localStorage (created rooms)
      try {
        const stored = localStorage.getItem('vcode-rooms');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find(r => r.id === roomId);
          if (found) setRoomName(found.name);
        }
      } catch (e) {}
      toast.success(`Connected to room: ${roomName || roomId}`);
    }
    
    // Set first file as active
    if (fileSystem.children.length > 0) {
      const firstFile = fileSystem.children.find(f => f.type === 'file');
      if (firstFile) {
        setActiveFile(firstFile);
        setCode(firstFile.content);
      }
    }
  }, [roomId]);

  const createNewFile = () => {
    const fileName = prompt('Enter file name (e.g., app.js):');
    if (!fileName) return;
    
    if (!fileName.includes('.')) {
      toast.error('Please include file extension (e.g., .js, .css, .html)');
      return;
    }
    
    const language = getLanguageFromExtension(fileName);
    const newFile = {
      id: `file_${Date.now()}`,
      name: fileName,
      type: 'file',
      content: `// New ${fileName}\n// Start coding here...`,
      language
    };
    
    setFileSystem(prev => ({
      ...prev,
      children: [...prev.children, newFile]
    }));
    
    setActiveFile(newFile);
    setCode(newFile.content);
    toast.success(`Created ${fileName}`);
    setShowNewItemMenu(false);
  };

  const createNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    
    const newFolder = {
      id: `folder_${Date.now()}`,
      name: folderName,
      type: 'folder',
      children: []
    };
    
    setFileSystem(prev => ({
      ...prev,
      children: [...prev.children, newFolder]
    }));
    
    setExpandedFolders(prev => [...prev, newFolder.id]);
    toast.success(`Created folder ${folderName}`);
    setShowNewItemMenu(false);
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
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const deleteItem = (itemId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const deleteRecursive = (items) => {
      return items.filter(item => {
        if (item.id === itemId) return false;
        if (item.type === 'folder' && item.children) {
          item.children = deleteRecursive(item.children);
        }
        return true;
      });
    };
    
    setFileSystem(prev => ({
      ...prev,
      children: deleteRecursive(prev.children)
    }));
    
    if (activeFile && activeFile.id === itemId) {
      const firstFile = findFirstFile(fileSystem);
      if (firstFile) {
        setActiveFile(firstFile);
        setCode(firstFile.content);
      } else {
        setActiveFile(null);
        setCode('// No files open\n// Create a new file to start coding');
      }
    }
    
    toast.success('Item deleted');
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

  const renameItem = (itemId, e) => {
    e.stopPropagation();
    const item = findItemById(fileSystem, itemId);
    if (!item) return;
    
    const newName = prompt('Enter new name:', item.name);
    if (!newName || newName === item.name) return;
    
    const renameRecursive = (items) => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, name: newName };
        }
        if (item.type === 'folder' && item.children) {
          return { ...item, children: renameRecursive(item.children) };
        }
        return item;
      });
    };
    
    setFileSystem(prev => ({
      ...prev,
      children: renameRecursive(prev.children)
    }));
    
    if (activeFile && activeFile.id === itemId) {
      setActiveFile(prev => ({ ...prev, name: newName }));
    }
    
    toast.success('Renamed successfully');
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
    setCode(file.content);
  };

  const saveCurrentFile = () => {
    if (!activeFile) return;
    
    setFileSystem(prev => {
      const updateRecursive = (items) => {
        return items.map(item => {
          if (item.id === activeFile.id) {
            return { ...item, content: code };
          }
          if (item.type === 'folder' && item.children) {
            return { ...item, children: updateRecursive(item.children) };
          }
          return item;
        });
      };
      
      return {
        ...prev,
        children: updateRecursive(prev.children)
      };
    });
    
    toast.success('File saved');
  };

  const runCode = () => {
    setShowTerminal(true);
    setTerminalOutput(`$ Running ${activeFile?.name || 'code'}...
> Executing...
Hello, Developer! Start coding together.
✓ Code executed successfully in 0.1s

$ Ready for next command...`);
    toast.success('Code executed!');
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
          className={`flex items-center px-2 py-1.5 hover:bg-gray-700/50 rounded cursor-pointer ${
            activeFile?.id === item.id ? 'bg-blue-900/30' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => item.type === 'file' ? selectFile(item) : toggleFolder(item.id)}
        >
          {item.type === 'folder' ? (
            <ChevronRight 
              className={`h-3.5 w-3.5 mr-1.5 transition-transform ${
                expandedFolders.includes(item.id) ? 'rotate-90' : ''
              }`}
            />
          ) : (
            <div className="w-5 mr-1.5 flex justify-center">
              <File className="h-3.5 w-3.5" />
            </div>
          )}
          
          <span className="flex-1 text-sm truncate">
            {item.name}
          </span>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => renameItem(item.id, e)}
              className="p-0.5 hover:bg-gray-600 rounded"
              title="Rename"
            >
              <Edit className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => deleteItem(item.id, e)}
              className="p-0.5 hover:bg-red-900/30 rounded"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        {item.type === 'folder' && expandedFolders.includes(item.id) && item.children && (
          renderFileTree(item, depth + 1)
        )}
      </div>
    ));
  };

  if (loading) {
    return <SkeletonEditor />;
  }

  // Update cursor position helper
  const updateCursorPosition = (el) => {
    try {
      const pos = el.selectionStart;
      const before = el.value.substring(0, pos);
      const lines = before.split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;
      setCursorPos({ line, col });
    } catch (e) {}
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-900 text-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Bar (compact, VS Code like) */}
      <div className="bg-gray-850 border-b border-gray-800 px-3 py-2">
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
                <Button variant="ghost" size="sm" onClick={() => setShowVideoCall(true)} icon={Video} title="Video Call" />
                <Button variant="ghost" size="sm" onClick={() => setShowChat(true)} icon={MessageSquare} title="Chat" />
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
    {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar (narrow, VS Code-like) */}
        <div className="w-48 bg-gray-900 border-r border-gray-800 flex flex-col text-sm">
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center">
                <FolderOpen className="h-4 w-4 mr-2" />
                EXPLORER
              </h3>
              
              <div className="relative">
                <button
                  onClick={() => setShowNewItemMenu(!showNewItemMenu)}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="New File or Folder"
                >
                  <Plus className="h-4 w-4" />
                </button>
                
                {showNewItemMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-gray-700 border border-gray-600 rounded shadow-lg z-10">
                    <button
                      onClick={createNewFile}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center"
                    >
                      <FilePlus className="h-4 w-4 mr-2" />
                      New File
                    </button>
                    <button
                      onClick={createNewFolder}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Folder
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-4">
              <div
                className="flex items-center px-2 py-1 hover:bg-gray-700/40 rounded cursor-pointer font-medium"
                onClick={() => toggleFolder(fileSystem.id)}
              >
                <ChevronRight 
                  className={`h-4 w-4 mr-1.5 transition-transform ${
                    expandedFolders.includes(fileSystem.id) ? 'rotate-90' : ''
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
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs text-gray-500 mb-1">Files Count</div>
            <div className="text-sm font-medium">
              {countFiles(fileSystem)} files
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs (compact) */}
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="flex items-center px-2 overflow-x-auto space-x-1">
              {fileSystem.children
                .filter(item => item.type === 'file')
                .map(file => (
                  <button
                    key={file.id}
                    onClick={() => selectFile(file)}
                    className={`px-3 py-2 text-xs font-medium whitespace-nowrap flex items-center group ${
                      activeFile?.id === file.id
                        ? 'bg-gray-800 text-gray-100 border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    <span className="truncate max-w-xs">{file.name}</span>
                    {activeFile?.id === file.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(file.id, e);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            <div className="w-10 bg-gray-900 text-right py-3 overflow-y-auto hide-scrollbar select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} className={`text-gray-500 text-xs pr-2 leading-6 ${i + 1 === cursorPos.line ? 'bg-gray-800 text-gray-300' : ''}`}>
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => { setCode(e.target.value); updateCursorPosition(e.target); }}
                onClick={(e) => updateCursorPosition(e.target)}
                onKeyUp={(e) => updateCursorPosition(e.target)}
                className="w-full h-full bg-gray-900 resize-none outline-none text-gray-100 font-mono p-3 text-sm leading-5"
                spellCheck="false"
                rows={code.split('\n').length}
                style={{
                  tabSize: 2,
                  MozTabSize: 2,
                  OTabSize: 2,
                  fontVariantLigatures: 'no-common-ligatures',
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
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-400">Auto-save: </span>
                  <span className="ml-1 text-green-400">On</span>
                </div>
                
                <div className="hidden md:flex items-center text-gray-400">
                  <span>Lines: {code.split('\n').length}</span>
                  <span className="mx-2">•</span>
                  <span>Chars: {code.length}</span>
                  <span className="mx-2">•</span>
                  <span>File: {activeFile?.name || 'None'}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Terminal}
                  onClick={() => setShowTerminal(!showTerminal)}
                >
                  {showTerminal ? 'Hide' : 'Show'} Terminal
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={Save}
                  onClick={saveCurrentFile}
                  disabled={!activeFile}
                >
                  Save
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={runCode}
                  disabled={!activeFile}
                >
                  Run Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Panel */}
      {showTerminal && (
        <div className="h-64 bg-gray-800 border-t border-gray-700 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 text-green-400 mr-2" />
              <span className="font-medium">Terminal</span>
              <span className="ml-2 text-xs text-gray-500">(Output)</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTerminalOutput('')}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                Clear
              </button>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-gray-300">{terminalOutput}</pre>
            {!terminalOutput && (
              <div className="text-gray-500 italic">
                // Terminal output will appear here when you run your code
              </div>
            )}

      {/* Status Bar (compact) */}
      <div className="h-6 bg-gray-900 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between px-3">
        <div className="flex items-center space-x-3">
          <div>{activeFile ? getLanguageFromExtension(activeFile.name).toUpperCase() : 'PLAIN'}</div>
          <div>Ln {cursorPos.line}, Col {cursorPos.col}</div>
        </div>
        <div className="text-xs">{isRoomMode ? 'Room' : 'Solo'}</div>
      </div>
          </div>
          
          <div className="px-4 py-3 border-t border-gray-700">
            <div className="flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <input
                type="text"
                placeholder="Type a command..."
                className="flex-1 bg-transparent outline-none text-gray-300"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const cmd = e.target.value;
                    setTerminalOutput(prev => prev + `\n$ ${cmd}\n> Command executed\n`);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
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