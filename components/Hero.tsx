import DotGrid from "./DotGrid";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="section-padding">
        <div className="text-center">
          <h1 className="hero-section-title">
            <span className="hero-section-title-gradient">
              Generate Professional
            </span>
            <span className="hero-section-subtitle">Data-Driven SEO Reports</span>
            <span className="hero-section-title-gradient">in Seconds</span>
          </h1>

          <p className="hero-section-description">
            Harness the power of Bright Data&apos;s SERP Perplexity Scraper to
            create comprehensive SEO reports instantly.
            <span className="hero-section-description-highlight">
              {" "}
              Fast, simple, and incredibly insightful.
            </span>
          </p>

          {/* <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group border-0"
                  >
                    <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Generate My Report
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group border-0"
                  >
                    <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Generate My Report
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Authenticated>
            </div> */}
        </div>
      </div>
      <div className="inset-0 absolute">
        <DotGrid
          dotSize={2}
          gap={15}
          baseColor="#5227FF"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="hero-gradient-overlay" />
    </section>
  );
};

export default Hero;
