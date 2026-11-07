"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Trash2, Database, Search, Shield, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DEMO_DOCS = [
  { id: 1, name: "Return_Policy_2025.pdf", type: "Policy", size: "1.2 MB", date: "Oct 12, 2025", chunks: 24 },
  { id: 2, name: "Supplier_Agreements.docx", type: "Contract", size: "3.4 MB", date: "Sep 28, 2025", chunks: 56 },
  { id: 3, name: "Employee_Handbook.pdf", type: "HR", size: "5.1 MB", date: "Aug 15, 2025", chunks: 112 },
];

export default function DocumentsPage() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#8B5CF6]/10 to-[#3B82F6]/10 rounded-full mb-3">
            <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-xs font-bold text-[#111827]">RAG Knowledge Base</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#111827]">Business Documents</h1>
          <p className="text-[#6B7280] mt-1">Upload files here. The AI Assistant will read them to answer your questions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="md:col-span-1">
          <div 
            className={`card-static p-8 border-2 border-dashed flex flex-col items-center justify-center text-center h-full transition-colors ${
              isDragging ? 'border-[#8B5CF6] bg-[#8B5CF6]/5' : 'border-[#D1D5DB] hover:border-[#8B5CF6]/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          >
            <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Upload Document</h3>
            <p className="text-sm text-[#6B7280] mb-6">Drag and drop your PDF, DOCX, or TXT files here.</p>
            <button className="btn-secondary !px-6 bg-white w-full justify-center text-[#8B5CF6] border-[#8B5CF6]/20 hover:bg-[#8B5CF6] hover:text-white">
              Browse Files
            </button>
            <p className="text-xs text-[#9CA3AF] mt-4 flex items-center gap-1 justify-center">
              <Shield className="w-3 h-3" /> Encrypted & Private
            </p>
          </div>
        </motion.div>

        {/* Document List */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="md:col-span-2 card-static overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between bg-[#F9F7F4]/50">
            <h3 className="font-bold text-[#111827]">Knowledge Base</h3>
            <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <Database className="w-3.5 h-3.5" /> 192 Chunks Indexed
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-[rgba(0,0,0,0.04)]">
              {DEMO_DOCS.map((doc) => (
                <li key={doc.id} className="p-5 hover:bg-[#F9F7F4]/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-[rgba(0,0,0,0.05)]">
                      <FileText className="w-5 h-5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827]">{doc.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7280]">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-xs font-semibold text-[#111827]">{doc.chunks} vectors</span>
                      <span className="text-[10px] text-[#10B981]">Processed</span>
                    </div>
                    <button className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="card-static p-6 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent border-l-4 border-l-[#8B5CF6]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Search className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h4 className="font-bold text-[#111827] mb-1">Try asking the AI Assistant</h4>
            <p className="text-sm text-[#6B7280]">"What is our return policy for electronics?" or "Summarize the employee vacation days." The AI will instantly search these documents to answer.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
