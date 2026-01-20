import React, { useMemo } from 'react';
import { StudentProfile } from '../types';
import { getEligibleScholarships, getRecommendedCourses, getNextSteps } from '../services/recommendationService';
import { Bell, GraduationCap, Briefcase, ChevronRight, Award, ExternalLink } from 'lucide-react';

interface Props {
  profile: StudentProfile;
}

export const Dashboard: React.FC<Props> = ({ profile }) => {
  const scholarships = useMemo(() => getEligibleScholarships(profile), [profile]);
  const courses = useMemo(() => getRecommendedCourses(profile), [profile]);
  const nextSteps = useMemo(() => getNextSteps(profile.educationLevel), [profile.educationLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-blue to-blue-900 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.name}</h1>
        <p className="opacity-90">Education Level: {profile.educationLevel} • Domicile: {profile.state}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
            <Award size={16} className="text-gov-accent" />
            {scholarships.length} Scholarships Found
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
            <GraduationCap size={16} className="text-gov-accent" />
            {courses.length} Recommended Courses
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Journey Tracker */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-gov-blue" />
              Academic Journey
            </h3>
            
            <div className="relative border-l-2 border-blue-100 ml-3 space-y-8 py-2">
              {/* Past */}
              <div className="ml-6 relative">
                <span className="absolute -left-[31px] bg-green-500 h-4 w-4 rounded-full border-2 border-white"></span>
                <p className="text-sm text-gray-500">Completed</p>
                <h4 className="font-semibold text-gray-800">Previous Education</h4>
              </div>

              {/* Current */}
              <div className="ml-6 relative">
                <span className="absolute -left-[31px] bg-gov-blue h-4 w-4 rounded-full border-2 border-white ring-4 ring-blue-50"></span>
                <p className="text-sm text-gov-blue font-semibold">Current Stage</p>
                <h4 className="font-bold text-gray-900 text-lg">{profile.educationLevel}</h4>
              </div>

              {/* Next Steps */}
              <div className="ml-6 relative">
                <span className="absolute -left-[31px] bg-gray-200 h-4 w-4 rounded-full border-2 border-white"></span>
                <p className="text-sm text-gray-500">Recommended Next Steps</p>
                <ul className="mt-2 space-y-2">
                  {nextSteps.map((step, idx) => (
                    <li key={idx} className="bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-lg border border-blue-100 flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition-colors">
                      {step}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl border border-orange-100 p-6">
            <h3 className="text-orange-800 font-bold mb-2 flex items-center gap-2">
              <Bell size={18} />
              Alerts
            </h3>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• Apply for NSP Scholarship before Oct 31.</li>
              <li>• Skill India registration opens next week.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Scholarships */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Eligible Scholarships</h2>
              <button className="text-gov-blue text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scholarships.length > 0 ? scholarships.map((sch) => (
                <div key={sch.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded mb-2 inline-block">
                    {sch.provider}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gov-blue transition-colors">{sch.name}</h3>
                  <div className="text-2xl font-bold text-gov-blue my-2">{sch.amount}</div>
                  <p className="text-xs text-gray-500 mb-4">{sch.eligibilityDescription}</p>
                  <div className="flex justify-between items-center text-xs font-medium border-t pt-3">
                    <span className="text-red-600">Deadline: {sch.deadline}</span>
                    <button className="text-gov-blue flex items-center gap-1">Apply <ExternalLink size={12} /></button>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center p-8 bg-gray-50 rounded-lg text-gray-500">
                  No scholarships found for current criteria.
                </div>
              )}
            </div>
          </section>

          {/* Courses */}
          <section>
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Free Government Courses</h2>
              <button className="text-gov-blue text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-gov-blue font-bold text-xs">
                      {course.platform.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.title}</h4>
                      <div className="flex gap-3 text-xs text-gray-500 mt-1">
                        <span>{course.platform}</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span className={course.certification ? "text-green-600" : ""}>{course.certification ? "Certificate Available" : "Self-Paced"}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gov-blue text-gov-blue rounded-lg text-sm font-medium hover:bg-blue-50">
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};