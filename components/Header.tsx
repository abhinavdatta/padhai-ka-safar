import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';

export const Header: React.FC<{ 
  isVerified: boolean, 
  userName?: string,
  onLogout: () => void 
}> = ({ isVerified, userName, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-gov-blue text-white p-2 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gov-blue tracking-tight">PADHAI KA SAFAR</h1>
              <p className="text-xs text-gray-500 font-medium">Government of India Initiative</p>
            </div>
          </div>

          {/* User Status Section */}
          <div className="flex items-center gap-4">
            {isVerified && userName ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-800">{userName}</span>
                  <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    <ShieldCheck size={10} /> Aadhaar Verified
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck size={16} className="text-gov-blue" />
                <span>Secure Identity Protocol</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};