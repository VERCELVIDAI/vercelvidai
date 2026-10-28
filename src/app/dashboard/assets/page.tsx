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
      <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  const filteredAssets = assets
    .filter((a) => (filterType === 'all' ? true : a.assetType === filterType))
    .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden bg-[#100A12] text-[#F5EAF4] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#100A12]">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#211522] border border-[#39233B] shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#F05BCE]" />
                <h1 className="text-xl font-black text-[#F5EAF4]">Media Asset Vault</h1>
              </div>
              <p className="mt-1 text-xs text-[#A99AAA]">
                Uploaded reference footage, synthesized audio tracks, textures, and video files.
              </p>
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-[rgba(240,91,206,0.25)] shrink-0 transition-all cursor-pointer border border-white/10 self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Add / Upload Asset</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#211522] border border-[#39233B] p-3 rounded-2xl shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#A99AAA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#100A12] text-[#F5EAF4] pl-10 pr-4 py-2 rounded-xl text-xs border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder:text-[#A99AAA]/50 font-medium"
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
                      ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white shadow-xs'
                      : 'bg-[#100A12] text-[#A99AAA] hover:text-white border border-[#39233B]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Grid */}
          {filteredAssets.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#211522] border border-[#39233B] space-y-3 shadow-xl">
              <HardDrive className="w-12 h-12 text-[#A99AAA]/40 mx-auto" />
              <h3 className="font-bold text-[#F5EAF4] text-base">No Assets in Vault</h3>
              <p className="mt-1 text-xs text-[#A99AAA] max-w-sm mx-auto">
                Upload creative media or generate content to automatically store it in your workspace.
              </p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white font-bold text-xs shadow cursor-pointer"
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
                  className="rounded-3xl bg-[#211522] border border-[#39233B] overflow-hidden group hover:border-[#F05BCE]/40 hover:bg-[#2A1B2C] transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="aspect-square relative overflow-hidden bg-black">
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
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#100A12] text-[#F05BCE]">
                          <Mic className="w-12 h-12 mb-2" />
                          <span className="text-xs font-mono text-center truncate w-full px-2 text-[#F5EAF4]">{asset.name}</span>
                        </div>
                      )}

                      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#F5EAF4] border border-[#39233B]">
                        {asset.assetType}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h4 className="font-bold text-[#F5EAF4] text-xs truncate group-hover:text-[#F05BCE] transition-colors">
                        {asset.name}
                      </h4>
                      <p className="text-[10px] text-[#A99AAA] font-mono">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 pt-2 border-t border-[#39233B] flex items-center justify-between">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#F05BCE] hover:brightness-125 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View File</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 text-[#A99AAA] hover:text-rose-400 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#211522] border border-[#39233B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#F5EAF4] text-sm">Add Media Asset to Vault</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-[#A99AAA] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#F5EAF4] font-bold mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Product Angle 1"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full bg-[#100A12] text-[#F5EAF4] p-2.5 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE]"
                />
              </div>

              <div>
                <label className="block text-[#F5EAF4] font-bold mb-1">Asset URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full bg-[#100A12] text-[#F5EAF4] p-2.5 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE]"
                />
              </div>

              <div>
                <label className="block text-[#F5EAF4] font-bold mb-1">Media Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['image', 'video', 'audio'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadType(t)}
                      className={`py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                        uploadType === t
                          ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white shadow-xs'
                          : 'bg-[#100A12] text-[#A99AAA] border border-[#39233B] hover:text-white'
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
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A99AAA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white shadow"
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
