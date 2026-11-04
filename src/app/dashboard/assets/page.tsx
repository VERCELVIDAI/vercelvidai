'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  HardDrive,
  Upload,
  Search,
  Mic,
  Trash2,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Plus,
  Play,
  Download,
  X,
} from 'lucide-react';

export default function AssetLibraryPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadType, setUploadType] = useState<'video' | 'image' | 'audio'>('image');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      const [authRes, assetsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/assets'),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (assetsRes.ok) {
        const a = await assetsRes.json();
        setAssets(a.assets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName || !uploadUrl) return;

    try {
      await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploadName,
          url: uploadUrl,
          assetType: uploadType,
        }),
      });

      setUploadModalOpen(false);
      setUploadName('');
      setUploadUrl('');
      fetchAssets();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchAssets();
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  const filteredAssets = assets
    .filter((a) => (filterType === 'all' ? true : a.assetType === filterType))
    .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#F7F8FA] text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#F7F8FA] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#5145CD]" />
                <h1 className="text-xl font-bold text-[#17191D]">Media Asset Vault</h1>
              </div>
              <p className="mt-1 text-xs text-[#667085]">
                Uploaded reference footage, synthesized audio tracks, textures, and video files.
              </p>
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Add / Upload Asset</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F8FA] text-[#17191D] pl-10 pr-4 py-2 rounded-xl text-xs border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:bg-white placeholder:text-[#667085]/60 font-medium"
              />
            </div>

            <div className="flex gap-1.5 self-start sm:self-auto">
              {['all', 'video', 'image', 'audio'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    filterType === t
                      ? 'bg-[#5145CD] text-white shadow-xs'
                      : 'bg-[#F7F8FA] text-[#667085] hover:text-[#17191D] border border-[#E5E7EB]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Grid */}
          {filteredAssets.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
              <HardDrive className="w-12 h-12 text-[#667085]/40 mx-auto" />
              <h3 className="font-bold text-[#17191D] text-base">No Assets in Vault</h3>
              <p className="mt-1 text-xs text-[#667085] max-w-sm mx-auto">
                Upload creative media or generate content to automatically store it in your workspace.
              </p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Media</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden group hover:border-[#5145CD]/40 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="aspect-square relative overflow-hidden bg-[#17191D]">
                      {asset.assetType === 'video' ? (
                        <video
                          src={asset.url}
                          muted
                          playsInline
                          loop
                          className="w-full h-full object-cover"
                        />
                      ) : asset.assetType === 'image' ? (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#F7F8FA] text-[#5145CD]">
                          <Mic className="w-12 h-12 mb-2" />
                          <span className="text-xs font-mono text-center truncate w-full px-2 text-[#17191D]">{asset.name}</span>
                        </div>
                      )}

                      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white border border-white/10">
                        {asset.assetType}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h4 className="font-bold text-[#17191D] text-xs truncate group-hover:text-[#5145CD] transition-colors">
                        {asset.name}
                      </h4>
                      <p className="text-[10px] text-[#667085] font-mono">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#5145CD] hover:text-[#4338CA] flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View File</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 text-[#667085] hover:text-rose-600 rounded-lg hover:bg-[#F1F3F5] cursor-pointer transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#17191D] text-sm">Add Media Asset to Vault</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-[#667085] hover:text-[#17191D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#17191D] font-bold mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Product Angle 1"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full bg-[#F7F8FA] text-[#17191D] p-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#17191D] font-bold mb-1">Asset URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full bg-[#F7F8FA] text-[#17191D] p-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#17191D] font-bold mb-1">Media Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['image', 'video', 'audio'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadType(t)}
                      className={`py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                        uploadType === t
                          ? 'bg-[#5145CD] text-white shadow-xs'
                          : 'bg-[#F7F8FA] text-[#667085] border border-[#E5E7EB] hover:text-[#17191D]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#667085] hover:text-[#17191D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
