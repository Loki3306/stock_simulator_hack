import { useMemo, useState, useEffect } from "react";
import { learnRepo, LearnItem, extractYouTubeId, getYouTubeThumbnail } from "@/lib/learnRepo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { Play, Trash2, MoreVertical, List, Clock, Users, ExternalLink, Search, Grid3x3, X, Sparkles, FileText, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function PlaylistThumbnail({ playlistVideos, title, className }: { 
  playlistVideos?: string[], 
  title: string, 
  className: string 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const thumbnailSrc = useMemo(() => {
    if (!playlistVideos?.[0]) return null;
    
    const firstVideo = learnRepo.getById(playlistVideos[0]);
    if (!firstVideo?.videoUrl) return null;
    
    const videoId = extractYouTubeId(firstVideo.videoUrl);
    return videoId ? getYouTubeThumbnail(videoId) : null;
  }, [playlistVideos]);

  if (!thumbnailSrc || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center`}>
        <div className="text-4xl opacity-60">🎥</div>
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div className={`${className} bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center absolute inset-0`}>
          <div className="text-4xl opacity-60 animate-pulse">🎥</div>
        </div>
      )}
      <img
        src={thumbnailSrc}
        alt={title}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </>
  );
}

function VideoThumbnail({ videoId, title, className }: { 
  videoId: string, 
  title: string, 
  className: string 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const thumbnailSrc = getYouTubeThumbnail(videoId);

  if (imageError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center relative">
        <span className="text-4xl opacity-60">🎥</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center absolute inset-0">
          <div className="text-4xl opacity-60 animate-pulse">🎥</div>
        </div>
      )}
      <img
        src={thumbnailSrc}
        alt={title}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white ml-0.5" />
        </div>
      </div>
    </div>
  );
}

function PlaylistVideoThumbnail({ videoUrl, title }: { 
  videoUrl?: string, 
  title: string 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const thumbnailSrc = useMemo(() => {
    if (!videoUrl) return null;
    const videoId = extractYouTubeId(videoUrl);
    return videoId ? getYouTubeThumbnail(videoId) : null;
  }, [videoUrl]);

  if (!thumbnailSrc || imageError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center relative">
        <span className="text-lg opacity-60">🎥</span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <Play className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center absolute inset-0">
          <div className="text-lg opacity-60 animate-pulse">🎥</div>
        </div>
      )}
      <img
        src={thumbnailSrc}
        alt={title}
        className={`w-full h-full object-cover rounded-lg ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg group-hover:bg-black/70 transition-colors">
        <Play className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

function LearnCard({ item, onDelete, viewMode }: { item: LearnItem; onDelete: (id: string) => void; viewMode?: "grid" | "list" }) {
  const [showVideo, setShowVideo] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { user } = useAuth();
  const videoId = item.videoUrl ? extractYouTubeId(item.videoUrl) : null;
  
  // Check if current user can delete this item
  const canDelete = user && (item.createdBy === user.email || item.createdBy === user.name);

  if (item.type === "playlist") {
    const videoCount = item.playlistVideos?.length || 0;
    const difficultyColor = 
      item.difficulty === "beginner" ? "text-green-500" : 
      item.difficulty === "intermediate" ? "text-yellow-500" : 
      "text-red-500";
    
    return (
      <>
        <article className={`group rounded-2xl border border-[#4A90E2]/20 bg-[#202020]/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-[#4A90E2]/30 transition-all duration-300 cursor-pointer relative hover:border-[#4A90E2]/50 ${
          viewMode === "list" 
            ? "flex flex-row items-center gap-6 p-4" 
            : "flex flex-col h-[380px]"
        }`} onClick={() => setShowPlaylist(true)}>
          {/* Playlist Thumbnail */}
          <div className={`relative ${
            viewMode === "list" ? "w-24 h-16 flex-shrink-0" : "aspect-video"
          }`}>
            <PlaylistThumbnail 
              playlistVideos={item.playlistVideos} 
              title={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
              <Play className="w-3 h-3" />
              {videoCount}
            </div>
            <div className="absolute top-2 left-2 bg-[#4A90E2]/90 text-white text-xs px-2 py-1 rounded-lg font-medium">
              Playlist
            </div>
          </div>

          {/* Content */}
          <div className={`${viewMode === "list" ? "flex-1" : "p-6 flex flex-col"}`}>
            {/* Header Section */}
            <div className="flex items-start justify-between mb-3">
              <h3 className={`font-bold text-[#F0F0F0] group-hover:text-[#4A90E2] transition-colors line-clamp-2 leading-tight ${
                viewMode === "list" ? "text-lg" : "text-xl"
              }`}>
                {item.title}
              </h3>
              {canDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => {e.stopPropagation();}}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#4A90E2]/20 flex-shrink-0"
                      title="More options"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Description Section */}
            <p className="text-[#AFAFAF] text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
              {item.summary || `A collection of ${videoCount} videos about ${item.category}`}
            </p>
            
            {/* Metadata Bar */}
            <div className="flex items-center justify-between mt-auto pt-3">
              <div className="flex items-center gap-3 text-xs text-[#AFAFAF]">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{item.author}</span>
                </span>
                {item.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.difficulty === "beginner" ? "bg-green-500/20 text-green-400" : 
                    item.difficulty === "intermediate" ? "bg-yellow-500/20 text-yellow-400" : 
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {item.difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Playlist Dialog */}
        <Dialog open={showPlaylist} onOpenChange={setShowPlaylist}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-[#AFAFAF]">{item.summary}</p>
              <div className="grid gap-4">
                {learnRepo.getPlaylistVideos(item.id).map((video, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-[#4A90E2]/20 rounded-xl hover:bg-[#4A90E2]/10 transition-colors">
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <PlaylistVideoThumbnail 
                        videoUrl={video?.videoUrl} 
                        title={video?.title || 'Video'}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{video?.title}</h4>
                      <p className="text-sm text-[#AFAFAF] mb-2">{video?.summary}</p>
                      <div className="flex items-center gap-2 text-xs text-[#AFAFAF]">
                        <Clock className="w-3 h-3" />
                        {video?.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{item.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(item.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Regular item types (blog, course, video)
  const difficultyColor = 
    item.difficulty === "beginner" ? "text-green-500" : 
    item.difficulty === "intermediate" ? "text-yellow-500" : 
    "text-red-500";

  const typeIcon = 
    item.type === "blog" ? "📝" : 
    item.type === "course" ? "🎯" : 
    "🎥";

  return (
    <>
      <article className={`group rounded-2xl border border-[#4A90E2]/20 bg-[#202020]/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-[#4A90E2]/30 transition-all duration-300 cursor-pointer relative hover:border-[#4A90E2]/50 ${
        viewMode === "list" 
          ? "flex flex-row items-center gap-6 p-4" 
          : "flex flex-col h-[380px]"
      }`} onClick={() => item.type === "video" ? setShowVideo(true) : setShowContent(true)}>
        {/* Thumbnail/Icon */}
        <div className={`relative ${
          viewMode === "list" ? "w-24 h-16 flex-shrink-0" : "aspect-video"
        }`}>
          {item.type === "video" && videoId ? (
            <VideoThumbnail 
              videoId={videoId} 
              title={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <span className="text-4xl">{typeIcon}</span>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-[#4A90E2]/90 text-white text-xs px-2 py-1 rounded-lg font-medium capitalize">
            {item.type}
          </div>
        </div>

        {/* Content */}
        <div className={`${viewMode === "list" ? "flex-1" : "p-6 flex flex-col"}`}>
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <h3 className={`font-bold text-[#F0F0F0] group-hover:text-[#4A90E2] transition-colors line-clamp-2 leading-tight ${
              viewMode === "list" ? "text-lg" : "text-xl"
            }`}>
              {item.title}
            </h3>
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => {e.stopPropagation();}}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#4A90E2]/20 flex-shrink-0"
                    title="More options"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Description Section */}
          <p className="text-[#AFAFAF] text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {item.summary}
          </p>

          {/* Metadata Bar */}
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex items-center gap-3 text-xs text-[#AFAFAF]">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{item.author}</span>
              </span>
              {item.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.difficulty === "beginner" ? "bg-green-500/20 text-green-400" : 
                  item.difficulty === "intermediate" ? "bg-yellow-500/20 text-yellow-400" : 
                  "bg-red-500/20 text-red-400"
                }`}>
                  {item.difficulty}
                </span>
              )}
            </div>
            {item.type === "video" && item.duration && (
              <span className="flex items-center gap-1 text-xs text-[#AFAFAF]">
                <Clock className="w-3 h-3" />
                <span>{item.duration}</span>
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Video Dialog */}
      {item.type === "video" && videoId && (
        <Dialog open={showVideo} onOpenChange={setShowVideo}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{item.title}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
                title={`Video: ${item.title}`}
              />
            </div>
            <div className="space-y-4">
              <p className="text-[#AFAFAF]">{item.summary}</p>
              <div className="flex items-center gap-4 text-sm text-[#AFAFAF]">
                <span>By {item.author}</span>
                <span>•</span>
                <span>{item.duration}</span>
                {item.difficulty && (
                  <>
                    <span>•</span>
                    <span className={`${
                      item.difficulty === "beginner" ? "text-green-400" : 
                      item.difficulty === "intermediate" ? "text-yellow-400" : 
                      "text-red-400"
                    }`}>{item.difficulty}</span>
                  </>
                )}
              </div>
              {item.videoUrl && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </a>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Content Dialog (Blog/Course) */}
      <Dialog open={showContent} onOpenChange={setShowContent}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-[#AFAFAF]">
              <span>By {item.author}</span>
              <span>•</span>
              <span className="capitalize">{item.type}</span>
              {item.difficulty && (
                <>
                  <span>•</span>
                  <span className={`${
                    item.difficulty === "beginner" ? "text-green-400" : 
                    item.difficulty === "intermediate" ? "text-yellow-400" : 
                    "text-red-400"
                  }`}>{item.difficulty}</span>
                </>
              )}
            </div>
            <div className="prose prose-invert max-w-none">
              {item.type === "blog" ? (
                <div dangerouslySetInnerHTML={{ __html: item.content || item.summary || "" }} />
              ) : (
                <p>{item.summary}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {item.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{item.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(item.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Main Learn Component
export default function Learn() {
  const [filter, setFilter] = useState<"all" | "blog" | "course" | "video">("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleItems, setVisibleItems] = useState(new Set<string>());
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const { user } = useAuth();

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-item-id') || entry.target.getAttribute('data-section-id');
            if (id) {
              if (entry.target.hasAttribute('data-item-id')) {
                setVisibleItems(prev => new Set(prev).add(id));
              } else {
                setVisibleSections(prev => new Set(prev).add(id));
              }
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const items = document.querySelectorAll('[data-item-id], [data-section-id]');
      items.forEach(item => observer.observe(item));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [refreshKey]);

  // Initialize visible sections immediately
  useEffect(() => {
    setVisibleSections(new Set(['header', 'search', 'filters']));
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const allItems = useMemo(
    () => learnRepo.list(filter === "all" ? undefined : filter),
    [filter, refreshKey],
  );

  const items = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return allItems;
    
    return allItems.filter(item =>
      item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (item.summary?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    );
  }, [allItems, debouncedSearchQuery]);

  const handleDelete = (id: string) => {
    learnRepo.delete(id);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F0F0F0]">
      {/* Header Section */}
      <div 
        className={`container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 pt-8 sm:pt-16 pb-6 sm:pb-8 transition-all duration-1000 ${
          visibleSections.has('header') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
        data-section-id="header"
      >
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-[#4A90E2] via-[#3A7BD5] to-[#4A90E2] bg-clip-text text-transparent animate-gradient bg-300% leading-tight">
              Learn & Grow
            </h1>
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-[#4A90E2]/20 via-[#3A7BD5]/20 to-[#4A90E2]/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-[#AFAFAF] leading-relaxed max-w-2xl lg:max-w-4xl mx-auto px-2 sm:px-4">
            Discover comprehensive trading resources, expert tutorials, and community-driven content to accelerate your trading journey
          </p>
        </div>
        
        {/* Enhanced Search Bar */}
        <div 
          className={`relative max-w-2xl mx-auto mb-6 sm:mb-8 transition-all duration-1000 delay-200 ${
            visibleSections.has('search') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          data-section-id="search"
        >
          <div className="relative group">
            <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-[#AFAFAF] group-hover:text-[#4A90E2] transition-colors duration-300 w-4 h-4 sm:w-5 sm:h-5 z-10" />
            <input
              type="text"
              placeholder="Search courses, tutorials, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3 sm:py-4 lg:py-5 text-sm sm:text-base bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-xl lg:rounded-2xl text-[#F0F0F0] placeholder-[#AFAFAF] focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/30 transition-all duration-300 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-[#AFAFAF] hover:text-[#4A90E2] transition-colors duration-300 z-10"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div 
        className={`container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 mb-6 sm:mb-8 transition-all duration-1000 delay-300 ${
          visibleSections.has('filters') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
        data-section-id="filters"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Content Type Filter */}
          <div className="w-full sm:flex-1 sm:mr-4">
            <div className="flex flex-wrap items-center gap-2 lg:gap-3 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-xl lg:rounded-2xl p-2 lg:p-3">
              <button
                onClick={() => setFilter("all")}
                className={`relative flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-medium transition-all text-xs lg:text-sm text-[#F0F0F0] group whitespace-nowrap`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  All Content
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    filter === "all" 
                      ? "w-full opacity-100" 
                      : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
              <button
                onClick={() => setFilter("video")}
                className={`relative flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-medium transition-all text-xs lg:text-sm text-[#F0F0F0] group whitespace-nowrap`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  Videos
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    filter === "video" 
                      ? "w-full opacity-100" 
                      : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
              <button
                onClick={() => setFilter("course")}
                className={`relative flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-medium transition-all text-xs lg:text-sm text-[#F0F0F0] group whitespace-nowrap`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  Courses
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    filter === "course" 
                      ? "w-full opacity-100" 
                      : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
              <button
                onClick={() => setFilter("blog")}
                className={`relative flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-medium transition-all text-xs lg:text-sm text-[#F0F0F0] group whitespace-nowrap`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  Articles
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    filter === "blog" 
                      ? "w-full opacity-100" 
                      : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-xl lg:rounded-2xl p-2 lg:p-3 w-full sm:w-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all text-sm text-[#F0F0F0] group whitespace-nowrap flex-1 sm:flex-none justify-center ${
                viewMode === "grid" ? "bg-[#4A90E2]/20 border border-[#4A90E2]/40" : ""
              }`}
            >
              <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative group-hover:scale-110 transition-transform duration-300">
                Grid
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                  viewMode === "grid" 
                    ? "w-full opacity-100" 
                    : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                }`}></span>
              </span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all text-sm text-[#F0F0F0] group whitespace-nowrap flex-1 sm:flex-none justify-center ${
                viewMode === "list" ? "bg-[#4A90E2]/20 border border-[#4A90E2]/40" : ""
              }`}
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative group-hover:scale-110 transition-transform duration-300">
                List
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                  viewMode === "list" 
                    ? "w-full opacity-100" 
                    : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                }`}></span>
              </span>
            </button>
          </div>
        </div>
        
        {/* Results Count & Publish Button */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-[#AFAFAF]">
            {items.length} learning resource{items.length !== 1 ? 's' : ''} found
          </div>
          {user && (
            <PublishButton />
          )}
        </div>
      </div>
      
      {/* Learning Resources */}
      {filter === "video" ? (
        <VideoPlaylistsSection onDelete={handleDelete} searchQuery={searchQuery} viewMode={viewMode} />
      ) : items.length > 0 ? (
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 pb-16">
          <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {items.map((item, index) => {
              const delay = Math.min(index * 100, 500);
              return (
                <div
                  key={item.id}
                  className={`transition-all duration-700 ${
                    visibleItems.has(item.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  } ${delay === 0 ? '' : delay === 100 ? 'delay-100' : delay === 200 ? 'delay-200' : delay === 300 ? 'delay-300' : delay === 400 ? 'delay-400' : 'delay-500'}`}
                  data-item-id={item.id}
                >
                  <LearnCard item={item} onDelete={handleDelete} viewMode={viewMode} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 pb-16">
          <div className="text-center py-16 lg:py-24 relative">
            <div className="relative inline-block mb-8">
              <div className="relative">
                {debouncedSearchQuery ? (
                  <div className="text-6xl lg:text-8xl mb-6 animate-bounce">🔍</div>
                ) : (
                  <div className="text-6xl lg:text-8xl mb-6 animate-pulse">📚</div>
                )}
              </div>
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-full blur-3xl opacity-50"></div>
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {debouncedSearchQuery ? `No results for "${debouncedSearchQuery}"` : `No ${filter === "all" ? "content" : filter + "s"} found`}
            </h3>
            
            <p className="text-[#AFAFAF] text-base lg:text-lg mb-8 leading-relaxed max-w-lg mx-auto">
              {debouncedSearchQuery 
                ? "Try adjusting your search terms or browse all available content."
                : filter === "all" 
                ? "No learning content is available yet. Be the first to publish something!" 
                : `No ${filter}s are available. Try switching to a different category or publish new content.`}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {debouncedSearchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-400 hover:text-purple-300 transition-all duration-300 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/50 font-medium transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Clear Search</span>
                </button>
              )}
              {user && (
                <PublishButton />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// NOTE: VideoPlaylistsSection and PublishButton components would be added here
// They are referenced but need to be implemented separately or imported from the original file

function VideoPlaylistsSection({ onDelete, searchQuery, viewMode }: { onDelete: (id: string) => void; searchQuery: string; viewMode: "grid" | "list" }) {
  const allPlaylists = useMemo(() => learnRepo.list("playlist"), []);
  
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return allPlaylists;
    
    return allPlaylists.filter(playlist =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPlaylists, searchQuery]);

  if (filteredPlaylists.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 pb-16">
        <div className="text-center py-16 lg:py-24 relative">
          <div className="relative inline-block mb-8">
            <div className="text-6xl lg:text-8xl mb-6 animate-pulse">🎥</div>
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-full blur-3xl opacity-50"></div>
          </div>
          
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {searchQuery ? `No video playlists found for "${searchQuery}"` : "No video playlists available"}
          </h3>
          
          <p className="text-[#AFAFAF] text-base lg:text-lg mb-8 leading-relaxed max-w-lg mx-auto">
            {searchQuery 
              ? "Try adjusting your search terms or browse all available content."
              : "No video playlists are available yet. Create the first playlist!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 pb-16">
      <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      }`}>
        {filteredPlaylists.map((playlist, index) => {
          const delay = Math.min(index * 100, 500);
          return (
            <div
              key={playlist.id}
              className={`transition-all duration-700 opacity-100 translate-y-0 ${delay === 0 ? '' : delay === 100 ? 'delay-100' : delay === 200 ? 'delay-200' : delay === 300 ? 'delay-300' : delay === 400 ? 'delay-400' : 'delay-500'}`}
              data-item-id={playlist.id}
            >
              <LearnCard item={playlist} onDelete={onDelete} viewMode={viewMode} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PublishButton() {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [contentType, setContentType] = useState<"video" | "blog" | "course" | "playlist">("video");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    summary: "",
    videoUrl: "",
    duration: "",
    category: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    content: ""
  });

  const handlePublish = () => {
    if (!formData.title || !formData.author || !formData.summary) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem: LearnItem = {
      id: Math.random().toString(36).slice(2, 9),
      type: contentType,
      title: formData.title,
      author: formData.author,
      summary: formData.summary,
      category: formData.category || "General",
      difficulty: formData.difficulty,
      createdAt: Date.now(),
      createdBy: "user@example.com", // This would come from auth context
      ...(contentType === "video" && formData.videoUrl && { 
        videoUrl: formData.videoUrl,
        duration: formData.duration 
      }),
      ...(["blog", "course"].includes(contentType) && formData.content && { 
        content: formData.content 
      })
    };

    learnRepo.create(newItem);
    setShowPublishDialog(false);
    setFormData({
      title: "",
      author: "",
      summary: "",
      videoUrl: "",
      duration: "",
      category: "",
      difficulty: "beginner",
      content: ""
    });
    // Refresh the page or trigger a re-render
    window.location.reload();
  };

  return (
    <>
      <button 
        onClick={() => setShowPublishDialog(true)}
        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] hover:from-[#4A90E2]/80 hover:to-[#3A7BD5]/80 text-white font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-[#4A90E2]/30 hover:border-[#4A90E2]/50 text-sm sm:text-base"
      >
        <Sparkles className="w-4 h-4" />
        <span>Publish Content</span>
      </button>

      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publish New Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <select 
                value={contentType} 
                onChange={(e) => setContentType(e.target.value as typeof contentType)}
                className="w-full p-2 border rounded-lg bg-background"
                title="Select content type"
              >
                <option value="video">Video</option>
                <option value="blog">Blog Post</option>
                <option value="course">Course</option>
                <option value="playlist">Playlist</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="Enter content title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Summary *</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                className="w-full p-2 border rounded-lg bg-background h-20"
                placeholder="Brief description of the content"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="e.g., Technical Analysis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select 
                  value={formData.difficulty} 
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as typeof formData.difficulty }))}
                  className="w-full p-2 border rounded-lg bg-background"
                  title="Select difficulty level"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {contentType === "video" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full p-2 border rounded-lg bg-background"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full p-2 border rounded-lg bg-background"
                    placeholder="e.g., 15:30"
                  />
                </div>
              </div>
            )}

            {["blog", "course"].includes(contentType) && (
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border rounded-lg bg-background h-40"
                  placeholder="Write your content here..."
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setShowPublishDialog(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
              <button 
                onClick={handlePublish}
                className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80"
              >
                Publish
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}