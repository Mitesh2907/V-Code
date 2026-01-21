import React from 'react';
import { Home, Search, Frown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-lg text-center">
        <div className="p-8">
          <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <Frown className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            It might have been moved, deleted, or perhaps it never existed in the first place.
          </p>
          
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              icon={Home}
              onClick={() => navigate('/')}
              fullWidth
            >
              Go to Homepage
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              icon={Search}
              onClick={() => navigate(-1)}
              fullWidth
            >
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <h3 className="font-semibold mb-2">Popular Pages</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/editor')}>
                Editor
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/create')}>
                Create Room
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/join')}>
                Join Room
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            <p>
              If you believe this is an error, please{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;