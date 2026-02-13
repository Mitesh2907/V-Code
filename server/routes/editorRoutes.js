import express from "express";
import protect from "../middlewares/authMiddleware.js";

import {
  createFolder,
  createFile,
  saveFileContent,
  getRoomEditorData,
  renameItem,
  deleteItem
} from "../controllers/editorController.js";

const router = express.Router();

/**
 * CREATE FOLDER
 * POST /api/editor/folder
 */
router.post("/folder", protect, createFolder);

/**
 * CREATE FILE
 * POST /api/editor/file
 */
router.post("/file", protect, createFile);

/**
 * SAVE FILE CONTENT
 * POST /api/editor/save
 */
router.post("/save", protect, saveFileContent);

/**
 * LOAD ROOM EDITOR DATA
 * GET /api/editor/room/:roomId
 */
router.get("/room/:roomId", protect, getRoomEditorData);

/**
 * RENAME FILE / FOLDER
 */
router.patch("/rename", protect, renameItem);

/**
 * DELETE FILE / FOLDER
 */
router.delete("/item", protect, deleteItem);

export default router;
