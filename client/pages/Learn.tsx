import { useMemo, useState } from "react";
import { learnRepo, LearnItem } from "@/lib/learnRepo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

export default function Learn() {
  const [filter, setFilter] = useState<'all'|'blog'|'course'>('all');
  const items = useMemo(() => learnRepo.list(filter==='all'?undefined:filter), [filter]);
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Learn</h1>
        <div className="flex items-center gap-2">
          <button onClick={()=>setFilter('all')} className={`px-3 py-1.5 rounded-md text-sm ${filter==='all'?'btn-gradient text-black':'border border-white/15'}`}>All</button>
          <button onClick={()=>setFilter('blog')} className={`px-3 py-1.5 rounded-md text-sm ${filter==='blog'?'btn-gradient text-black':'border border-white/15'}`}>Blogs</button>
          <button onClick={()=>setFilter('course')} className={`px-3 py-1.5 rounded-md text-sm ${filter==='course'?'btn-gradient text-black':'border border-white/15'}`}>Courses</button>
          {user && (
            <PublishButton />
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <article key={i.id} className="rounded-xl border border-border/60 bg-card-gradient p-5 hover:shadow-md transition">
            <div className="text-xs uppercase text-muted-foreground">{i.type}</div>
            <h3 className="mt-1 font-display text-lg">{i.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{i.summary}</p>
            <div className="mt-3 text-xs text-muted-foreground">By {i.author}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PublishButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'blog'|'course'>('blog');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const { user } = useAuth();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 py-1.5 rounded-md btn-gradient text-black text-sm">Publish</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish {type === 'blog' ? 'Blog' : 'Course'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="flex gap-2 text-sm">
            <button onClick={()=>setType('blog')} className={`px-3 py-1.5 rounded-md ${type==='blog'?'btn-gradient text-black':'border border-white/15'}`}>Blog</button>
            <button onClick={()=>setType('course')} className={`px-3 py-1.5 rounded-md ${type==='course'?'btn-gradient text-black':'border border-white/15'}`}>Course</button>
          </div>
          <input className="rounded-md bg-card/60 border border-border/60 px-3 py-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <textarea className="rounded-md bg-card/60 border border-border/60 px-3 py-2" placeholder="Summary" rows={4} value={summary} onChange={(e)=>setSummary(e.target.value)} />
          <button disabled={!title || !summary} className="px-4 py-2 rounded-md btn-gradient text-black font-medium" onClick={()=>{ learnRepo.create({ type, title, summary, author: user?.name || 'Author' }); setOpen(false); location.reload(); }}>Publish</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
