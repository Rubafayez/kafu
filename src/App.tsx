import React, { useState, useEffect, useMemo } from 'react';
import { CompanyProject, Department, Employee, JobRole, PromotionCriteria } from './types';
import { INITIAL_EMPLOYEES, INITIAL_OPEN_ROLES, INITIAL_PROJECTS } from './data/initialData';
import { buildAllTeamInsights, DEFAULT_PROMOTION_CRITERIA, DEPARTMENTS } from './utils/teamInsights';
import { allCompanySkills } from './utils/projectTeam';
import { Navbar, TabType } from './components/layout/Navbar';
import { HomeScreen } from './components/home/HomeScreen';
import { EmployeesListScreen } from './components/employees/EmployeesListScreen';
import { EmployeeProfileModal } from './components/employee/EmployeeProfileModal';
import { DataSettingsModal } from './components/data/DataSettingsModal';
import { TeamScreen, TeamTab } from './components/team/TeamScreen';
import { CriteriaModal } from './components/criteria/CriteriaModal';
import { PromotionsScreen } from './components/promotions/PromotionsScreen';
import { ProjectsScreen } from './components/projects/ProjectsScreen';
import { ExternalCandidate } from './utils/externalCandidates';
import { WelcomeGuide } from './components/guide/WelcomeGuide';

// عند تغيّر البيانات التجريبية نرفع هذا الرقم، فيُمسح ما حُفظ في المتصفح من النسخة السابقة تلقائياً
// حتى لا تبقى مشاريع أو مرشحون قدامى يخفون التحديث. يُنفَّذ قبل قراءة أي بيانات محفوظة.
const DATA_VERSION = '4';
if (localStorage.getItem('jahez_data_version') !== DATA_VERSION) {
  [
    'jahez_employees',
    'jahez_added_employees',
    'jahez_external_hires',
    'jahez_custom_roles',
    'jahez_projects_v2',
    'jahez_promotion_criteria',
  ].forEach(key => localStorage.removeItem(key));
  localStorage.setItem('jahez_data_version', DATA_VERSION);
  // لو التطبيق معروض أصلاً (تحديث حيّ للكود) فحالته القديمة في الذاكرة ستُحفظ من جديد، فنعيد التحميل
  if (document.getElementById('root')?.hasChildNodes()) window.location.reload();
}

export default function App() {
  // Persistent or initial state
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('jahez_employees');
    if (saved) {
      try {
        const parsed: Employee[] = JSON.parse(saved);
        // البيانات التجريبية تُؤخذ دائماً من الكود حتى لا تبقى نسخة قديمة منها في المتصفح
        if (parsed[0]?.id !== INITIAL_EMPLOYEES[0].id) return parsed;
      } catch (e) {
        console.error('Failed to parse saved employees:', e);
      }
    }
    return INITIAL_EMPLOYEES;
  });

  // موظفون أضافهم المدير (من سيرة ذاتية أو يدوياً): يُحفظون منفصلين ويُدمجون مع البقية
  const [addedEmployees, setAddedEmployees] = useState<Employee[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jahez_added_employees') || '[]');
    } catch (e) {
      console.error('Failed to parse added employees:', e);
      return [];
    }
  });
  const allEmployees = useMemo(() => [...employees, ...addedEmployees], [employees, addedEmployees]);

  // مرشحو لينكدإن لكل مشروع وحالتهم (رُشّح، وُظّف، صار موظفاً)
  const [externalHires, setExternalHires] = useState<Record<string, ExternalCandidate[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem('jahez_external_hires') || '{}');
    } catch (e) {
      console.error('Failed to parse external hires:', e);
      return {};
    }
  });
  // من وُظّفوا ولم يُكمل ملفهم بعد: يظهرون في صفحة الموظفين
  const pendingHires = useMemo(
    () => Object.values(externalHires).flat().filter(c => c.status === 'hired'),
    [externalHires]
  );
  const companySkills = useMemo(() => allCompanySkills(allEmployees), [allEmployees]);

  // وظائف الشركة: مهاراتها هي ما يحتاجه كل فريق، وهي نفسها وظائف الترقية. المضافة يدوياً تُحفظ في المتصفح.
  const [customRoles, setCustomRoles] = useState<JobRole[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jahez_custom_roles') || '[]');
    } catch (e) {
      console.error('Failed to parse saved roles:', e);
      return [];
    }
  });
  const roles = useMemo(() => [...customRoles, ...INITIAL_OPEN_ROLES], [customRoles]);

  // المشاريع: التجريبي من الكود، والمضافة تُحفظ في المتصفح
  const [projects, setProjects] = useState<CompanyProject[]>(() => {
    try {
      const saved = localStorage.getItem('jahez_projects_v2');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch (e) {
      console.error('Failed to parse saved projects:', e);
      return INITIAL_PROJECTS;
    }
  });

  const [criteria, setCriteria] = useState<PromotionCriteria>(() => {
    const saved = localStorage.getItem('jahez_promotion_criteria');
    if (saved) {
      try {
        return { ...DEFAULT_PROMOTION_CRITERIA, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse saved promotion criteria:', e);
      }
    }
    return DEFAULT_PROMOTION_CRITERIA;
  });

  // Navigation and UI Modals State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [teamTab, setTeamTab] = useState<TeamTab>('work');
  const [selectedEmployeeForProfile, setSelectedEmployeeForProfile] = useState<Employee | null>(null);
  const [isDataSettingsModalOpen, setIsDataSettingsModalOpen] = useState(false);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // يرجّع كل شيء للبيانات التجريبية الأصلية، ويبقي الوضع الليلي ودليل البداية كما هما
  const resetData = () => {
    [
      'jahez_employees',
      'jahez_added_employees',
      'jahez_external_hires',
      'jahez_custom_roles',
      'jahez_projects_v2',
      'jahez_promotion_criteria',
    ].forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };
  // الدليل يظهر تلقائياً في أول زيارة فقط
  const [isGuideOpen, setIsGuideOpen] = useState(() => localStorage.getItem('jahez_guide_seen') !== '1');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('jahez_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('jahez_added_employees', JSON.stringify(addedEmployees));
  }, [addedEmployees]);

  useEffect(() => {
    localStorage.setItem('jahez_external_hires', JSON.stringify(externalHires));
  }, [externalHires]);

  useEffect(() => {
    localStorage.setItem('jahez_promotion_criteria', JSON.stringify(criteria));
  }, [criteria]);

  useEffect(() => {
    localStorage.setItem('jahez_custom_roles', JSON.stringify(customRoles));
  }, [customRoles]);

  useEffect(() => {
    localStorage.setItem('jahez_projects_v2', JSON.stringify(projects));
  }, [projects]);

  const teams = useMemo(() => buildAllTeamInsights(allEmployees, roles, criteria), [allEmployees, roles, criteria]);
  const selectedTeam = teams.find(t => t.department === selectedDepartment) || null;
  const usingSampleData = employees[0]?.id === INITIAL_EMPLOYEES[0].id;
  const selectedEvaluation =
    teams.flatMap(t => t.evaluations).find(e => e.employee.id === selectedEmployeeForProfile?.id) || null;

  const handleCloseGuide = () => {
    localStorage.setItem('jahez_guide_seen', '1');
    setIsGuideOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col" dir="rtl">
      <Navbar
        activeTab={activeTab}
        setActiveTab={tab => {
          setSelectedDepartment(null);
          setActiveTab(tab);
        }}
        onOpenDataSettings={() => setIsDataSettingsModalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onResetData={() => setIsResetOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10">
        {selectedTeam ? (
          /* Team screen: missing skills first, promotions second */
          <TeamScreen
            team={selectedTeam}
            initialTab={teamTab}
            onBack={() => setSelectedDepartment(null)}
            onSelectEmployee={emp => setSelectedEmployeeForProfile(emp)}
          />
        ) : activeTab === 'home' ? (
          <HomeScreen
            employees={allEmployees}
            teams={teams}
            usingSampleData={usingSampleData}
            onOpenTeam={(department, tab = 'work') => {
              setTeamTab(tab);
              setSelectedDepartment(department);
              window.scrollTo({ top: 0 });
            }}
            onOpenDataSettings={() => setIsDataSettingsModalOpen(true)}
          />
        ) : activeTab === 'projects' ? (
          <ProjectsScreen
            projects={projects}
            employees={allEmployees}
            onAddProject={project => setProjects(prev => [project, ...prev])}
            onDeleteProject={id => setProjects(prev => prev.filter(p => p.id !== id))}
            onSelectEmployee={emp => setSelectedEmployeeForProfile(emp)}
            externalHires={externalHires}
            onChangeExternalHires={setExternalHires}
            onCompleteHire={() => {
              setActiveTab('employees');
              window.scrollTo({ top: 0 });
            }}
          />
        ) : activeTab === 'promotions' ? (
          <PromotionsScreen
            roles={roles}
            teams={teams}
            onAddRole={role => setCustomRoles(prev => [role, ...prev])}
            onDeleteRole={id => setCustomRoles(prev => prev.filter(r => r.id !== id))}
            onSelectEmployee={emp => setSelectedEmployeeForProfile(emp)}
            onEditCriteria={() => setIsCriteriaModalOpen(true)}
          />
        ) : (
          <EmployeesListScreen
            teams={teams}
            departments={DEPARTMENTS}
            companySkills={companySkills}
            onAddEmployee={employee => setAddedEmployees(prev => [...prev, employee])}
            pendingHires={pendingHires}
            onOnboardHire={(candidateId, employee) => {
              setAddedEmployees(prev => [...prev, employee]);
              setExternalHires(prev =>
                Object.fromEntries(
                  Object.entries(prev).map(([projectId, list]) => [
                    projectId,
                    list.map(c => (c.id === candidateId ? { ...c, status: 'onboarded' as const } : c)),
                  ])
                )
              );
            }}
            onSelectEmployee={emp => setSelectedEmployeeForProfile(emp)}
          />
        )}
      </main>

      <EmployeeProfileModal
        employee={selectedEmployeeForProfile}
        evaluation={selectedEvaluation}
        onClose={() => setSelectedEmployeeForProfile(null)}
        onDelete={id => {
          setAddedEmployees(prev => prev.filter(e => e.id !== id));
          setSelectedEmployeeForProfile(null);
        }}
      />

      <DataSettingsModal
        isOpen={isDataSettingsModalOpen}
        onClose={() => setIsDataSettingsModalOpen(false)}
        employees={employees}
        onUpdateEmployees={setEmployees}
      />

      {/* تأكيد إعادة البيانات: نافذة داخل التطبيق لأن نوافذ المتصفح الجاهزة تُحجب داخل المعاينات المضمّنة */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full text-right p-6 space-y-4">
            <h2 className="type-2 plain-title text-slate-900">إعادة البيانات التجريبية؟</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              يُحذف كل ما أضفته أو عدّلته: الموظفون الجدد، مرشحو لينكدإن، المشاريع، الترقيات، والمعايير.
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetData}
                className="flex-1 min-h-[48px] bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-base"
              >
                أعد البيانات
              </button>
              <button
                onClick={() => setIsResetOpen(false)}
                className="min-h-[48px] px-5 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <CriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        criteria={criteria}
        onSave={setCriteria}
      />

      <WelcomeGuide isOpen={isGuideOpen} onClose={handleCloseGuide} />
    </div>
  );
}
