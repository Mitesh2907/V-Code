import {
  createFolderDB,
  getFoldersByRoomDB,
  getFolderByIdDB,
  renameFolderDB,
  deleteFolderRecursiveDB
} from "../models/folderModel.js";


import {
  createFileDB,
  getFilesByRoomDB,
  getFileByIdDB,
  renameFileDB,
  deleteFileDB
} from "../models/fileModel.js";


import {
  createFileContentDB,
  saveFileContentDB,
  getFileContentByFileIdDB,
} from "../models/fileContentModel.js";

import { isUserRoomMemberDB } from "../models/roomModel.js";
import { getRoomByIdDB } from "../models/roomModel.js";



const renameRecursive = (items, id, newName) => {
  return items.map(item => {
    if (item.id === id) {
      return { ...item, name: newName };
    }

    if (item.type === "folder" && item.children) {
      return {
        ...item,
        children: renameRecursive(item.children, id, newName)
      };
    }

    return item;
  });
};


const buildTree = (folders, files) => {
  const map = {};
  const root = {
    id: "project",
    name: "project",
    type: "folder",
    children: [],
  };

  // folders map
  folders.forEach(f => {
    map[f.id] = {
      id: f.id,
      name: f.name,
      type: "folder",
      children: [],
    };
  });

  // attach folders
  folders.forEach(f => {
    if (f.parent_id) {
      map[f.parent_id]?.children.push(map[f.id]);
    } else {
      root.children.push(map[f.id]);
    }
  });

  // attach files
  files.forEach(file => {
    const fileNode = {
      id: file.id,
      name: file.name,
      type: "file",
      content: file.content || "",
      language: file.language || "text",
    };

    if (file.folder_id && map[file.folder_id]) {
      map[file.folder_id].children.push(fileNode);
    } else {
      root.children.push(fileNode);
    }

  });

  return root;
};


/**
 * CREATE FOLDER
 * POST /api/editor/folder
 */
export const createFolder = async (req, res) => {
  try {
    const { roomId, name, parentId } = req.body;
    const userId = req.userId;

    if (!roomId || !name) {
      return res.status(400).json({
        success: false,
        message: "roomId and folder name are required",
      });
    }

    // 🔐 Room member check
    const isMember = await isUserRoomMemberDB(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this room",
      });
    }

    // parent folder validation (if exists)
    if (parentId) {
      const parentFolder = await getFolderByIdDB(parentId);
      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: "Parent folder not found",
        });
      }
    }

    const folderId = await createFolderDB({
      roomId,
      name,
      parentId,
    });

    const folders = await getFoldersByRoomDB(roomId);
    const files = await getFilesByRoomDB(roomId);

    const filesWithContent = await Promise.all(
      files.map(async (file) => {
        const contentData = await getFileContentByFileIdDB(file.id);
        return {
          ...file,
          content: contentData?.content || "",
        };
      })
    );

    const tree = buildTree(folders, filesWithContent);

    res.status(201).json({
      success: true,
      tree,
    });

  } catch (error) {
    console.error("Create Folder Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating folder",
    });
  }
};

/**
 * CREATE FILE
 * POST /api/editor/file
 */
export const createFile = async (req, res) => {
  try {
    const { roomId, folderId, name, language = "text" } = req.body;
    const userId = req.userId;

    if (!roomId || !name) {
      return res.status(400).json({
        success: false,
        message: "roomId and file name are required",
      });
    }

    // 🔐 Room member check
    const isMember = await isUserRoomMemberDB(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this room",
      });
    }

    // folder validation (if exists)
    if (folderId) {
      const folder = await getFolderByIdDB(folderId);
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: "Folder not found",
        });
      }
    }

    const fileId = await createFileDB({
      roomId,
      folderId,
      name,
      language,
    });

    // create empty content for file
    await createFileContentDB(fileId);

    const folders = await getFoldersByRoomDB(roomId);
    const files = await getFilesByRoomDB(roomId);

    const filesWithContent = await Promise.all(
      files.map(async (file) => {
        const contentData = await getFileContentByFileIdDB(file.id);
        return {
          ...file,
          content: contentData?.content || "",
        };
      })
    );

    const tree = buildTree(folders, filesWithContent);

    res.status(201).json({
      success: true,
      tree,
    });

  } catch (error) {
    console.error("Create File Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating file",
    });
  }
};

/**
 * SAVE FILE CONTENT
 * POST /api/editor/save
 */
export const saveFileContent = async (req, res) => {
  try {
    const { fileId, content } = req.body;
    const userId = req.userId;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "fileId is required",
      });
    }

    const file = await getFileByIdDB(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // 🔐 Room member check
    const isMember = await isUserRoomMemberDB(file.room_id, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this file",
      });
    }

    await saveFileContentDB(fileId, content);

    res.status(200).json({
      success: true,
      message: "File content saved successfully",
    });
  } catch (error) {
    console.error("Save File Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving file",
    });
  }
};

/**
 * LOAD ROOM EDITOR DATA
 * GET /api/editor/room/:roomId
 */
export const getRoomEditorData = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    // 🔴 FIRST: Check room status
    const room = await getRoomByIdDB(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This room has been closed by admin",
      });
    }

    // 🔐 THEN: Member check
    const isMember = await isUserRoomMemberDB(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this room",
      });
    }

    const folders = await getFoldersByRoomDB(roomId);
    const files = await getFilesByRoomDB(roomId);

    const filesWithContent = await Promise.all(
      files.map(async (file) => {
        const contentData = await getFileContentByFileIdDB(file.id);
        return {
          ...file,
          content: contentData?.content || "",
          updated_at: contentData?.updated_at || null,
        };
      })
    );

    const tree = buildTree(folders, filesWithContent);

    res.status(200).json({
      success: true,
      tree,
    });

  } catch (error) {
    console.error("Load Editor Data Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while loading editor data",
    });
  }
};


export const renameItem = async (req, res) => {
  try {
    const { itemId, newName, type } = req.body;
    const userId = req.userId;

    if (!itemId || !newName || !type) {
      return res.status(400).json({ message: "Invalid data" });
    }

    if (type === "folder") {
      const folder = await getFolderByIdDB(itemId);
      if (!folder) return res.status(404).json({ message: "Folder not found" });

      const isMember = await isUserRoomMemberDB(folder.room_id, userId);
      if (!isMember) return res.status(403).json({ message: "Forbidden" });

      await renameFolderDB(itemId, newName);
    }

    if (type === "file") {
      const file = await getFileByIdDB(itemId);
      if (!file) return res.status(404).json({ message: "File not found" });

      const isMember = await isUserRoomMemberDB(file.room_id, userId);
      if (!isMember) return res.status(403).json({ message: "Forbidden" });

      await renameFileDB(itemId, newName);
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Rename Error:", err);
    res.status(500).json({ message: "Rename failed" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId, type } = req.body;
    const userId = req.userId;

    if (!itemId || !type) {
      return res.status(400).json({ message: "Invalid data" });
    }

    if (type === "file") {
      const file = await getFileByIdDB(itemId);
      if (!file) return res.status(404).json({ message: "File not found" });

      const isMember = await isUserRoomMemberDB(file.room_id, userId);
      if (!isMember) return res.status(403).json({ message: "Forbidden" });

      await deleteFileDB(itemId);
    }

    if (type === "folder") {
      const folder = await getFolderByIdDB(itemId);
      if (!folder) return res.status(404).json({ message: "Folder not found" });

      const isMember = await isUserRoomMemberDB(folder.room_id, userId);
      if (!isMember) return res.status(403).json({ message: "Forbidden" });

      await deleteFolderRecursiveDB(itemId);
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

