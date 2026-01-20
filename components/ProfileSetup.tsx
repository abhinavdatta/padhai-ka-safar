import React, { useState } from 'react';
import { StudentProfile, EducationLevel, State, IncomeRange, AadhaarResponse } from '../types';

interface Props {
  aadhaarData: AadhaarResponse;
  onComplete: (profile: StudentProfile) => void;
}

export const ProfileSetup: React.FC<Props> = ({ aadhaarData, onComplete }) => {
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    name: aadhaarData.user_data?.name || '',
    educationLevel: EducationLevel.SCHOOL_12,
    state: (aadhaarData.user_data?.state as State) || State.DELHI,
    incomeRange: IncomeRange.BELOW_1L,
    district: '',
    interests: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.district) return;
    
    const profile: StudentProfile = {
      verificationToken: aadhaarData.token!,
      name: formData.name,
      educationLevel: formData.educationLevel!,
      state: formData.state!,
      district: formData.district,
      incomeRange: formData.incomeRange!,
      interests: formData.interests || []
    };
    onComplete(profile);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Complete Your Academic Profile</h2>
        <p className="text-sm text-gray-500">This information helps us match scholarships and courses.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field - Read Only from KYC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              disabled 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" 
            />
            <p className="text-xs text-green-600 mt-1">✓ Verified from Aadhaar</p>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">State of Domicile</label>
             <select 
              value={formData.state}
              onChange={e => setFormData({...formData, state: e.target.value as State})}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
             >
               {Object.values(State).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input 
              type="text" 
              value={formData.district}
              onChange={e => setFormData({...formData, district: e.target.value})}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter District"
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Current Education Level</label>
             <select 
              value={formData.educationLevel}
              onChange={e => setFormData({...formData, educationLevel: e.target.value as EducationLevel})}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
             >
               {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
             </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Family Annual Income</label>
             <select 
              value={formData.incomeRange}
              onChange={e => setFormData({...formData, incomeRange: e.target.value as IncomeRange})}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
             >
               {Object.values(IncomeRange).map(i => <option key={i} value={i}>{i}</option>)}
             </select>
             <p className="text-xs text-gray-500 mt-1">Used only for eligibility checks.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            className="bg-gov-blue hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Create Profile & Go to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};