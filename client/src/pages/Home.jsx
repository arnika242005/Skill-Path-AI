import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Landing from '../components/home/Landing';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import SuccessStories from '../components/home/SuccessStories';
import CTA from '../components/home/CTA';

const Home = () => {
  return (
    <>
      <Navbar />
      <Landing />
      <HowItWorks />
      <WhyChooseUs />
      <SuccessStories />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;