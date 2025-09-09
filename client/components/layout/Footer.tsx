export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-black/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4 text-sm text-muted-foreground">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md btn-gradient" />
            <span className="font-display font-semibold">AlgoTrader Pro</span>
          </div>
          <p className="mt-3 max-w-xs">Democratizing algorithmic trading for everyone.</p>
        </div>
        <div>
          <p className="text-white/80 font-medium">Product</p>
          <ul className="mt-3 space-y-2">
            <li><a className="hover:text-white" href="/dashboard">Dashboard</a></li>
            <li><a className="hover:text-white" href="/builder">Strategy Builder</a></li>
            <li><a className="hover:text-white" href="/marketplace">Marketplace</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white/80 font-medium">Resources</p>
          <ul className="mt-3 space-y-2">
            <li><a className="hover:text-white" href="/learn">Learn</a></li>
            <li><a className="hover:text-white" href="#">Docs</a></li>
            <li><a className="hover:text-white" href="#">Status</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white/80 font-medium">Stay up to date</p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-3 py-2 rounded-md btn-gradient text-black font-medium">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} AlgoTrader Pro. All rights reserved.</div>
    </footer>
  );
}
