/**
 * PADHAI KA SAFAR - Frontend Logic
 * Implements Mock Aadhaar Service, Rule Engine, and UI Router.
 */

// --- DATA & MOCK SERVICES ---

const MOCK_DB = {
    scholarships: [
        { id: "NSP-001", name: "Post Matric Scholarship (Minorities)", provider: "Min. Minority Affairs", amount: "₹12,000/yr", deadline: "2024-10-31", desc: "Income < 2L, >50% prev exam", tags: ["Minority"] },
        { id: "NSP-002", name: "Central Sector Scheme", provider: "Dept. Higher Education", amount: "₹20,000/yr", deadline: "2024-11-15", desc: "Top 20th Percentile Class 12", tags: ["Merit"] },
        { id: "AICTE-001", name: "Pragati Scholarship", provider: "AICTE", amount: "₹50,000/yr", deadline: "2024-12-01", desc: "Girl students in Tech", tags: ["Women"] },
        { id: "ST-001", name: "Pre-Matric SC Scholarship", provider: "Min. Social Justice", amount: "₹3,500/yr", deadline: "2024-09-30", desc: "Income < 2.5L", tags: ["SC"] }
    ],
    courses: [
        { id: "SW-01", title: "Intro to Python", platform: "SWAYAM", duration: "8 Weeks", cert: true, cat: "CS" },
        { id: "NSDC-01", title: "Data Entry Operator", platform: "NSDC", duration: "12 Weeks", cert: true, cat: "Vocational" },
        { id: "NPTEL-01", title: "Soft Skills", platform: "NPTEL", duration: "4 Weeks", cert: false, cat: "Mgmt" },
        { id: "SI-01", title: "EV Technician", platform: "Skill India", duration: "6 Months", cert: true, cat: "Tech" }
    ]
};

const MockAadhaarService = {
    sendOtp: async (aadhaar) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if(aadhaar.length === 12) resolve({ success: true });
                else resolve({ success: false, message: "Invalid Aadhaar Number" });
            }, 1000);
        });
    },
    verifyOtp: async (otp) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if(otp === "123456") {
                    resolve({ 
                        success: true, 
                        token: "UID_" + Date.now(), 
                        user: { name: "Rahul Kumar", state: "Delhi" } 
                    });
                } else {
                    resolve({ success: false, message: "Incorrect OTP" });
                }
            }, 1000);
        });
    }
};

const RuleEngine = {
    getScholarships: (profile) => {
        const eligible = [];
        const { incomeRange: income, educationLevel: edu } = profile;
        
        if (income === "Below 1 Lakh" || income === "1 Lakh - 2.5 Lakhs") {
            eligible.push(MOCK_DB.scholarships.find(s => s.id === "NSP-001"));
            eligible.push(MOCK_DB.scholarships.find(s => s.id === "ST-001"));
        }
        if (edu === "Undergraduate" || edu === "Postgraduate") {
            eligible.push(MOCK_DB.scholarships.find(s => s.id === "NSP-002"));
        }
        if (edu === "Diploma" || edu === "Undergraduate") {
            eligible.push(MOCK_DB.scholarships.find(s => s.id === "AICTE-001"));
        }
        return [...new Set(eligible)].filter(Boolean);
    },
    getCourses: (profile) => {
        if(profile.educationLevel.includes("Class")) {
            return MOCK_DB.courses.filter(c => c.cat === "Vocational" || c.platform === "Skill India");
        }
        return MOCK_DB.courses.filter(c => c.cat === "CS" || c.cat === "Mgmt");
    },
    getNextSteps: (edu) => {
        const map = {
            "Class 10": ["Explore Diploma Engg", "Prep for Higher Secondary"],
            "Class 12": ["Apply for CUET (UG)", "Vocational Training"],
            "Diploma": ["Lateral Entry B.Tech", "NAPS Apprenticeship"],
            "Undergraduate": ["GATE/CAT Prep", "Industry Certification"],
            "Postgraduate": ["PhD Research", "NET Exam"]
        };
        return map[edu] || ["Upskill", "Certifications"];
    }
};

// --- APP LOGIC ---

const app = {
    state: {
        view: 'LANDING',
        verificationData: null,
        userProfile: null
    },

    init: () => {
        lucide.createIcons();
        app.router('LANDING');
    },

    router: (viewName) => {
        app.state.view = viewName;
        // Hide all views
        ['view-landing', 'view-verify', 'view-profile', 'view-dashboard'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
        // Show current view
        const viewEl = document.getElementById(`view-${viewName.toLowerCase()}`);
        if(viewEl) viewEl.classList.remove('hidden');

        // Refresh icons just in case
        lucide.createIcons();
        
        // Update header user section
        app.updateHeader();
    },

    updateHeader: () => {
        const container = document.getElementById('header-user-section');
        if (app.state.userProfile) {
            container.innerHTML = `
                <div class="flex flex-col items-end">
                    <span class="text-sm font-semibold text-gray-800">${app.state.userProfile.name}</span>
                    <span class="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        <i data-lucide="shield-check" class="w-3 h-3"></i> Aadhaar Verified
                    </span>
                </div>
                <button onclick="app.logout()" class="text-sm text-red-600 hover:text-red-700 font-medium">Logout</button>
            `;
            lucide.createIcons();
        } else {
            container.innerHTML = `
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <i data-lucide="shield-check" class="w-4 h-4 text-gov-blue"></i>
                    <span>Secure Identity Protocol</span>
                </div>
            `;
            lucide.createIcons();
        }
    },

    // Verification Logic
    handleSendOtp: async (e) => {
        e.preventDefault();
        const aadhaar = document.getElementById('input-aadhaar').value;
        const btn = document.getElementById('btn-send-otp');
        const feedback = document.getElementById('verify-feedback');
        
        btn.disabled = true;
        btn.textContent = "Sending...";
        feedback.textContent = "";

        const res = await MockAadhaarService.sendOtp(aadhaar);
        
        if(res.success) {
            document.getElementById('form-aadhaar').classList.add('hidden');
            document.getElementById('form-otp').classList.remove('hidden');
            feedback.textContent = "";
        } else {
            feedback.textContent = res.message;
            feedback.className = "mt-4 text-center text-sm text-red-600";
        }
        btn.disabled = false;
        btn.innerHTML = `Send OTP <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        lucide.createIcons();
    },

    handleVerifyOtp: async (e) => {
        e.preventDefault();
        const otp = document.getElementById('input-otp').value;
        const btn = document.getElementById('btn-verify-otp');
        const feedback = document.getElementById('verify-feedback');

        btn.disabled = true;
        btn.textContent = "Verifying...";

        const res = await MockAadhaarService.verifyOtp(otp);

        if(res.success) {
            app.state.verificationData = res;
            feedback.textContent = "Verified Successfully!";
            feedback.className = "mt-4 text-center text-sm text-green-600 font-bold";
            setTimeout(() => {
                app.prefillProfile(res.user);
                app.router('PROFILE');
            }, 1000);
        } else {
            feedback.textContent = res.message;
            feedback.className = "mt-4 text-center text-sm text-red-600";
            btn.disabled = false;
            btn.textContent = "Verify Identity";
        }
    },

    resetVerification: () => {
        document.getElementById('form-aadhaar').classList.remove('hidden');
        document.getElementById('form-otp').classList.add('hidden');
        document.getElementById('input-otp').value = "";
        document.getElementById('verify-feedback').textContent = "";
    },

    // Profile Logic
    prefillProfile: (userData) => {
        document.getElementById('profile-name').value = userData.name;
        document.getElementById('profile-state').value = userData.state;
    },

    handleProfileSubmit: (e) => {
        e.preventDefault();
        const profile = {
            name: document.getElementById('profile-name').value,
            state: document.getElementById('profile-state').value,
            district: document.getElementById('profile-district').value,
            educationLevel: document.getElementById('profile-edu').value,
            incomeRange: document.getElementById('profile-income').value,
        };
        app.state.userProfile = profile;
        app.renderDashboardData();
        app.router('DASHBOARD');
    },

    // Dashboard Logic
    renderDashboardData: () => {
        const profile = app.state.userProfile;
        const scholarships = RuleEngine.getScholarships(profile);
        const courses = RuleEngine.getCourses(profile);
        const nextSteps = RuleEngine.getNextSteps(profile.educationLevel);

        // Header Stats
        document.getElementById('dash-welcome').textContent = `Welcome back, ${profile.name}`;
        document.getElementById('dash-subtitle').textContent = `Education: ${profile.educationLevel} • Domicile: ${profile.state}`;
        document.getElementById('dash-scholarship-count').textContent = scholarships.length;
        document.getElementById('dash-course-count').textContent = courses.length;

        // Journey
        document.getElementById('dash-current-stage').textContent = profile.educationLevel;
        const stepsHtml = nextSteps.map(step => `
            <li class="bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-lg border border-blue-100 flex items-center justify-between">
                ${step} <i data-lucide="chevron-right" class="w-3 h-3 opacity-50"></i>
            </li>
        `).join('');
        document.getElementById('dash-next-steps').innerHTML = stepsHtml;

        // Scholarships
        const schList = document.getElementById('scholarships-list');
        if(scholarships.length === 0) {
            schList.innerHTML = `<div class="col-span-2 text-center p-8 bg-gray-50 rounded text-gray-500">No matching scholarships.</div>`;
        } else {
            schList.innerHTML = scholarships.map(s => `
                <div class="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
                    <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded mb-2 inline-block">${s.provider}</span>
                    <h3 class="font-bold text-gray-900 mb-1">${s.name}</h3>
                    <div class="text-2xl font-bold text-gov-blue my-2">${s.amount}</div>
                    <p class="text-xs text-gray-500 mb-4">${s.desc}</p>
                    <div class="flex justify-between items-center text-xs font-medium border-t pt-3">
                        <span class="text-red-600">Deadline: ${s.deadline}</span>
                        <button class="text-gov-blue flex items-center gap-1">Apply <i data-lucide="external-link" class="w-3 h-3"></i></button>
                    </div>
                </div>
            `).join('');
        }

        // Courses
        const courseList = document.getElementById('courses-list');
        courseList.innerHTML = courses.map(c => `
             <div class="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-gov-blue font-bold text-xs">
                        ${c.platform.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900">${c.title}</h4>
                        <div class="flex gap-3 text-xs text-gray-500 mt-1">
                            <span>${c.platform}</span> • <span>${c.duration}</span> •
                            <span class="${c.cert ? 'text-green-600' : ''}">${c.cert ? 'Certificate' : 'Audit'}</span>
                        </div>
                    </div>
                </div>
                <button class="px-4 py-2 border border-gov-blue text-gov-blue rounded-lg text-sm font-medium hover:bg-blue-50">Enroll</button>
            </div>
        `).join('');

        lucide.createIcons();
    },

    logout: () => {
        app.state.userProfile = null;
        app.state.verificationData = null;
        app.resetVerification();
        app.router('LANDING');
    }
};

// Start App
window.addEventListener('DOMContentLoaded', app.init);