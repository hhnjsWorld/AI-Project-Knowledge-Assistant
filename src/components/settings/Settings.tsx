import { Users, Shield, Settings as SettingsIcon } from 'lucide-react';

const teamMembers = [
  { id: '1', name: '张三', email: 'zhangsan@company.com', role: '管理员' },
  { id: '2', name: '李四', email: 'lisi@company.com', role: '编辑者' },
  { id: '3', name: '王五', email: 'wangwu@company.com', role: '成员' },
  { id: '4', name: '赵六', email: 'zhaoliu@company.com', role: '成员' },
];

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl text-gray-900 mb-6">设置</h1>

      {/* Team Members */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg text-gray-900">团队成员</h2>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase">
                  成员
                </th>
                <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase">
                  角色
                </th>
                <th className="text-right px-6 py-3 text-xs text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{member.role}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      编辑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          邀请成员
        </button>
      </section>

      {/* Permissions */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg text-gray-900">权限与角色</h2>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm text-gray-900 mb-1">管理员</h3>
            <p className="text-sm text-gray-500">
              完全访问权限，可管理团队、项目和所有设置
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm text-gray-900 mb-1">编辑者</h3>
            <p className="text-sm text-gray-500">
              可创建、编辑项目和文档，无法管理团队成员
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm text-gray-900 mb-1">成员</h3>
            <p className="text-sm text-gray-500">
              只读权限，可查看项目和参与对话
            </p>
          </div>
        </div>
      </section>

      {/* AI Model Settings */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg text-gray-900">模型配置</h2>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                AI 模型
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                向量数据库
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option>Pinecone</option>
                <option>Weaviate</option>
                <option>Qdrant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                检索相关度阈值
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>宽松</span>
                <span>严格</span>
              </div>
            </div>
          </div>
          
          <button className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            保存配置
          </button>
        </div>
      </section>
    </div>
  );
}
