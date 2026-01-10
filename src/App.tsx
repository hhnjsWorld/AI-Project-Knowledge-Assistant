import { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import ProjectList from './components/projects/ProjectList';
import ProjectDetail from './components/projects/ProjectDetail';
import KnowledgeBase from './components/knowledge/KnowledgeBase';
import Settings from './components/settings/Settings';
import { Project } from './types';

type View = 'login' | 'dashboard' | 'projects' | 'project-detail' | 'knowledge' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-white">
      {currentView !== 'login' && (
        <aside className="w-64 border-r border-gray-200 bg-gray-50">
          <div className="p-6">
            <h1 className="font-semibold text-gray-900">KnowledgeHub</h1>
            <p className="text-xs text-gray-500 mt-1">AI Knowledge Assistant</p>
          </div>
          
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                currentView === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-gray-900'
              }`}
            >
              工作台
            </button>
            <button
              onClick={() => setCurrentView('projects')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                currentView === 'projects' || currentView === 'project-detail'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-gray-900'
              }`}
            >
              项目空间
            </button>
            <button
              onClick={() => setCurrentView('knowledge')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                currentView === 'knowledge'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-gray-900'
              }`}
            >
              知识库
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                currentView === 'settings'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-gray-900'
              }`}
            >
              设置
            </button>
          </nav>
        </aside>
      )}

      <main className="flex-1 overflow-auto">
        {currentView === 'dashboard' && <Dashboard onSelectProject={handleSelectProject} />}
        {currentView === 'projects' && <ProjectList onSelectProject={handleSelectProject} />}
        {currentView === 'project-detail' && selectedProject && (
          <ProjectDetail project={selectedProject} />
        )}
        {currentView === 'knowledge' && <KnowledgeBase />}
        {currentView === 'settings' && <Settings />}
      </main>
    </div>
  );
}
