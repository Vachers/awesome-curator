'use client';

import { useState, useEffect } from 'react';

interface Repo {
  id: number;
  githubId: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  topics: string[];
  stars: number | null;
  forks: number | null;
  categoryId: number | null;
  category: Category | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  emoji: string | null;
  color: string | null;
}

interface Stats {
  total: number;
  uncategorized: number;
  languages: string[];
  totalStars: number;
}

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [reposRes, categoriesRes] = await Promise.all([
        fetch('/api/repos'),
        fetch('/api/categories'),
      ]);

      const reposData = await reposRes.json();
      const categoriesData = await categoriesRes.json();

      setRepos(reposData.repos);
      setStats(reposData.stats);
      setCategories(categoriesData.categories);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch('/api/repos/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  }

  async function handleCategoryChange(repoId: number, categoryId: string) {
    try {
      await fetch(`/api/repos/${repoId}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: categoryId || null }),
      });
      await fetchData();
    } catch (error) {
      console.error('Update error:', error);
    }
  }

  async function handleExport() {
    try {
      const res = await fetch('/api/awesome-lists/export');
      const data = await res.json();

      // Download markdown file
      const blob = new Blob([data.markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AWESOME.md';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  }

  async function handleInitCategories() {
    try {
      await fetch('/api/categories', { method: 'POST' });
      await fetchData();
    } catch (error) {
      console.error('Init error:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Awesome Curator</h1>
          <p className="text-gray-600">Organize your GitHub repositories into awesome lists</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-gray-600">Total Repos</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-orange-500">{stats.uncategorized}</div>
              <div className="text-gray-600">Uncategorized</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold">{stats.languages.length}</div>
              <div className="text-gray-600">Languages</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-yellow-500">{stats.totalStars}</div>
              <div className="text-gray-600">Total Stars</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : '🔄 Sync from GitHub'}
          </button>

          {categories.length === 0 && (
            <button
              onClick={handleInitCategories}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600"
            >
              📁 Initialize Categories
            </button>
          )}

          <button
            onClick={handleExport}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600"
          >
            📥 Export Awesome List
          </button>
        </div>

        {/* Repos Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Repository</th>
                <th className="text-left p-4">Language</th>
                <th className="text-left p-4">Stars</th>
                <th className="text-left p-4">Category</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((repo) => (
                <tr key={repo.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                      )}
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {repo.topics.map((topic) => (
                            <span
                              key={topic}
                              className="text-xs bg-gray-200 px-2 py-1 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {repo.language && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {repo.language}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {repo.stars && <span>⭐ {repo.stars}</span>}
                  </td>
                  <td className="p-4">
                    <select
                      value={repo.categoryId || ''}
                      onChange={(e) => handleCategoryChange(repo.id, e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
