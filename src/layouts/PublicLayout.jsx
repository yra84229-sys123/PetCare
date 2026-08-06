import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <>
      <Header />
      <div className="route-transition-shell">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default PublicLayout;
