import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card/Card';
import toast from 'react-hot-toast';

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = () => {
    if (!roomNumber.trim()) {
      toast.error('Room Number is required');
      return;
    }
    if (!roomName.trim()) {
      toast.error('Room Name is required');
      return;
    }

    try {
      const stored = localStorage.getItem('vcode-rooms');
      const list = stored ? JSON.parse(stored) : [];
      if (list.find(r => r.id === roomNumber)) {
        toast.error('Room Number already exists. Choose a different number.');
        return;
      }

      setLoading(true);
      const newRoom = {
        id: roomNumber,
        name: roomName,
        password: roomPassword || null,
        createdAt: new Date().toISOString(),
      };
      const next = [newRoom, ...list];
      localStorage.setItem('vcode-rooms', JSON.stringify(next));
      setLoading(false);
      toast.success('Room created');
      navigate(`/editor/${encodeURIComponent(roomNumber)}`);
    } catch (err) {
      setLoading(false);
      toast.error('Unable to create room');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a New Room</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">
          Fill the Room Number and Name. If you provide a password the room will be private; otherwise it will be public.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>Only the fields below are required to create a room.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Room Number"
            placeholder="e.g., VC-1023"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />

          <Input
            label="Room Name"
            placeholder="e.g., Frontend Discussion Room"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="Set a password to make this room private"
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
            helperText="If set, the room will be private and require this password to join. Leave empty for public rooms."
          />
        </CardContent>
        <CardFooter>
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={handleCreateRoom}
            loading={loading}
            fullWidth
          >
            Create Room & Start Coding
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateRoomPage;

