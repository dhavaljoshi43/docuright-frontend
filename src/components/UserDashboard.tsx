'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Document {
  id: number;
  documentType: string;
  createdAt: string;
  documentData: string;
}

export default function UserDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDocuments: 0 });
  const { accessToken, user } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (accessToken) {
      loadDocuments();
      loadStats();
    }
  }, [accessToken]);

  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/documents`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to load documents', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/documents/stats`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const deleteDocument = async (id: number) => {
    if (!confirm('Delete this document?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        loadDocuments();
        loadStats();
      }
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.fullName || user?.email}</p>
          </div>
          <Link
            href="/"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          >
            Generate New Document
          </Link>
        </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Documents</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalDocuments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">This Month</p>
          <p className="text-3xl font-bold text-green-600">{documents.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Account Status</p>
          <p className="text-xl font-semibold text-gray-900">Active</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Document History</h2>
        </div>
        <div className="divide-y">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No documents yet. Generate your first document!
            </div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.documentType.toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}