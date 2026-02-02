import {
  createFolderDB,
  getFoldersByRoomDB,
  getFolderByIdDB,
} from "../models/folderModel.js";

import {
  createFileDB,
  getFilesByRoomDB,
  getFileByIdDB,
} from "../models/fileModel.js";

import {
  createFileContentDB,
  saveFileContentDB,
  getFileContentByFileIdDB,
} from "../models/fileContentModel.js";

import { isUserRoomMemberDB } from "../models/roomModel.js";

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

    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folder: {
        id: folderId,
        name,
        parentId: parentId || null,
      },
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
    const { roomId, folderId, name, language } = req.body;
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

    res.status(201).json({
      success: true,
      message: "File created successfully",
      file: {
        id: fileId,
        name,
        folderId: folderId || null,
        language,
      },
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

    // 🔐 Room member check
    const isMember = await isUserRoomMemberDB(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this room",
      });
    }

    const folders = await getFoldersByRoomDB(roomId);
    const files = await getFilesByRoomDB(roomId);

    // attach content to files
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

    res.status(200).json({
      success: true,
      data: {
        folders,
        files: filesWithContent,
      },
    });
  } catch (error) {
    console.error("Load Editor Data Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while loading editor data",
    });
  }
};
