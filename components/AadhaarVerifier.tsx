import React, { useState } from 'react';
import { Shield, Smartphone, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { MockAadhaarService } from '../services/mockAadhaarService';
import { AadhaarResponse } from '../types';

interface Props {
  onVerificationSuccess: (data: AadhaarResponse) => void;
}

export const AadhaarVerifier: React.FC<Props> = ({ onVerificationSuccess }) => {
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [step, setStep] = useState<'INPUT' | 'OTP' | 'SUCCESS'>('INPUT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await MockAadhaarService.sendOtp(aadhaarInput);
      if (res.success) {
        setStep('OTP');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Service unavailable. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await MockAadhaarService.verifyOtp(otpInput);
      if (res.success) {
        setStep('SUCCESS');
        setTimeout(() => {
          onVerificationSuccess(res);
        }, 1500); // Show success message briefly
      } else {
        setError(res.message || "Verification failed");
      }
    } catch (err) {
      setError("Verification service error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-10">
      <div className="bg-gov-blue p-6 text-center">
        <Shield className="w-12 h-12 text-white mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Identity Verification</h2>
        <p className="text-blue-100 text-sm mt-1">Secure via UIDAI (Mock)</p>
      </div>

      <div className="p-8">
        {step === 'INPUT' && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Aadhaar Number</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaarInput}
                  onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="XXXX XXXX XXXX"
                  required
                />
                <Lock className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <ShieldCheckIcon size={12} />
                Your number is verified via OTP only. Not stored.
              </p>
            </div>
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
            <button
              type="submit"
              disabled={isLoading || aadhaarInput.length !== 12}
              className="w-full bg-gov-blue hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Send OTP'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
                <Smartphone className="w-6 h-6 text-gov-blue" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Enter OTP</h3>
              <p className="text-sm text-gray-500 mt-1">Sent to registered mobile</p>
            </div>
            <div>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl tracking-widest py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                autoFocus
              />
              <p className="text-xs text-center text-gray-400 mt-2">Use demo OTP: 123456</p>
            </div>
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded text-center">{error}</div>}
            <button
              type="submit"
              disabled={isLoading || otpInput.length !== 6}
              className="w-full bg-gov-blue hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Identity'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('INPUT')}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              Go Back
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-900">Verified Successfully</h3>
            <p className="text-gray-500 mt-2">Redirecting to profile setup...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Icon
const ShieldCheckIcon = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);