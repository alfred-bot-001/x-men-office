// ============================================================
// Simple Hash Router
// ============================================================
class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }
  navigate(path) {
    window.location.hash = path;
  }
  resolve() {
    const hash = window.location.hash.replace('#','') || '/';
    const route = this.routes[hash] || this.routes['/'];
    if (route) route();
  }
}
