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
import { Play, Trash2, MoreVertical, List, Clock, Users, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function LearnCard({ item, onDelete }: { item: LearnItem; onDelete: (id: string) => void }) {
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
        <article className="rounded-xl border border-border/60 bg-card-gradient overflow-hidden hover:shadow-md transition cursor-pointer">
          <div className="relative" onClick={() => setShowPlaylist(true)}>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 h-40 flex items-center justify-center">
              <div className="text-center text-white">
                <List className="w-12 h-12 mx-auto mb-2" />
                <div className="text-sm font-semibold">{videoCount} Videos</div>
              </div>
            </div>
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {item.duration}
              </div>
            )}
            {canDelete && (
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs uppercase text-purple-500 font-semibold">
                PLAYLIST
              </div>
              <div className={`text-xs uppercase font-semibold ${difficultyColor}`}>
                {item.difficulty}
              </div>
            </div>
            <h3 className="mt-1 font-display text-lg">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>By {item.author}</span>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                <span>{item.category}</span>
              </div>
            </div>
          </div>
        </article>
        
        <PlaylistModal 
          open={showPlaylist} 
          onOpenChange={setShowPlaylist} 
          playlist={item}
        />
        
        <DeleteConfirmDialog 
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => {
            onDelete(item.id);
            setShowDeleteDialog(false);
          }}
          title={item.title}
          type={item.type}
        />
      </>
    );
  }

  if (item.type === "video" && videoId) {
    return (
      <>
        <article className="rounded-xl border border-border/60 bg-card-gradient overflow-hidden hover:shadow-md transition">
          <div className="relative">
            <div className="cursor-pointer" onClick={() => setShowVideo(true)}>
              <img 
                src={getYouTubeThumbnail(videoId)}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-red-600 rounded-full p-3 hover:bg-red-700 transition">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            </div>
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {item.duration}
              </div>
            )}
            {canDelete && (
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="text-xs uppercase text-red-500 font-semibold">
              {item.type}
            </div>
            <h3 className="mt-1 font-display text-lg">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
            <div className="mt-3 text-xs text-muted-foreground">
              By {item.author}
            </div>
          </div>
        </article>
        
        <VideoModal 
          open={showVideo} 
          onOpenChange={setShowVideo} 
          videoId={videoId} 
          title={item.title}
        />
        
        <DeleteConfirmDialog 
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => {
            onDelete(item.id);
            setShowDeleteDialog(false);
          }}
          title={item.title}
          type={item.type}
        />
      </>
    );
  }

  return (
    <>
      <article 
        className="rounded-xl border border-border/60 bg-card-gradient p-5 hover:shadow-md transition relative cursor-pointer"
        onClick={() => setShowContent(true)}
      >
        {canDelete && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="bg-border/50 hover:bg-border rounded-full p-2 transition"
                  aria-label="More options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <div className="text-xs uppercase text-muted-foreground">
              {item.type}
            </div>
            {item.url && (
              <div className="text-xs text-blue-500 flex items-center">
                <ExternalLink className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
        <h3 className="mt-1 font-display text-lg pr-8">{item.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>By {item.author}</span>
          {item.url && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.url, '_blank');
              }}
              className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
            >
              <span>Read Original</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </article>
      
      <ContentModal 
        open={showContent} 
        onOpenChange={setShowContent} 
        item={item}
      />
      
      <DeleteConfirmDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          onDelete(item.id);
          setShowDeleteDialog(false);
        }}
        title={item.title}
        type={item.type}
      />
    </>
  );
}

function VideoModal({ 
  open, 
  onOpenChange, 
  videoId, 
  title 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  videoId: string; 
  title: string; 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlaylistModal({ 
  open, 
  onOpenChange, 
  playlist 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  playlist: LearnItem; 
}) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const playlistVideos = learnRepo.getPlaylistVideos(playlist.id);
  const currentVideo = playlistVideos[currentVideoIndex];
  const currentVideoId = currentVideo?.videoUrl ? extractYouTubeId(currentVideo.videoUrl) : null;

  if (!currentVideo || !currentVideoId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{playlist.title}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No videos available in this playlist.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{playlist.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-lg">{currentVideo.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{currentVideo.summary}</p>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <span>By {currentVideo.author}</span>
                <span className="mx-2">•</span>
                <span>{currentVideo.duration}</span>
              </div>
            </div>
          </div>
          
          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <List className="w-4 h-4 mr-2" />
                Playlist ({playlistVideos.length} videos)
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {playlistVideos.map((video, index) => {
                  if (!video) return null;
                  const isActive = index === currentVideoIndex;
                  return (
                    <div
                      key={video.id}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        isActive ? 'bg-primary/20 border border-primary/30' : 'hover:bg-card/70'
                      }`}
                      onClick={() => setCurrentVideoIndex(index)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`text-xs px-2 py-1 rounded ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm leading-tight line-clamp-2">{video.title}</h5>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <span>{video.duration}</span>
                            {isActive && <span className="ml-2 text-primary">• Playing</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VideoPlaylistsSection({ onDelete }: { onDelete: (id: string) => void }) {
  const allItems = learnRepo.list();
  const playlists = allItems.filter(item => item.type === "playlist");
  const videos = allItems.filter(item => item.type === "video");

  // Group videos by category
  const videosByCategory = videos.reduce((acc, video) => {
    const category = video.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(video);
    return acc;
  }, {} as Record<string, LearnItem[]>);

  return (
    <div className="mt-6 space-y-8">
      {/* Playlists Section */}
      {playlists.length > 0 && (
        <div>
          <h2 className="text-xl font-display mb-4 flex items-center">
            <List className="w-5 h-5 mr-2" />
            Video Playlists
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <LearnCard key={playlist.id} item={playlist} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Videos by Category */}
      {Object.entries(videosByCategory).map(([category, categoryVideos]) => (
        <div key={category}>
          <h2 className="text-xl font-display mb-4 flex items-center">
            <Play className="w-5 h-5 mr-2" />
            {category} Videos
            <span className="ml-2 text-sm text-muted-foreground">({categoryVideos.length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryVideos.map((video) => (
              <LearnCard key={video.id} item={video} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}

      {/* Uncategorized videos */}
      {videos.filter(v => !v.category).length > 0 && (
        <div>
          <h2 className="text-xl font-display mb-4 flex items-center">
            <Play className="w-5 h-5 mr-2" />
            All Videos
            <span className="ml-2 text-sm text-muted-foreground">({videos.filter(v => !v.category).length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.filter(v => !v.category).map((video) => (
              <LearnCard key={video.id} item={video} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContentModal({ 
  open, 
  onOpenChange, 
  item 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  item: LearnItem; 
}) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold px-2 py-1 bg-muted rounded">
                {item.type}
              </div>
            </div>
            {item.url && (
              <button
                onClick={() => window.open(item.url, '_blank')}
                className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 text-sm"
              >
                <span>Read Original</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
          <DialogTitle className="text-left text-2xl font-bold">{item.title}</DialogTitle>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <span>By {item.author}</span>
            <span>•</span>
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {item.content ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {item.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
                } else if (line.startsWith('- ')) {
                  return (
                    <div key={index} className="flex items-start mb-1">
                      <span className="text-primary mr-2">•</span>
                      <span>
                        <span className="font-medium">{line.slice(2).split(':')[0]}</span>
                        {line.includes(':') && <span>: {line.slice(2).split(':').slice(1).join(':')}</span>}
                      </span>
                    </div>
                  );
                } else if (line.trim() === '') {
                  return <div key={index} className="h-3" />;
                } else {
                  return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
                }
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{item.summary}</p>
              <p className="text-sm text-muted-foreground">Full content coming soon...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  type
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  type: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Learn() {
  const [filter, setFilter] = useState<"all" | "blog" | "course" | "video">("all");
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render after delete
  
  const items = useMemo(
    () => learnRepo.list(filter === "all" ? undefined : filter),
    [filter, refreshKey],
  );
  const { user } = useAuth();

  const handleDelete = (id: string) => {
    const success = learnRepo.delete(id);
    if (success) {
      setRefreshKey(prev => prev + 1); // Trigger refresh
    }
  };
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Learn</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm ${filter === "all" ? "btn-gradient text-black" : "border border-white/15"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("blog")}
            className={`px-3 py-1.5 rounded-md text-sm ${filter === "blog" ? "btn-gradient text-black" : "border border-white/15"}`}
          >
            Blogs
          </button>
          <button
            onClick={() => setFilter("course")}
            className={`px-3 py-1.5 rounded-md text-sm ${filter === "course" ? "btn-gradient text-black" : "border border-white/15"}`}
          >
            Courses
          </button>
          <button
            onClick={() => setFilter("video")}
            className={`px-3 py-1.5 rounded-md text-sm ${filter === "video" ? "btn-gradient text-black" : "border border-white/15"}`}
          >
            Videos
          </button>
          {user && <PublishButton />}
        </div>
      </div>
      {filter === "video" ? (
        <VideoPlaylistsSection onDelete={handleDelete} />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <LearnCard key={i.id} item={i} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function PublishButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"blog" | "course" | "video">("blog");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [playlistMode, setPlaylistMode] = useState<"existing" | "new" | "none">("none");
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [newPlaylistCategory, setNewPlaylistCategory] = useState("");
  const [url, setUrl] = useState("");
  const { user } = useAuth();
  
  const existingPlaylists = useMemo(() => learnRepo.getExistingPlaylists(), []);

  // Reset playlist mode when switching away from video type
  useEffect(() => {
    if (type !== "video") {
      setPlaylistMode("none");
      setSelectedPlaylists([]);
      setNewPlaylistTitle("");
      setNewPlaylistCategory("");
    }
    // Reset URL when switching away from blog/course
    if (type === "video") {
      setUrl("");
    }
  }, [type]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 py-1.5 rounded-md btn-gradient text-black text-sm">
          Publish
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col bg-black/80 glass border border-border/30">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Publish {type === "blog" ? "Blog" : type === "course" ? "Course" : "Video"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Content Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setType("blog")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === "blog" 
                    ? "btn-gradient text-black" 
                    : "border border-border/50 hover:border-border/80"
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => setType("course")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === "course" 
                    ? "btn-gradient text-black" 
                    : "border border-border/50 hover:border-border/80"
                }`}
              >
                Course
              </button>
              <button
                onClick={() => setType("video")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === "video" 
                    ? "btn-gradient text-black" 
                    : "border border-border/50 hover:border-border/80"
                }`}
              >
                Video
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Title *
            </label>
            <input
              className="w-full rounded-lg bg-card border border-border/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Enter a descriptive title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Summary *
            </label>
            <textarea
              className="w-full rounded-lg bg-card border border-border/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Provide a brief summary of the content..."
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* URL field for blogs and courses */}
          {(type === "blog" || type === "course") && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Original Source URL (Optional)
              </label>
              <input
                className="w-full rounded-lg bg-card border border-border/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link to the original website where this content was published
              </p>
            </div>
          )}
          
          {/* Video-specific fields */}
          {type === "video" && (
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/30">
              <h4 className="text-sm font-medium text-foreground">Video Details</h4>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  YouTube URL *
                </label>
                <input
                  className="w-full rounded-lg bg-card border border-border/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Duration
                  </label>
                  <input
                    className="w-full rounded-lg bg-card border border-border/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g., 10:30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Difficulty
                  </label>
                  <select
                    className="w-full rounded-lg bg-card border border-border/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")}
                    aria-label="Select difficulty level"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Category
                </label>
                <input
                  className="w-full rounded-lg bg-card border border-border/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="e.g., Technical Analysis, Trading Strategy"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Playlist Options (Optional)
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPlaylistMode("none")}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        playlistMode === "none" 
                          ? "bg-primary/20 text-primary border border-primary/30" 
                          : "border border-border/50 hover:border-border/80"
                      }`}
                    >
                      No Playlist
                    </button>
                    {existingPlaylists.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPlaylistMode("existing")}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          playlistMode === "existing" 
                            ? "bg-primary/20 text-primary border border-primary/30" 
                            : "border border-border/50 hover:border-border/80"
                        }`}
                      >
                        Add to Existing
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setPlaylistMode("new")}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        playlistMode === "new" 
                          ? "bg-primary/20 text-primary border border-primary/30" 
                          : "border border-border/50 hover:border-border/80"
                      }`}
                    >
                      Create New Playlist
                    </button>
                  </div>

                  {playlistMode === "existing" && existingPlaylists.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto bg-muted/10 rounded-lg p-3 border border-border/30 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
                      <p className="text-xs text-muted-foreground mb-2">Select playlists to add this video to:</p>
                      {existingPlaylists.map((playlist) => (
                        <label key={playlist.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPlaylists.includes(playlist.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPlaylists(prev => [...prev, playlist.id]);
                              } else {
                                setSelectedPlaylists(prev => prev.filter(id => id !== playlist.id));
                              }
                            }}
                            className="rounded border-border focus:ring-primary"
                          />
                          <div className="flex-1 text-sm">
                            <div className="font-medium">{playlist.title}</div>
                            <div className="text-xs text-muted-foreground">{playlist.category}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {playlistMode === "new" && (
                    <div className="space-y-3 bg-muted/10 rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Create a new playlist with this video:</p>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Playlist Title *
                        </label>
                        <input
                          className="w-full rounded-lg bg-card border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="e.g., Trading Strategies for Beginners"
                          value={newPlaylistTitle}
                          onChange={(e) => setNewPlaylistTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Playlist Category
                        </label>
                        <input
                          className="w-full rounded-lg bg-card border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="e.g., Technical Analysis, Options Trading"
                          value={newPlaylistCategory}
                          onChange={(e) => setNewPlaylistCategory(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-border/30 bg-background">
          <p className="text-xs text-muted-foreground">
            * Required fields
          </p>
          <button
            disabled={!title || !summary || (type === "video" && !videoUrl) || (type === "video" && playlistMode === "new" && !newPlaylistTitle.trim())}
            className="px-6 py-3 rounded-lg btn-gradient text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            onClick={() => {
              const newItem: Omit<LearnItem, 'id' | 'createdAt'> = {
                type,
                title,
                summary,
                author: user?.name || "Author",
                createdBy: user?.email || user?.name, // Track creator for deletion permissions
              };
              
              // Add URL for blogs and courses
              if ((type === "blog" || type === "course") && url.trim()) {
                newItem.url = url;
              }
              
              if (type === "video") {
                newItem.videoUrl = videoUrl;
                if (duration) newItem.duration = duration;
                if (category) newItem.category = category;
                if (difficulty) newItem.difficulty = difficulty;
              }
              
              const createdItem = learnRepo.create(newItem);
              
              // Handle playlist operations for videos
              if (type === "video") {
                if (playlistMode === "new" && newPlaylistTitle.trim()) {
                  // Create new playlist with this video
                  const newPlaylist: Omit<LearnItem, 'id' | 'createdAt'> = {
                    type: "playlist",
                    title: newPlaylistTitle,
                    summary: `A playlist containing videos about ${newPlaylistCategory || 'various topics'}`,
                    author: user?.name || "Author",
                    createdBy: user?.email || user?.name,
                    category: newPlaylistCategory || category || "General",
                    playlistVideos: [createdItem.id]
                  };
                  learnRepo.create(newPlaylist);
                } else if (playlistMode === "existing" && selectedPlaylists.length > 0) {
                  // Add video to selected existing playlists
                  selectedPlaylists.forEach(playlistId => {
                    learnRepo.addVideoToPlaylist(createdItem.id, playlistId);
                  });
                }
              }
              
              setOpen(false);
              setTitle("");
              setSummary("");
              setVideoUrl("");
              setDuration("");
              setCategory("");
              setDifficulty("beginner");
              setSelectedPlaylists([]);
              setPlaylistMode("none");
              setNewPlaylistTitle("");
              setNewPlaylistCategory("");
              setUrl("");
              location.reload();
            }}
          >
            Publish
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
