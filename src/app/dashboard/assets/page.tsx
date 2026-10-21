'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  HardDrive,
  Upload,
  Search,
  Video,
  Image as ImageIcon,
  Mic,
  Trash2,
  ExternalLink,
  Plus,
  Play,
  Clock,
  Filter,
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
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  const filteredAssets = assets
    .filter((a) => (filterType === 'all' ? true : a.assetType === filterType))
    .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Asset Library</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Uploaded reference footage, generated media, textures, and background sound files.
              </p>
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Add / Upload Asset</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12141A] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>

            <div className="flex gap-2 self-start sm:self-auto">
              {['all', 'video', 'image', 'audio'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterType === t ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Grid */}
          {filteredAssets.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-panel border border-white/5">
              <HardDrive className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-white text-base">No assets found</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Upload creative media or generate content to automatically store it in your workspace.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl glass-panel border border-white/10 overflow-hidden group hover:border-violet-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square relative overflow-hidden bg-black/50">
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
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-indigo-950/20 text-indigo-400">
                          <Mic className="w-12 h-12 mb-2" />
                          <span className="text-xs font-mono text-center truncate w-full">{asset.name}</span>
                        </div>
                      )}

                      <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-violet-300 uppercase">
                        {asset.assetType}
                      </span>
                    </div>

                    <div className="p-3.5">
                      <h4 className="font-bold text-white text-xs truncate" title={asset.name}>
                        {asset.name}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                        <span>{(asset.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                        <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-white/5 bg-[#0C0E14] flex items-center justify-between text-xs">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(asset.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Modal */}
          {uploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#12141A] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <h3 className="font-bold text-white text-base">Add Asset to Workspace</h3>

                <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">Asset Name</label>
                    <input
                      type="text"
                      required
                      value={uploadName}
                      onChange={(e) => setUploadName(e.target.value)}
                      placeholder="Product Commercial Reference.png"
                      className="w-full bg-[#0E1017] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">Media Type</label>
                    <select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value as any)}
                      className="w-full bg-[#0E1017] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs"
                    >
                      <option value="video">Video (MP4)</option>
                      <option value="image">Image (PNG/JPG)</option>
                      <option value="audio">Audio (MP3/WAV)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">Direct URL / Cloud Link</label>
                    <input
                      type="url"
                      required
                      value={uploadUrl}
                      onChange={(e) => setUploadUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#0E1017] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setUploadModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white"
                    >
                      Save Asset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
