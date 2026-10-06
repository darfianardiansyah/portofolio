import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import PortfolioPage from "./PortfolioPage";
import RouteBoundary from "./RouteBoundary";

const GamePage = lazy(() => import("./game/GamePage"));

function Pages() {
  const location = useLocation();
  return <>
    <RouteBoundary key={location.pathname}>
      <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#f6f1df] text-[#253f35]" role="status">Menyiapkan taman…</main>}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/3d" element={<GamePage />} />
          <Route path="*" element={<main className="grid min-h-screen place-content-center gap-4 text-center"><h1 className="text-3xl">Halaman tidak ditemukan</h1><Link to="/">Kembali ke Portofolio</Link></main>} />
        </Routes>
      </Suspense>
    </RouteBoundary>
    <Analytics />
  </>;
}

export default function App() {
  return <BrowserRouter><Pages /></BrowserRouter>;
}
