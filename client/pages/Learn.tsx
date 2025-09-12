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
import { Play, Trash2, MoreVertical, List, Clock, Users, ExternalLink, Search, Grid3x3, X, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <article className={`group rounded-2xl border border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer relative hover:border-purple-500/50 ${
          viewMode === "list" 
            ? "flex flex-row items-center h-[120px] hover:scale-[1.01]" 
            : "h-full flex flex-col hover:scale-[1.02]"
        }`}>
          {/* Enhanced hover effect with stronger glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/50 to-blue-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
          
          <div className="relative z-10" onClick={() => setShowPlaylist(true)}>
            <div className={`bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center relative overflow-hidden ${
              viewMode === "list" ? "w-40 h-24 rounded-l-2xl flex-shrink-0" : "h-48 rounded-t-2xl"
            }`}>
              <div className="absolute inset-0 bg-black/10"></div>
              
              <div className="text-center text-white relative z-10">
                {viewMode === "list" ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <List className="w-6 h-6 mb-1" />
                    <div className="text-xs font-bold">{videoCount}</div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3 mx-auto w-fit border border-white/20">
                      <List className="w-8 h-8" />
                    </div>
                    <div className="text-2xl font-bold mb-1">{videoCount} Videos</div>
                    <div className="text-sm opacity-80 font-medium">Playlist Collection</div>
                  </>
                )}
              </div>
              
              {/* Duration badge */}
              {item.duration && (
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.duration}
                </div>
              )}
            </div>
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
          <div className={`relative z-10 bg-background/90 flex-1 ${
            viewMode === "list" 
              ? "p-4 rounded-r-2xl flex flex-col justify-center" 
              : "p-6 rounded-b-2xl flex flex-col"
          }`}>
            {/* Header section for list mode */}
            {viewMode === "list" && (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    PLAYLIST
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.difficulty === "beginner" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : item.difficulty === "intermediate" 
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {item.difficulty}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  {videoCount} videos
                </span>
              </div>
            )}
            
            {/* Header section for grid mode */}
            {viewMode !== "list" && (
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/20">
                <div className="text-xs uppercase bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-semibold border border-purple-500/30">
                  PLAYLIST
                </div>
                <div className={`text-xs uppercase font-semibold px-3 py-1 rounded-full ${
                  item.difficulty === "beginner" 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : item.difficulty === "intermediate" 
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {item.difficulty}
                </div>
              </div>
            )}
            
            <h3 className={`font-display font-bold text-foreground group-hover:text-purple-400 transition-colors ${
              viewMode === "list" ? "text-lg mb-1" : "text-xl mb-3"
            }`}>{item.title}</h3>
            <p className={`text-muted-foreground line-clamp-2 ${
              viewMode === "list" ? "text-sm mb-2" : "text-sm mb-3"
            }`}>{item.summary}</p>
            
            {/* Author info for list mode */}
            {viewMode === "list" && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {item.author.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground">By {item.author}</span>
              </div>
            )}
            
            {viewMode !== "list" && (
              <>
                <div className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed mb-4 flex-1">
                  A curated collection of {videoCount} educational videos covering advanced trading strategies, risk management, and market psychology. Perfect for structured learning and skill development.
                </div>
                {/* Footer section */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">By {item.author}</div>
                      {item.category && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {item.category}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
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
        <article className={`group rounded-2xl border border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 relative hover:border-purple-500/50 ${
          viewMode === "list" 
            ? "flex flex-row items-center h-[120px] hover:scale-[1.01]" 
            : "h-full flex flex-col hover:scale-[1.02]"
        }`}>
          {/* Enhanced hover effect with stronger glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/50 to-blue-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
          
          <div className={`relative ${viewMode === "list" ? "flex-shrink-0" : ""}`}>
            <div className="cursor-pointer" onClick={() => setShowVideo(true)}>
              <div className={`relative overflow-hidden ${
                viewMode === "list" ? "rounded-l-2xl w-40 h-24" : "rounded-t-2xl"
              }`}>
                <img 
                  src={getYouTubeThumbnail(videoId)}
                  alt={item.title}
                  className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                    viewMode === "list" ? "w-full h-full" : "w-full h-48"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* YouTube Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`bg-red-600/90 backdrop-blur-sm rounded-full hover:bg-red-600 transition-all duration-300 group-hover:scale-110 shadow-2xl ${
                    viewMode === "list" ? "p-1.5" : "p-4"
                  }`}>
                    <Play className={`text-white fill-current ml-0.5 ${
                      viewMode === "list" ? "w-4 h-4" : "w-8 h-8"
                    }`} />
                  </div>
                </div>
                
                {/* Duration badge */}
                {item.duration && (
                  <div className={`absolute bg-black/90 backdrop-blur-sm text-white font-medium rounded ${
                    viewMode === "list" 
                      ? "bottom-1 right-1 text-xs px-1.5 py-0.5" 
                      : "bottom-3 right-3 text-sm px-3 py-1.5 rounded-lg"
                  }`}>
                    {viewMode === "list" ? item.duration : `⏱ ${item.duration}`}
                  </div>
                )}
                
                {/* Video badge */}
                <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  🎥 VIDEO
                </div>
              </div>
            </div>
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
          <div className={`relative z-10 flex-1 ${
            viewMode === "list" 
              ? "p-4 flex flex-col justify-center" 
              : "p-6 flex flex-col"
          }`}>
            {/* Header with badges for list mode */}
            {viewMode === "list" && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  VIDEO
                </span>
                {item.difficulty && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    item.difficulty === "beginner" 
                      ? "text-green-400 bg-green-500/20 border border-green-500/30" 
                      : item.difficulty === "intermediate" 
                      ? "text-yellow-400 bg-yellow-500/20 border border-yellow-500/30" 
                      : "text-red-400 bg-red-500/20 border border-red-500/30"
                  }`}>
                    {item.difficulty}
                  </span>
                )}
              </div>
            )}
            
            <h3 className={`font-display font-bold line-clamp-2 group-hover:text-purple-400 transition-colors duration-300 leading-tight ${
              viewMode === "list" ? "text-lg mb-1" : "text-xl mb-2"
            }`}>
              {item.title}
            </h3>
            <p className={`text-muted-foreground/90 line-clamp-2 leading-relaxed ${
              viewMode === "list" ? "text-sm mb-1" : "text-sm mb-3"
            }`}>
              {item.summary}
            </p>
            
            {/* Author info for list mode */}
            {viewMode === "list" && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {item.author.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground">By {item.author}</span>
              </div>
            )}
            
            {viewMode !== "list" && (
              <>
                <div className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed mb-4 flex-1">
                  Step-by-step video tutorial with practical examples and real-world applications. Includes downloadable resources, key takeaways, and actionable insights for immediate implementation.
                </div>
                {/* Footer section with grid line */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {item.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">By {item.author}</div>
                      {item.category && (
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      )}
                    </div>
                  </div>
                  {item.difficulty && (
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      item.difficulty === "beginner" 
                        ? "text-green-600 bg-green-100/80 dark:text-green-400 dark:bg-green-500/20" 
                        : item.difficulty === "intermediate" 
                        ? "text-yellow-600 bg-yellow-100/80 dark:text-yellow-400 dark:bg-yellow-500/20" 
                        : "text-red-600 bg-red-100/80 dark:text-red-400 dark:bg-red-500/20"
                    }`}>
                      {item.difficulty}
                    </div>
                  )}
                </div>
              </>
            )}
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
        className={`group rounded-2xl border border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 relative cursor-pointer hover:border-purple-500/50 ${
          viewMode === "list" 
            ? "flex flex-row items-center p-4 h-[120px] hover:scale-[1.01]" 
            : "flex flex-col p-6 h-full hover:scale-[1.02]"
        }`}
        onClick={() => setShowContent(true)}
      >
        {/* Enhanced hover effect with stronger glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
        <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/50 to-blue-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
        <div className={`relative z-10 w-full ${viewMode === "list" ? "flex flex-row items-center gap-4" : "flex flex-col h-full"}`}>
        {canDelete && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full p-2 transition-all shadow-lg"
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
        {/* Icon section for list mode */}
        {viewMode === "list" && (
          <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-xl mr-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <span className="text-2xl">
              {item.type === 'blog' ? '📚' : '🎯'}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          {/* Header section */}
          {viewMode !== "list" && (
            <div className="flex items-center justify-between mb-4 relative z-10 pb-3 border-b border-border/20">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border ${
                item.type === 'blog' 
                  ? 'text-green-400 bg-green-500/20 border-green-500/30' 
                  : 'text-orange-400 bg-orange-500/20 border-orange-500/30'
              }`}>
                {item.type === 'blog' ? '📚' : '🎯'} {item.type.toUpperCase()}
              </span>
              {item.url && (
                <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-1 border border-border/30">
                  <ExternalLink className="w-3 h-3" />
                  External
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-display font-bold line-clamp-2 group-hover:text-purple-400 transition-colors duration-300 leading-tight text-foreground ${
              viewMode === "list" ? "text-lg" : "text-2xl mb-3 pr-8"
            }`}>
              {item.title}
            </h3>
            {viewMode === "list" && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border ml-2 flex-shrink-0 ${
                item.type === 'blog' 
                  ? 'text-green-400 bg-green-500/20 border-green-500/30' 
                  : 'text-orange-400 bg-orange-500/20 border-orange-500/30'
              }`}>
                {item.type.toUpperCase()}
              </span>
            )}
          </div>
          
          <p className={`text-muted-foreground line-clamp-2 leading-relaxed ${
            viewMode === "list" ? "text-sm" : "text-base mb-3"
          }`}>
            {item.summary}
          </p>
        </div>
        
        {viewMode !== "list" && (
          <>
            <div className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed mb-6 flex-1">
              {item.type === 'blog' ? (
                <span>
                  Master the art of analyzing company financials, P/E ratios, and balance sheets to make informed investment decisions. Learn key metrics and valuation techniques used by professional analysts.
                </span>
              ) : (
                <span>
                  Comprehensive course covering advanced strategies for experienced traders including options, algorithms, and quantitative analysis. Perfect for taking your trading skills to the next level.
                </span>
              )}
            </div>
            {/* Footer section with grid line */}
            <div className="flex items-center justify-between relative z-10 mt-auto pt-4 border-t border-border/20">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  item.type === 'blog' 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-br from-orange-500 to-red-500'
                }`}>
                  {item.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">By {item.author}</div>
                  {item.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.url, '_blank');
                      }}
                      className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors font-medium"
                    >
                      Read Original <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
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
      <DialogContent className="max-w-5xl p-0 bg-background/95 backdrop-blur-sm border border-border/50">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </DialogHeader>
        </div>
        <div className="aspect-video p-6 pt-4">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl shadow-xl"
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
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 bg-background/95 backdrop-blur-sm border border-border/50">
        <div className="p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{playlist.title}</DialogTitle>
            <p className="text-muted-foreground mt-1">{playlist.summary}</p>
          </DialogHeader>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-6 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xl">{currentVideo.title}</h3>
                <div className="text-sm text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  {currentVideoIndex + 1} of {playlistVideos.length}
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{currentVideo.summary}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>By {currentVideo.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-border/30">
              <h4 className="font-semibold mb-4 flex items-center text-foreground">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center mr-2">
                  <List className="w-4 h-4 text-primary" />
                </div>
                Playlist ({playlistVideos.length} videos)
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
                {playlistVideos.map((video, index) => {
                  if (!video) return null;
                  const isActive = index === currentVideoIndex;
                  return (
                    <div
                      key={video.id}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40 shadow-lg shadow-primary/10' 
                          : 'hover:bg-card/50 border border-transparent hover:border-border/50'
                      }`}
                      onClick={() => setCurrentVideoIndex(index)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`text-xs font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0 ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted/50 text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className={`font-medium text-sm leading-tight line-clamp-2 transition-colors ${
                            isActive ? 'text-foreground' : 'text-foreground/80'
                          }`}>
                            {video.title}
                          </h5>
                          <div className="flex items-center mt-2 text-xs">
                            <span className="text-muted-foreground">{video.duration}</span>
                            {isActive && (
                              <div className="ml-2 flex items-center text-primary">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse mr-1"></div>
                                <span className="font-medium">Playing</span>
                              </div>
                            )}
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

function VideoPlaylistsSection({ onDelete, searchQuery, viewMode }: { onDelete: (id: string) => void; searchQuery?: string; viewMode?: "grid" | "list" }) {
  const allItems = learnRepo.list();
  let playlists = allItems.filter(item => item.type === "playlist");
  let videos = allItems.filter(item => item.type === "video");
  
  // Apply search filter if provided
  if (searchQuery?.trim()) {
    const query = searchQuery.toLowerCase().trim();
    playlists = playlists.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
    videos = videos.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  }

  // Group videos by category
  const videosByCategory = videos.reduce((acc, video) => {
    const category = video.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(video);
    return acc;
  }, {} as Record<string, LearnItem[]>);

  const hasAnyContent = playlists.length > 0 || videos.length > 0;

  if (!hasAnyContent) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchQuery ? (
              <Search className="w-8 h-8 text-muted-foreground" />
            ) : (
              <Play className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? `No video results for "${searchQuery}"` : "No videos found"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? "Try adjusting your search terms or browse all available videos."
              : "No video content is available yet. Be the first to publish a video!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Playlists Section */}
      {playlists.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <List className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-50"></div>
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Video Playlists
                </h2>
                <p className="text-sm text-muted-foreground/70 mt-1">Curated video collections</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent flex-1"></div>
            <div className="backdrop-blur-sm bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
              <span className="text-sm font-semibold text-purple-300">
                {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
              </span>
            </div>
          </div>
          <div className={`${
            viewMode === "grid" 
              ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr" 
              : "flex flex-col gap-4"
          }`}>
            {playlists.map((playlist) => (
              <LearnCard key={playlist.id} item={playlist} onDelete={onDelete} viewMode={viewMode} />
            ))}
          </div>
        </div>
      )}

      {/* Videos by Category */}
      {Object.entries(videosByCategory).map(([category, categoryVideos]) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold">{category} Videos</h2>
            </div>
            <div className="h-px bg-border/50 flex-1"></div>
            <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              {categoryVideos.length} {categoryVideos.length === 1 ? 'video' : 'videos'}
            </span>
          </div>
          <div className={`${
            viewMode === "grid" 
              ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr" 
              : "flex flex-col gap-4"
          }`}>
            {categoryVideos.map((video) => (
              <LearnCard key={video.id} item={video} onDelete={onDelete} viewMode={viewMode} />
            ))}
          </div>
        </div>
      ))}

      {/* Uncategorized videos */}
      {videos.filter(v => !v.category).length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold">All Videos</h2>
            </div>
            <div className="h-px bg-border/50 flex-1"></div>
            <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              {videos.filter(v => !v.category).length} {videos.filter(v => !v.category).length === 1 ? 'video' : 'videos'}
            </span>
          </div>
          <div className={`${
            viewMode === "grid" 
              ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr" 
              : "flex flex-col gap-4"
          }`}>
            {videos.filter(v => !v.category).map((video) => (
              <LearnCard key={video.id} item={video} onDelete={onDelete} viewMode={viewMode} />
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

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

  // Generate search suggestions based on available content
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    
    // Add popular search terms
    suggestions.add("beginner");
    suggestions.add("intermediate");
    suggestions.add("advanced");
    suggestions.add("video");
    suggestions.add("course");
    suggestions.add("blog");
    
    // Add author names
    allItems.forEach(item => {
      if (item.author) suggestions.add(item.author);
      if (item.difficulty) suggestions.add(item.difficulty);
      if (item.category) suggestions.add(item.category);
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, [allItems]);
  
  const items = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return allItems;
    
    const query = debouncedSearchQuery.toLowerCase().trim();
    return allItems.filter(item => {
      // Search in basic fields
      const basicSearch = 
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query));
      
      // Search in type
      const typeSearch = item.type.toLowerCase().includes(query);
      
      // Search in difficulty
      const difficultySearch = item.difficulty?.toLowerCase().includes(query);
      
      // Search in content (for blogs and courses)
      const contentSearch = item.content?.toLowerCase().includes(query) || false;
      
      // Search in URL
      const urlSearch = item.url?.toLowerCase().includes(query) || false;
      
      return basicSearch || typeSearch || difficultySearch || contentSearch || urlSearch;
    });
  }, [allItems, debouncedSearchQuery]);
  const { user } = useAuth();

  const handleDelete = (id: string) => {
    const success = learnRepo.delete(id);
    if (success) {
      setRefreshKey(prev => prev + 1); // Trigger refresh
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section with prominent search */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold mb-6">Learn</h1>
        
        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            {/* Background gradient effects */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            
            <div className="relative bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl shadow-2xl group-hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 ml-4">
                  <Search className={`w-5 h-5 transition-colors duration-300 ${
                    searchQuery ? 'text-purple-400' : 'text-muted-foreground'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, author, difficulty, type, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                      setShowSearchSuggestions(false);
                      e.currentTarget.blur();
                    }
                  }}
                  className="flex-1 px-2 py-4 bg-transparent border-0 focus:outline-none placeholder:text-muted-foreground/70 text-base font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex items-center justify-center w-10 h-10 mr-4 rounded-xl bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200 group/clear"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 group-hover/clear:scale-110 transition-transform duration-200" />
                  </button>
                )}
                {!searchQuery && (
                  <div className="flex items-center mr-4 space-x-1 text-xs text-muted-foreground/50">
                    <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">Esc</kbd>
                    <span>to clear</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border/60 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4">
                  <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Popular Searches
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSearchSuggestions(false);
                        }}
                        className="text-left px-3 py-2 rounded-lg hover:bg-muted/30 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 capitalize"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Search hints */}
          {searchQuery && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-full text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>
                  {searchQuery !== debouncedSearchQuery ? (
                    "Searching..."
                  ) : (
                    <>
                      {items.length} result{items.length !== 1 ? 's' : ''}
                      {items.length > 0 && allItems.length > 0 && 
                        ` of ${allItems.length} total item${allItems.length !== 1 ? 's' : ''}`
                      }
                    </>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        
      </div>
      
      {/* Filter Buttons Row with View Toggle and Publish Button */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle - Left Side */}
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/60 rounded-2xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`flex items-center justify-center px-3 py-2 rounded-xl font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-background/80"
              }`}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`flex items-center justify-center px-3 py-2 rounded-xl font-medium transition-all ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-background/80"
              }`}
            >
              <List size={16} />
            </button>
          </div>

          {/* Filter Buttons - Center */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
                filter === "all" 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg" 
                  : "bg-background/50 backdrop-blur-sm border border-border/60 hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-blue-500/80 hover:text-white hover:border-transparent"
              }`}
            >
              <span className="text-lg">✨</span>
              <span>All Content</span>
            </button>
            <button
              onClick={() => setFilter("blog")}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
                filter === "blog" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" 
                  : "bg-background/50 backdrop-blur-sm border border-border/60 hover:bg-gradient-to-r hover:from-green-500/80 hover:to-emerald-500/80 hover:text-white hover:border-transparent"
              }`}
            >
              <span className="text-lg">📚</span>
              <span>Blogs</span>
            </button>
            <button
              onClick={() => setFilter("course")}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
                filter === "course" 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg" 
                  : "bg-background/50 backdrop-blur-sm border border-border/60 hover:bg-gradient-to-r hover:from-orange-500/80 hover:to-red-500/80 hover:text-white hover:border-transparent"
              }`}
            >
              <span className="text-lg">🎯</span>
              <span>Courses</span>
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
                filter === "video" 
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg" 
                  : "bg-background/50 backdrop-blur-sm border border-border/60 hover:bg-gradient-to-r hover:from-pink-500/80 hover:to-rose-500/80 hover:text-white hover:border-transparent"
              }`}
            >
              <span className="text-lg">💎</span>
              <span>Videos</span>
            </button>
          </div>
        </div>
        
        {/* Publish Button - Right Side */}
        {user && <PublishButton />}
      </div>

      {/* Content Section with Grid Lines */}
      {filter === "video" ? (
        <VideoPlaylistsSection onDelete={handleDelete} searchQuery={searchQuery} viewMode={viewMode} />
      ) : items.length > 0 ? (
        <div className="relative">
          {/* Grid background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-grid-pattern"></div>
          </div>
          
          {/* Content grid/list with border lines */}
          <div className={`relative border border-border/20 rounded-2xl p-6 bg-background/30 backdrop-blur-sm ${
            viewMode === "grid" 
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4" 
              : "flex flex-col gap-4"
          }`}>
            {/* Vertical grid lines (only in grid mode) */}
            {viewMode === "grid" && (
              <>
                <div className="absolute inset-y-0 left-1/2 w-px bg-border/20 hidden lg:block transform -translate-x-1/2"></div>
                <div className="absolute inset-y-0 left-1/3 w-px bg-border/20 hidden xl:block transform -translate-x-1/2"></div>
                <div className="absolute inset-y-0 left-2/3 w-px bg-border/20 hidden xl:block transform -translate-x-1/2"></div>
              </>
            )}
            
            {items.map((i) => (
              <LearnCard key={i.id} item={i} onDelete={handleDelete} viewMode={viewMode} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-lg mx-auto">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl">
                {debouncedSearchQuery ? (
                  <Search className="w-16 h-16 text-purple-400" />
                ) : (
                  <div className="text-4xl">
                    {filter === "all" ? "📚" : filter === "blog" ? "📝" : filter === "course" ? "🎯" : "🎥"}
                  </div>
                )}
              </div>
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-full blur-3xl opacity-50"></div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {debouncedSearchQuery ? `No results for "${debouncedSearchQuery}"` : `No ${filter === "all" ? "content" : filter + "s"} found`}
            </h3>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {debouncedSearchQuery 
                ? "Try adjusting your search terms or browse all available content."
                : filter === "all" 
                ? "No learning content is available yet. Be the first to publish something!" 
                : `No ${filter}s are available. Try switching to a different category or publish new content.`}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {debouncedSearchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-400 hover:text-purple-300 transition-all duration-300 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/50 font-medium transform hover:scale-105"
                >
                  <span>✨</span>
                  <span>Clear Search</span>
                </button>
              ) : null}
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

function PublishButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"blog" | "course" | "video">("blog");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("");
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
        <button className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/60 text-foreground font-medium hover:bg-gradient-to-r hover:from-purple-500/90 hover:to-blue-500/90 hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap">
          <span className="text-lg group-hover:animate-pulse">✨</span>
          <span>Publish your knowledge</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-background/20 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-500/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none before:rounded-2xl">
        <DialogHeader className="flex-shrink-0 pb-6 border-b border-white/10 bg-white/5 backdrop-blur-sm rounded-t-2xl -m-6 mb-0 p-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
            {type === "blog" ? "📝" : type === "course" ? "🎯" : "🎥"}
            Publish {type === "blog" ? "Blog" : type === "course" ? "Course" : "Video"}
          </DialogTitle>
          <p className="text-sm text-white/70 mt-2">
            Share your knowledge with the community and help others learn
          </p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-6 px-2 py-2 scroll-smooth">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/90 mb-3 block flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setType("blog")}
                className={`group relative overflow-hidden rounded-xl p-4 backdrop-blur-md border transition-all duration-300 transform hover:scale-105 ${
                  type === "blog" 
                    ? "bg-white/10 border-green-400/60 shadow-lg shadow-green-500/20" 
                    : "bg-white/5 border-white/20 hover:border-green-400/40 hover:bg-white/8"
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">📝</div>
                  <div className="text-sm font-medium text-white">Blog</div>
                  <div className="text-xs text-white/60">Written article</div>
                </div>
                {type === "blog" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl"></div>
                )}
              </button>
              <button
                onClick={() => setType("course")}
                className={`group relative overflow-hidden rounded-xl p-4 backdrop-blur-md border transition-all duration-300 transform hover:scale-105 ${
                  type === "course" 
                    ? "bg-white/10 border-orange-400/60 shadow-lg shadow-orange-500/20" 
                    : "bg-white/5 border-white/20 hover:border-orange-400/40 hover:bg-white/8"
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">🎯</div>
                  <div className="text-sm font-medium text-white">Course</div>
                  <div className="text-xs text-white/60">Learning series</div>
                </div>
                {type === "course" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl"></div>
                )}
              </button>
              <button
                onClick={() => setType("video")}
                className={`group relative overflow-hidden rounded-xl p-4 backdrop-blur-md border transition-all duration-300 transform hover:scale-105 ${
                  type === "video" 
                    ? "bg-white/10 border-red-400/60 shadow-lg shadow-red-500/20" 
                    : "bg-white/5 border-white/20 hover:border-red-400/40 hover:bg-white/8"
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">🎥</div>
                  <div className="text-sm font-medium text-white">Video</div>
                  <div className="text-xs text-white/60">YouTube tutorial</div>
                </div>
                {type === "video" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl"></div>
                )}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/90 block flex items-center gap-2">
              <span className="text-red-400">*</span>
              Title
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl bg-white/5 backdrop-blur-md border border-white/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/60 focus:bg-white/10 transition-all duration-300 placeholder:text-white/40 text-base font-medium hover:border-white/30 hover:bg-white/8 text-white"
                placeholder="Enter a descriptive title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/90 block flex items-center gap-2">
              <span className="text-red-400">*</span>
              Summary
            </label>
            <div className="relative">
              <textarea
                className="w-full rounded-xl bg-white/5 backdrop-blur-md border border-white/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/60 focus:bg-white/10 transition-all duration-300 resize-none placeholder:text-white/40 text-base leading-relaxed hover:border-white/30 hover:bg-white/8 text-white"
                placeholder="Provide a brief summary of the content..."
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Author field for blogs and courses */}
          {(type === "blog" || type === "course") && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/90 block flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                Author Name
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl bg-white/5 backdrop-blur-md border border-white/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400/60 focus:bg-white/10 transition-all duration-300 placeholder:text-white/40 text-base font-medium hover:border-white/30 hover:bg-white/8 text-white"
                  placeholder="Enter the author's name..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          )}

          {/* URL field for blogs and courses */}
          {(type === "blog" || type === "course") && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/90 block flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                Original Source URL (Optional)
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl bg-white/5 backdrop-blur-md border border-white/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/60 focus:bg-white/10 transition-all duration-300 placeholder:text-white/40 text-base font-medium hover:border-white/30 hover:bg-white/8 text-white"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <p className="text-xs text-white/50 flex items-center gap-1">
                <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                Link to the original website where this content was published
              </p>
            </div>
          )}
          
          {/* Video-specific fields */}
          {type === "video" && (
            <div className="space-y-6 p-6 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-2xl border border-red-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Video Details</h4>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground block flex items-center gap-2">
                  <span className="text-red-400">*</span>
                  <span className="text-red-500">YouTube</span> URL
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl bg-background/50 backdrop-blur-sm border border-border/40 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all duration-300 placeholder:text-muted-foreground/50 text-base font-medium hover:border-border/60"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Duration
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-xl bg-background/50 backdrop-blur-sm border border-border/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 placeholder:text-muted-foreground/50 text-base font-medium hover:border-border/60"
                      placeholder="e.g., 10:30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      difficulty === "beginner" ? "bg-green-400" :
                      difficulty === "intermediate" ? "bg-yellow-400" : "bg-red-400"
                    }`}></span>
                    Difficulty
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl bg-background/50 backdrop-blur-sm border border-border/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-300 text-base font-medium hover:border-border/60 appearance-none cursor-pointer"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")}
                      aria-label="Select difficulty level"
                    >
                      <option value="beginner">🟢 Beginner</option>
                      <option value="intermediate">🟡 Intermediate</option>
                      <option value="advanced">🔴 Advanced</option>
                    </select>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground block flex items-center gap-2">
                  <span className="text-lg">🏷️</span>
                  Category
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl bg-background/50 backdrop-blur-sm border border-border/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-300 placeholder:text-muted-foreground/50 text-base font-medium hover:border-border/60"
                    placeholder="e.g., Technical Analysis, Trading Strategy"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
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
        
        <div className="flex-shrink-0 flex items-center justify-between pt-6 border-t border-white/10 bg-white/5 backdrop-blur-sm -m-6 mt-0 p-6 rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="text-red-400">*</span>
            <span>Required fields</span>
          </div>
          <button
            disabled={!title || !summary || (type === "video" && !videoUrl) || (type === "video" && playlistMode === "new" && !newPlaylistTitle.trim())}
            className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-purple-500/25 disabled:hover:scale-100 disabled:hover:shadow-none"
            onClick={() => {
              const newItem: Omit<LearnItem, 'id' | 'createdAt'> = {
                type,
                title,
                summary,
                author: (type === "blog" || type === "course") && author.trim() 
                  ? author.trim() 
                  : user?.name || "Author",
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
              setAuthor("");
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
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              <span>Publish</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
