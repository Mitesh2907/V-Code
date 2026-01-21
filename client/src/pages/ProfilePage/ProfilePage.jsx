import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Settings, LogOut, Edit, Save, X, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';
import { SkeletonBox, SkeletonText } from '../../components/common/Skeleton';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    bio: '',
    website: '',
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      if (user) {
        setEditData({
          name: user.name || '',
          email: user.email || '',
          bio: 'Full-stack developer passionate about collaborative coding and open-source projects.',
          website: 'https://example.com',
        });
      }
    }, 1500);
  }, [user]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div>
            <Card className="mb-6">
              <div className="p-6 text-center">
                <SkeletonBox height="h-32" width="h-32" rounded="rounded-full" className="mx-auto mb-4" shimmer />
                <SkeletonBox height="h-8" width="w-3/4" className="mx-auto mb-2" shimmer />
                <SkeletonBox height="h-4" width="w-1/2" className="mx-auto" shimmer />
              </div>
            </Card>
            
            <Card>
              <div className="p-6 space-y-4">
                <SkeletonText lines={4} />
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <SkeletonBox height="h-8" width="w-1/3" className="mb-6" shimmer />
                <div className="space-y-4">
                  <SkeletonBox height="h-12" shimmer />
                  <SkeletonBox height="h-12" shimmer />
                  <SkeletonBox height="h-12" shimmer />
                  <SkeletonBox height="h-24" shimmer />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                icon={X}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Save}
                onClick={handleSave}
                loading={loading}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                icon={Edit}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                icon={LogOut}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div>
          <Card className="mb-6">
            <div className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mx-auto">
                  {user.name?.charAt(0) || 'U'}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="mb-2"
                />
              ) : (
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              )}
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex justify-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  Pro Member
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                  Verified
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Member since</div>
                    <div className="font-medium">January 2024</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Timezone</div>
                    <div className="font-medium">UTC+05:30</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-4">Activity Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Rooms Created</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Collaboration Hours</span>
                    <span className="font-medium">48h</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-purple-500"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Code Lines</span>
                    <span className="font-medium">5.2K</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    icon={User}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Email Address"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    icon={Mail}
                    disabled={!isEditing}
                  />
                </div>
                
                <Input
                  label="Website"
                  value={editData.website}
                  onChange={(e) => setEditData({...editData, website: e.target.value})}
                  icon={Globe}
                  disabled={!isEditing}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      {editData.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Preferences
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive updates about your rooms
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow others to find your profile
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm" icon={Lock}>
                    Enable
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;