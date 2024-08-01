import { createRootRoute, Outlet } from '@tanstack/react-router';
import Footer from '../components/Footer';
import Header from '../components/Header';

export const Route = createRootRoute({
  component: () => (
    <>
      <div id="background"></div>
      <Header />
      <main className="pt-40">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});
