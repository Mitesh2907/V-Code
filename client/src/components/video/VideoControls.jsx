import React from 'react';
import Button from '../common/Button/Button';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

const VideoControls = ({ micOn, camOn, onToggleMic, onToggleCam, onLeave }) => {
  return (
    <div className="w-full flex items-center justify-center space-x-4 p-3 bg-gradient-to-t from-black/60 to-transparent">
      <Button variant="outline" size="sm" onClick={onToggleMic} icon={micOn ? Mic : MicOff}>
        {micOn ? 'Mic On' : 'Mic Off'}
      </Button>
      <Button variant="outline" size="sm" onClick={onToggleCam} icon={camOn ? Video : VideoOff}>
        {camOn ? 'Cam On' : 'Cam Off'}
      </Button>
      <Button variant="danger" size="sm" onClick={onLeave} icon={Phone}>
        Leave
      </Button>
    </div>
  );
};

export default VideoControls;

