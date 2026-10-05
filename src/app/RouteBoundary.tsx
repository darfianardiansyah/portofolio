import { Component, type ReactNode } from "react";
import { Link } from "react-router";

export default class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return (
      <main className="grid min-h-screen place-content-center gap-5 bg-[#f6f1df] p-8 text-center text-[#253f35]">
        <h1 className="text-2xl font-semibold">Dunia belum dapat dibuka</h1>
        <p>Periksa koneksi, lalu coba muat halaman kembali.</p>
        <button className="rounded-xl bg-[#253f35] px-5 py-3 text-white" onClick={() => window.location.reload()}>Coba lagi</button>
        <Link to="/">Kembali ke Portofolio</Link>
      </main>
    );
    return this.props.children;
  }
}
