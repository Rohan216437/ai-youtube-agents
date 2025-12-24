import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:3000';

function App() {
  const [activeTab, setActiveTab] = useState('news'); // 'news' | 'content' | 'videos'
  const [news, setNews] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [content, setContent] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch news articles
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/content/news`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all content items
  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/content/all`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all videos
  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/video/all`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Select/deselect article
  const toggleArticleSelection = (article) => {
    setSelectedArticles(prev => {
      const exists = prev.find(a => a.url === article.url);
      if (exists) {
        return prev.filter(a => a.url !== article.url);
      } else {
        if (prev.length >= 3) {
          alert('You can only select up to 3 articles');
          return prev;
        }
        return [...prev, article];
      }
    });
  };

  // Submit selected articles
  const submitArticles = async () => {
    if (selectedArticles.length === 0) {
      alert('Please select at least one article');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const articles = selectedArticles.map(article => ({
        title: article.title,
        sourceUrl: article.url,
        source: article.source?.name,
        publishedAt: article.publishedAt,
      }));

      const response = await fetch(`${API_BASE}/content/create-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }),
      });

      if (!response.ok) throw new Error('Failed to submit articles');
      
      await response.json();
      setSelectedArticles([]);
      await fetchContent();
      setActiveTab('content');
      alert(`Successfully submitted ${articles.length} article(s)!`);
    } catch (err) {
      setError(err.message);
      console.error('Error submitting articles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate video for content item
  const generateVideo = async (contentId) => {
    if (!confirm('Start video generation for this content?')) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/pipeline/run/${contentId}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to start video generation');
      
      await response.json();
      await fetchContent();
      alert('Video generation started! Check the Content tab for progress.');
    } catch (err) {
      setError(err.message);
      console.error('Error generating video:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh content when on content tab
  useEffect(() => {
    if (activeTab === 'content') {
      fetchContent();
      const interval = setInterval(fetchContent, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Fetch on mount
  useEffect(() => {
    if (activeTab === 'news') fetchNews();
    if (activeTab === 'content') fetchContent();
    if (activeTab === 'videos') fetchVideos();
  }, [activeTab]);

  const getStatusColor = (status) => {
    const colors = {
      SELECTED: '#3b82f6',
      SCRIPTING: '#f59e0b',
      AUDIO_GENERATING: '#8b5cf6',
      VIDEO_GENERATING: '#ec4899',
      MERGING: '#06b6d4',
      UPLOADING: '#10b981',
      COMPLETED: '#059669',
      FAILED: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 AI YouTube Agent</h1>
        <nav className="tabs">
          <button
            className={activeTab === 'news' ? 'active' : ''}
            onClick={() => setActiveTab('news')}
          >
            📰 News Feed
          </button>
          <button
            className={activeTab === 'content' ? 'active' : ''}
            onClick={() => setActiveTab('content')}
          >
            📋 Content Queue
          </button>
          <button
            className={activeTab === 'videos' ? 'active' : ''}
            onClick={() => setActiveTab('videos')}
          >
            🎥 Video Library
          </button>
        </nav>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            ⚠️ Error: {error}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="news-tab">
            <div className="section-header">
              <h2>Today's Headlines</h2>
              <button onClick={fetchNews} disabled={loading}>
                {loading ? 'Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {selectedArticles.length > 0 && (
              <div className="selected-banner">
                <strong>{selectedArticles.length} article(s) selected</strong>
                <button onClick={submitArticles} disabled={loading}>
                  ✅ Submit Selected
                </button>
              </div>
            )}

            <div className="news-grid">
              {news.map((article, idx) => {
                const isSelected = selectedArticles.find(a => a.url === article.url);
                return (
                  <div
                    key={idx}
                    className={`news-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleArticleSelection(article)}
                  >
                    {article.urlToImage && (
                      <img src={article.urlToImage} alt={article.title} />
                    )}
                    <div className="news-card-content">
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                      <div className="news-meta">
                        <span>{article.source?.name}</span>
                        {article.publishedAt && (
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      {isSelected && <div className="selected-badge">✓ Selected</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {news.length === 0 && !loading && (
              <div className="empty-state">
                <p>No news articles found. Click Refresh to fetch headlines.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-tab">
            <div className="section-header">
              <h2>Content Queue</h2>
              <button onClick={fetchContent} disabled={loading}>
                {loading ? 'Loading...' : '🔄 Refresh'}
              </button>
            </div>

            <div className="content-list">
              {content.map((item) => (
                <div key={item.id} className="content-card">
                  <div className="content-header">
                    <h3>{item.title}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="content-source">
                    Source: {item.source || 'Unknown'} • {new Date(item.createdAt).toLocaleString()}
                  </p>
                  
                  {item.status === 'SELECTED' && (
                    <button
                      className="generate-btn"
                      onClick={() => generateVideo(item.id)}
                      disabled={loading}
                    >
                      ▶️ Generate Video
                    </button>
                  )}

                  {item.video && (
                    <div className="video-info">
                      <p>Video ID: {item.video.id}</p>
                      {item.video.youtubeUrl && (
                        <a
                          href={item.video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="youtube-link"
                        >
                          🔗 View on YouTube
                        </a>
                      )}
                    </div>
                  )}

                  {item.status === 'FAILED' && (
                    <div className="error-text">
                      ⚠️ Video generation failed. Please try again.
                    </div>
                  )}
                </div>
              ))}
            </div>

            {content.length === 0 && !loading && (
              <div className="empty-state">
                <p>No content items yet. Go to News Feed to select articles.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="videos-tab">
            <div className="section-header">
              <h2>Video Library</h2>
              <button onClick={fetchVideos} disabled={loading}>
                {loading ? 'Loading...' : '🔄 Refresh'}
              </button>
            </div>

            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-header">
                    <h3>{video.contentItem.title}</h3>
                    <span className="upload-status">
                      {video.uploadStatus === 'UPLOADED' ? '✅ Uploaded' : video.uploadStatus}
                    </span>
                  </div>
                  
                  {video.youtubeUrl && (
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="youtube-link"
                    >
                      🎬 Watch on YouTube
                    </a>
                  )}

                  {video.stats && (
                    <div className="video-stats">
                      <div className="stat-item">
                        <strong>👁️ Views:</strong> {video.stats.views.toLocaleString()}
                      </div>
                      <div className="stat-item">
                        <strong>👍 Likes:</strong> {video.stats.likes.toLocaleString()}
                      </div>
                      <div className="stat-item">
                        <strong>💬 Comments:</strong> {video.stats.comments.toLocaleString()}
                      </div>
                      <div className="stat-item">
                        <small>Last updated: {new Date(video.stats.fetchedAt).toLocaleString()}</small>
                      </div>
                    </div>
                  )}

                  <div className="video-meta">
                    <small>Created: {new Date(video.createdAt).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>

            {videos.length === 0 && !loading && (
              <div className="empty-state">
                <p>No uploaded videos yet. Generate videos from the Content Queue.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
