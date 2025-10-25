'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Document {
  id: number;
  documentType: string;
  createdAt: string;
  documentData: string;
}

export default function UserDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDocuments: 0 });
  const [filterType, setFilterType] = useState<string>('all');
  const [view, setView] = useState<'documents' | 'profile' | 'settings'>('documents');
  const { accessToken, user, logout } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (accessToken) {
      loadDocuments();
      loadStats();
    }
  }, [accessToken]);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredDocs(documents);
    } else {
      setFilteredDocs(documents.filter(d => d.documentType === filterType));
    }
  }, [filterType, documents]);

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

  const downloadDocument = async (id: number, type: string) => {
    try {
      const response = await fetch(`${API_URL}/api/documents/${id}/download`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error('Failed to download', error);
      alert('Download failed');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">DocuRight AI</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setView('documents')}
                className={`px-4 py-2 rounded ${view === 'documents' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Documents
              </button>
              <button
                onClick={() => setView('profile')}
                className={`px-4 py-2 rounded ${view === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setView('settings')}
                className={`px-4 py-2 rounded ${view === 'settings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Settings
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              New Document
            </a>
            <button onClick={logout} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Documents View */}
        {view === 'documents' && (
          <>
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
                <p className="text-gray-600 text-sm">Account Type</p>
                <p className="text-xl font-semibold text-gray-900">Free</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Document History</h2>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="nda">NDA</option>
                  <option value="offer">Offer Letter</option>
                </select>
              </div>
              <div className="divide-y">
                {filteredDocs.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No documents yet. Generate your first document!
                  </div>
                ) : (
                  filteredDocs.map(doc => (
                    <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📄</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{doc.documentType.toUpperCase()}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(doc.createdAt).toLocaleDateString()} at {new Date(doc.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadDocument(doc.id, doc.documentType)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Download
                        </button>
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
          </>
        )}

        {/* Profile View */}
        {view === 'profile' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={user?.fullName || ''}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <span className={`px-3 py-1 rounded-full text-sm ${user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {user?.emailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auth Provider</label>
                <p className="text-gray-900">{user?.authProvider}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Email notifications for new documents</span>
                </label>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-2">Privacy</h3>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Save document history</span>
                </label>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h3>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}