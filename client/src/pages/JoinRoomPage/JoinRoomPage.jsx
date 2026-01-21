import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card/Card';
import toast from 'react-hot-toast';

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    if (!roomNumber.trim()) {
      toast.error('Room Number is required');
      return;
    }
    setLoading(true);
    try {
      const stored = localStorage.getItem('vcode-rooms');
      const list = stored ? JSON.parse(stored) : [];
      const found = list.find(r => r.id === roomNumber);
      if (found && found.password) {
        if (found.password !== password) {
          setLoading(false);
          toast.error('Incorrect password for this room');
          return;
        }
      }
      // frontend-only: allow join even if room not found
      setLoading(false);
      navigate(`/editor/${encodeURIComponent(roomNumber)}`);
    } catch (err) {
      setLoading(false);
      toast.error('Unable to join room');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Join a Room</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">Enter the Room Number and password if required.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Room</CardTitle>
          <CardDescription>Provide the Room Number to join. If the room is private enter the password.</CardDescription>
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
            type="password"
            label="Password (optional)"
            placeholder="Enter password if the room is private"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Enter password if the room is private"
          />
        </CardContent>

        <CardFooter>
          <Button variant="primary" size="lg" icon={ArrowRight} onClick={handleJoin} loading={loading} fullWidth>
            Join Room
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JoinRoomPage;

