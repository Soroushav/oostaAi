import React from 'react';
import Testimonials from "../ui/Testimonials";
import HeroSection from "./HeroSection";
import FAQ from "../ui/FAQ";

const Main: React.FC = () => {
    return (
        <>
            <HeroSection />
            <Testimonials />
            <FAQ />
        </>
    )
}

export default Main