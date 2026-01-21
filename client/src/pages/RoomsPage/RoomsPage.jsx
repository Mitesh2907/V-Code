import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';

const RoomsPage = () => {
  const navigate = useNavigate();
  const [createdRooms, setCreatedRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vcode-rooms');
      setCreatedRooms(stored ? JSON.parse(stored) : []);
    } catch (e) {
      setCreatedRooms([]);
    }
    try {
      const storedJ = localStorage.getItem('vcode-joined-rooms');
      if (storedJ) setJoinedRooms(JSON.parse(storedJ));
      else {
        // mock joined rooms (empty by default)
        setJoinedRooms([]);
      }
    } catch (e) {
      setJoinedRooms([]);
    }
  }, []);

  const enterRoom = (roomId) => {
    navigate(`/editor/${encodeURIComponent(roomId)}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Rooms Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Create Room</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create a new room and start collaborating</p>
          <Button variant="primary" onClick={() => navigate('/create')}>Create Room</Button>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Join Room</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Join an existing room using room number</p>
          <Button variant="outline" onClick={() => navigate('/join')}>Join Room</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-4">Created Rooms</h3>
          {createdRooms.length === 0 ? (
            <div className="text-sm text-gray-500">You haven't created any rooms yet.</div>
          ) : (
            <div className="space-y-3">
              {createdRooms.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.id}</div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => enterRoom(r.id)}>Enter</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-4">Joined Rooms</h3>
          {joinedRooms.length === 0 ? (
            <div className="text-sm text-gray-500">You haven't joined any rooms yet.</div>
          ) : (
            <div className="space-y-3">
              {joinedRooms.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.id}</div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => enterRoom(r.id)}>Enter</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;

