import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import Button from "../../components/common/Button/Button";
import api from "../../configs/api";
import toast from "react-hot-toast";

const RoomsPage = () => {
  const navigate = useNavigate();

  const [createdRooms, setCreatedRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
    roomId: null,
  });

  const [renameModal, setRenameModal] = useState({
    open: false,
    roomId: null,
    value: "",
  });

  const [membersModal, setMembersModal] = useState({
    open: false,
    roomId: null,
    members: [],
  });

  const [memberConfirm, setMemberConfirm] = useState({
    open: false,
    userId: null,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const created = await api.get("/rooms/created");
      const joined = await api.get("/rooms/joined");

      setCreatedRooms(created.data.rooms || []);
      setJoinedRooms(joined.data.rooms || []);
    } catch (err) {
      toast.error("Failed to load rooms");
    }
  };

  const enterRoom = async (roomId) => {
    try {
      const { data } = await api.get(`/rooms/${roomId}/enter`);

      if (data.success) {
        navigate(`/editor/${roomId}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to enter room"
      );
    }
  };


  /* ================= DELETE / EXIT ================= */

  const handleDeleteOrExit = async () => {
    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/rooms/${confirmModal.roomId}`);
        toast.success("Room deleted");
      }

      if (confirmModal.type === "exit") {
        await api.delete(`/rooms/${confirmModal.roomId}/exit`);
        toast.success("Exited room");
      }

      fetchRooms();
    } catch {
      toast.error("Action failed");
    }

    setConfirmModal({ open: false, type: null, roomId: null });
  };

  /* ================= RENAME ================= */

  const handleRename = async () => {
    if (!renameModal.value.trim()) return;

    try {
      await api.patch(`/rooms/${renameModal.roomId}`, {
        roomName: renameModal.value,
      });

      toast.success("Room renamed");
      fetchRooms();
    } catch {
      toast.error("Rename failed");
    }

    setRenameModal({ open: false, roomId: null, value: "" });
  };

  /* ================= REMOVE MEMBER ================= */

  const removeMember = async () => {
    try {
      await api.delete(
        `/rooms/${membersModal.roomId}/members/${memberConfirm.userId}`
      );

      toast.success("Member removed");

      const { data } = await api.get(
        `/rooms/${membersModal.roomId}/members`
      );

      setMembersModal((prev) => ({
        ...prev,
        members: data.members,
      }));
    } catch {
      toast.error("Failed to remove member");
    }

    setMemberConfirm({ open: false, userId: null });
  };

  /* ================================================= */

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl text-gray-800 dark:text-gray-100">

      <h1 className="text-3xl font-bold mb-8">
        Rooms Dashboard
      </h1>

      {/* CREATE / JOIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold mb-3 text-lg">Create Room</h3>
          <Button onClick={() => navigate("/create")}>
            Create Room
          </Button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold mb-3 text-lg">Join Room</h3>
          <Button variant="outline" onClick={() => navigate("/join")}>
            Join Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ================= CREATED ROOMS ================= */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">Created Rooms</h3>

          {createdRooms.length === 0 && (
            <p className="text-sm text-gray-500">
              No rooms created yet.
            </p>
          )}

          {createdRooms.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-900 mb-4"
            >
              <div>
                <div className="font-medium">{r.room_name}</div>
                <div className="text-xs text-gray-500">
                  {r.room_number}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  disabled={r.status !== "active"}
                  onClick={() => enterRoom(r.id)}
                >
                  {r.status !== "active" ? "Closed" : "Enter"}
                </Button>


                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === r.id ? null : r.id)
                    }
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpen === r.id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 text-gray-800 dark:text-gray-200">

                      <button
                        onClick={() => {
                          setRenameModal({
                            open: true,
                            roomId: r.id,
                            value: r.room_name,
                          });
                          setMenuOpen(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Rename
                      </button>

                      <button
                        onClick={async () => {
                          const { data } = await api.get(
                            `/rooms/${r.id}/members`
                          );
                          setMembersModal({
                            open: true,
                            roomId: r.id,
                            members: data.members,
                          });
                          setMenuOpen(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Members
                      </button>

                      <button
                        onClick={() => {
                          setConfirmModal({
                            open: true,
                            type: "delete",
                            roomId: r.id,
                          });
                          setMenuOpen(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= JOINED ROOMS ================= */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">Joined Rooms</h3>

          {joinedRooms.length === 0 && (
            <p className="text-sm text-gray-500">
              No rooms joined yet.
            </p>
          )}

          {joinedRooms.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-900 mb-4"
            >
              <div>
                <div className="font-medium">{r.room_name}</div>
                <div className="text-xs text-gray-500">
                  {r.room_number}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  disabled={r.status !== "active"}
                  onClick={() => enterRoom(r.id)}
                >
                  {r.status !== "active" ? "Closed" : "Enter"}
                </Button>


                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpen(
                        menuOpen === `join-${r.id}` ? null : `join-${r.id}`
                      )
                    }
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpen === `join-${r.id}` && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 text-gray-800 dark:text-gray-200">
                      <button
                        onClick={() => {
                          setConfirmModal({
                            open: true,
                            type: "exit",
                            roomId: r.id,
                          });
                          setMenuOpen(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Exit Room
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure?
            </h2>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setConfirmModal({ open: false, type: null, roomId: null })
                }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteOrExit}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RENAME MODAL ================= */}
      {renameModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Rename Room
            </h2>

            <input
              value={renameModal.value}
              onChange={(e) =>
                setRenameModal((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-900"
              placeholder="Enter new name"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setRenameModal({
                    open: false,
                    roomId: null,
                    value: "",
                  })
                }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MEMBERS MODAL ================= */}
      {membersModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Room Members
            </h2>

            {membersModal.members.length === 0 && (
              <p className="text-sm text-gray-500">
                No members found.
              </p>
            )}

            {membersModal.members.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-center mb-3"
              >
                <span>{m.fullName}</span>
                <button
                  onClick={() =>
                    setMemberConfirm({
                      open: true,
                      userId: m.id,
                    })
                  }
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  setMembersModal({
                    open: false,
                    roomId: null,
                    members: [],
                  })
                }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER CONFIRM */}
      {memberConfirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Remove this member?
            </h2>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setMemberConfirm({ open: false, userId: null })
                }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={removeMember}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoomsPage;
