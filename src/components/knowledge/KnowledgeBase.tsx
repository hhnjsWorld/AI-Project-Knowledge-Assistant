// import { Upload, FileText, CheckCircle, Loader, AlertCircle } from 'lucide-react';
// import { Document } from '../../types';

// const documents: Document[] = [
//   {
//     id: '1',
//     name: '技术选型文档.pdf',
//     status: 'searchable',
//     source: 'Google Drive',
//     uploadDate: '2024-01-05',
//   },
//   {
//     id: '2',
//     name: '架构设计方案.md',
//     status: 'searchable',
//     source: 'Notion',
//     uploadDate: '2024-01-04',
//   },
//   {
//     id: '3',
//     name: '产品需求文档 v2.3.docx',
//     status: 'processing',
//     source: '本地上传',
//     uploadDate: '2024-01-08',
//   },
//   {
//     id: '4',
//     name: '会议纪要_0103.txt',
//     status: 'searchable',
//     source: '本地上传',
//     uploadDate: '2024-01-03',
//   },
//   {
//     id: '5',
//     name: '设计规范 2024.pdf',
//     status: 'uploading',
//     source: 'Figma',
//     uploadDate: '2024-01-08',
//   },
// ];

// const statusConfig = {
//   uploading: {
//     icon: Loader,
//     label: '上传中',
//     color: 'text-blue-600',
//     bgColor: 'bg-blue-50',
//   },
//   processing: {
//     icon: Loader,
//     label: '向量化中',
//     color: 'text-yellow-600',
//     bgColor: 'bg-yellow-50',
//   },
//   searchable: {
//     icon: CheckCircle,
//     label: '可检索',
//     color: 'text-green-600',
//     bgColor: 'bg-green-50',
//   },
// };

// export default function KnowledgeBase() {
//   return (
//     <div className="max-w-7xl mx-auto p-8">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl text-gray-900 mb-1">知识库11</h1>
//           <p className="text-gray-500">管理所有项目文档与知识资源</p>
//         </div>
//       </div>

//       {/* Upload Area */}
//       <div className="mb-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50">
//         <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//         <p className="text-gray-700 mb-1">拖拽文件到此处上传</p>
//         <p className="text-sm text-gray-500">
//           支持 PDF, Word, Markdown, Text 等格式
//         </p>
//         <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
//           选择文件
//         </button>
//       </div>

//       {/* Documents Table */}
//       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase">
//                 文档名称
//               </th>
//               <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase">
//                 状态
//               </th>
//               <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase">
//                 来源
//               </th>
//               <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase">
//                 上传日期
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {documents.map((doc) => {
//               const status = statusConfig[doc.status];
//               const StatusIcon = status.icon;
              
//               return (
//                 <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <FileText className="w-5 h-5 text-gray-400" />
//                       <span className="text-sm text-gray-900">{doc.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bgColor} ${status.color}`}
//                     >
//                       <StatusIcon
//                         className={`w-3 h-3 ${
//                           doc.status === 'uploading' || doc.status === 'processing'
//                             ? 'animate-spin'
//                             : ''
//                         }`}
//                       />
//                       {status.label}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {doc.source}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {doc.uploadDate}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Info Box */}
//       <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
//         <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//         <div className="text-sm text-blue-900">
//           <p className="mb-1">文档处理说明</p>
//           <ul className="text-blue-700 space-y-1 list-disc list-inside">
//             <li>文档上传后会自动进行文本提取和向量化处理</li>
//             <li>处理完成后即可在对话中被检索和引用</li>
//             <li>支持多种格式，最大单文件 50MB</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
