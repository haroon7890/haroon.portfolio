"use client";

import { useEffect, useState } from "react";

interface GitHubUser {
  followers: number;
  public_repos: number;
  name: string;
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubStats() {
      try {
        const response = await fetch("https://api.github.com/users/haroon7890");
        if (response.ok) {
          const data = await response.json();
          setStats({
            followers: data.followers,
            public_repos: data.public_repos,
            name: data.name,
          });
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubStats();
  }, []);

  if (loading || !stats) return null;

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-blue-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[color:var(--accent)]" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.07 1.54 1.08 1.54 1.08.9 1.58 2.36 1.12 2.93.85.09-.67.35-1.12.64-1.37-2.22-.26-4.56-1.15-4.56-5.11 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.06A9.35 9.35 0 0 1 12 7.4c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.06 2.74-1.06.56 1.43.21 2.49.11 2.75.64.72 1.03 1.64 1.03 2.77 0 3.97-2.34 4.85-4.57 5.11.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.5A10.22 10.22 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
        </svg>
        <h3 className="text-lg font-semibold text-[color:var(--text-light)]">GitHub Activity</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold text-[color:var(--accent)]">{stats.public_repos}</div>
          <div className="text-xs text-[color:var(--text-mid)]">Public Repositories</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[color:var(--accent)]">{stats.followers}</div>
          <div className="text-xs text-[color:var(--text-mid)]">Followers</div>
        </div>
      </div>
      
      <a
        href="https://github.com/haroon7890"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-sm text-[color:var(--accent)] hover:underline"
      >
        View full profile →
      </a>
    </div>
  );
}
