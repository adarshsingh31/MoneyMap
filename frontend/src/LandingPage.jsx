import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import Lightfall from "./components/Lightfall";
import Antigravity from "./components/Antigravity";


const LandingPage = () => {
  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) {
      console.error("ThreeJS is not loaded on window.");
      return;
    }
    const container = document.getElementById("threejs-container-ANIMATION_15");
    if (!container) return;

    // Clear container first to avoid duplicate render
    container.innerHTML = "";

    const scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6, 4, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x14b8a6, 1.2);
    mainLight.position.set(5, 10, 5);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x3b82f6, 1, 20);
    accentLight.position.set(-5, 2, 5);
    scene.add(accentLight);

    // Group for the chart
    const chartGroup = new THREE.Group();
    scene.add(chartGroup);

    // Materials
    const glassMaterial = new THREE.MeshPhongMaterial({
      color: 0x14b8a6,
      shininess: 100,
      specular: 0xffffff,
      transparent: true,
      opacity: 0.7,
      flatShading: false,
    });

    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x22c55e,
      shininess: 80,
      emissive: 0x06251c,
      emissiveIntensity: 0.2,
    });

    // Create animated bars
    const barCount = 7;
    const bars = [];
    const spacing = 1.4;

    for (let i = 0; i < barCount; i++) {
      const h = 2 + Math.random() * 4;
      const geometry = new THREE.BoxGeometry(0.8, 1, 0.8);
      const bar = new THREE.Mesh(
        geometry,
        i % 2 === 0 ? glassMaterial.clone() : solidMaterial.clone()
      );

      bar.position.x = (i - (barCount - 1) / 2) * spacing;
      bar.position.y = -3; // Base position
      bar.scale.y = h;
      bar.position.y += h / 2;

      chartGroup.add(bar);
      bars.push({
        mesh: bar,
        baseH: h,
        offset: i * 0.5,
        speed: 0.001 + Math.random() * 0.002,
      });
    }

    // Floating "coins" or tokens
    const tokens = [];
    const tokenGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 32);
    const tokenMat = new THREE.MeshPhongMaterial({
      color: 0xfacc15,
      shininess: 100,
    });

    for (let i = 0; i < 15; i++) {
      const token = new THREE.Mesh(tokenGeom, tokenMat);
      token.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
      );
      token.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      );
      scene.add(token);
      tokens.push({
        mesh: token,
        rotSpeed: 0.01 + Math.random() * 0.02,
        floatSpeed: 0.005 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId;
    const animate = (t) => {
      animationFrameId = requestAnimationFrame(animate);

      // Subtle group rotation based on mouse
      chartGroup.rotation.y += (mouseX * 0.5 - chartGroup.rotation.y) * 0.05;
      chartGroup.rotation.x += (mouseY * 0.2 - chartGroup.rotation.x) * 0.05;

      // Bar pulse animation
      bars.forEach((b) => {
        const pulse = Math.sin(t * 0.001 + b.offset) * 0.2;
        b.mesh.scale.y = b.baseH + pulse;
        b.mesh.position.y = (b.baseH + pulse) / 2 - 3;
      });

      // Token floating animation
      tokens.forEach((tk) => {
        tk.mesh.rotation.x += tk.rotSpeed;
        tk.mesh.rotation.y += tk.rotSpeed;
        tk.mesh.position.y += Math.sin(t * 0.001 + tk.phase) * 0.005;
      });

      renderer.render(scene, camera);
    };

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    animate(0);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
      }
      if (container && renderer.domElement) {
        container.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    // Smooth reveal on scroll interaction
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.classList.add(
        "transition-all",
        "duration-1000",
        "ease-out",
        "opacity-0",
        "translate-y-10"
      );
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative bg-background min-h-screen overflow-hidden">
      {/* Antigravity background for all sections except Hero section */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <Antigravity
          count={120}
          magnetRadius={10}
          ringRadius={10}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={2}
          lerpSpeed={0.1}
          color="#6366F1"
          autoAnimate={false}
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>

      {/* Glow Orbs for Ambiance */}
      <div className="glow-orb w-[600px] h-[600px] bg-gradient-start top-[-200px] left-[-100px]"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-gradient-end bottom-0 right-[-100px]"></div>

      {/* Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-16">
        <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              alt="MoneyMap Logo"
              className="h-10 w-auto"
              src={logo}
            />
            <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
              MoneyMap
            </span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <a
              className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Features
            </a>
            <a
              className="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Analytics
            </a>
            <a
              className="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Pricing
            </a>
            <a
              className="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Testimonials
            </a>
            <a
              className="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-stack-md">
            <Link to="/login" className="hidden sm:block text-primary font-medium font-body-md text-body-md scale-95 active:scale-90 transition-transform text-center">
              Login
            </Link>
            <Link to="/register" className="btn-gradient px-6 py-2 rounded-lg text-white font-bold font-body-md text-body-md shadow-lg text-center">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-section-padding px-gutter overflow-hidden bg-background z-10">
        {/* WebGL Background Animation */}
        <div className="absolute inset-0 z-0">
          <Lightfall
            speed={0.25}
            streakCount={6}
            streakWidth={1.2}
            streakLength={1.2}
            glow={0.8}
            density={0.4}
            twinkle={0.8}
            zoom={2.5}
            backgroundGlow={0.3}
            opacity={0.6}
            colors={['#10B981', '#059669', '#34D399', '#A7F3D0', '#D1FAE5']}
            backgroundColor="#F8FAFC"
            mouseInteraction={true}
            mouseStrength={0.5}
            mouseRadius={1.2}
          />
        </div>
        <div className="max-w-container-max mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/50 mb-8">
            <span className="material-symbols-outlined text-primary text-[18px]">
              verified
            </span>
            <span className="text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant">
              Trusted by thousands of users
            </span>
          </div>
          <h1 className="font-display-hero text-display-hero md:text-display-hero-mobile max-w-4xl mx-auto mb-6 text-text-primary leading-tight">
            Map Every Rupee.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gradient-mid">
              Master Every Decision.
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Track expenses, manage budgets, analyze spending habits, and achieve
            financial freedom with powerful insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-stack-md">
            <Link to="/register" className="btn-gradient px-8 py-4 rounded-xl text-white font-bold font-headline-md flex items-center gap-3 w-full sm:w-auto justify-center hover:scale-[1.02] transition-transform">
              Get Started Free
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <button className="bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant/50 px-8 py-4 rounded-xl font-bold font-headline-md text-on-surface w-full sm:w-auto hover:bg-surface-container-highest transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-gutter pb-section-padding relative z-10">
        <div className="max-w-container-max mx-auto">
          <div className="glass-card rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <span className="font-data-md text-data-md text-primary opacity-50">
                FINANCE_OS_V2.0
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
              {/* Sidebar Mockup */}
              <div className="lg:col-span-3 space-y-6">
                <div className="space-y-2">
                  <p className="font-label-sm text-label-sm text-outline uppercase">
                    Total Balance
                  </p>
                  <h3 className="font-data-lg text-data-lg text-text-primary">
                    ₹1,24,500.00
                  </h3>
                </div>
                <div className="space-y-4 pt-6 border-t border-outline-variant/30">
                  <div className="flex items-center gap-3 p-3 bg-primary-container/20 rounded-lg text-primary">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="font-body-md font-bold">Overview</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant/30 rounded-lg transition-all cursor-pointer">
                    <span className="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                    <span className="font-body-md">Wallets</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant/30 rounded-lg transition-all cursor-pointer">
                    <span className="material-symbols-outlined">trending_up</span>
                    <span className="font-body-md">Analytics</span>
                  </div>
                </div>
              </div>
              {/* Main Content Mockup */}
              <div className="lg:col-span-9 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                  <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
                    <p className="text-label-sm font-label-sm text-outline mb-2">
                      INCOME
                    </p>
                    <div className="flex items-end justify-between">
                      <span className="font-data-lg text-data-lg text-tertiary">
                        +₹45,000
                      </span>
                      <div className="w-12 h-1 bg-tertiary/20 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-tertiary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
                    <p className="text-label-sm font-label-sm text-outline mb-2">
                      EXPENSES
                    </p>
                    <div className="flex items-end justify-between">
                      <span className="font-data-lg text-data-lg text-error">
                        -₹12,400
                      </span>
                      <div className="w-12 h-1 bg-error/20 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-error"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/30">
                    <p className="text-label-sm font-label-sm text-outline mb-2">
                      SAVINGS
                    </p>
                    <div className="flex items-end justify-between">
                      <span className="font-data-lg text-data-lg text-gradient-mid">
                        ₹32,600
                      </span>
                      <div className="w-12 h-1 bg-gradient-mid/20 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-gradient-mid"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 3D Visualization */}
                <div className="w-full mt-8 bg-surface-container-low/30 rounded-2xl border border-outline-variant/30 relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/80 backdrop-blur-sm border border-outline-variant/50">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-label-sm font-label-sm text-on-surface uppercase tracking-wider">
                      LIVE FINANCIAL GROWTH
                    </span>
                  </div>
                  <div
                    className="w-full h-full min-h-[400px] bg-transparent"
                    style={{ display: "block" }}
                  >
                    <div
                      id="threejs-container-ANIMATION_15"
                      style={{ width: "100%", height: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-container-lowest border-y border-outline-variant/30 py-16">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="font-display-hero-mobile text-display-hero-mobile text-primary mb-2">
              50K+
            </h4>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Active Users
            </p>
          </div>
          <div>
            <h4 className="font-display-hero-mobile text-display-hero-mobile text-text-primary mb-2">
              ₹10Cr+
            </h4>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Tracked Monthly
            </p>
          </div>
          <div>
            <h4 className="font-display-hero-mobile text-display-hero-mobile text-text-primary mb-2">
              1M+
            </h4>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Transactions
            </p>
          </div>
          <div>
            <h4 className="font-display-hero-mobile text-display-hero-mobile text-gradient-end mb-2">
              98%
            </h4>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Satisfaction
            </p>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-section-padding px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-4">
              Precision Engineering for Your Purse
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Our features are built to give you 20/20 financial vision.
            </p>
          </div>
          <div className="bento-grid">
            <div className="col-span-12 md:col-span-8 bg-surface border border-outline-variant/30 rounded-2xl p-8 hover:border-primary/50 transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform">
                receipt_long
              </span>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Smart Tracking
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Automatically categorize transactions from SMS and bank
                notifications with 99.9% accuracy.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 bg-surface border border-outline-variant/30 rounded-2xl p-8 hover:border-gradient-mid/50 transition-colors group">
              <span className="material-symbols-outlined text-gradient-mid text-4xl mb-4 group-hover:scale-110 transition-transform">
                insights
              </span>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                AI Analytics
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Get deep insights into where your money goes.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 bg-surface border border-outline-variant/30 rounded-2xl p-8 hover:border-error/50 transition-colors group">
              <span className="material-symbols-outlined text-error text-4xl mb-4 group-hover:scale-110 transition-transform">
                account_balance
              </span>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Budget Planning
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Set limits and get real-time alerts before you overspend.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 bg-surface border border-outline-variant/30 rounded-2xl p-8 hover:border-tertiary/50 transition-colors group">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-4 group-hover:scale-110 transition-transform">
                cloud_sync
              </span>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Universal Cloud Sync
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Access your data across mobile, web, and tablet instantly with
                end-to-end encryption for total security.
              </p>
            </div>
            <div className="col-span-12 md:col-span-6 bg-surface border border-outline-variant/30 rounded-2xl p-8 hover:border-primary/50 transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform">
                payments
              </span>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Income Management
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Track multiple income streams, freelance payouts, and investments
                effortlessly.
              </p>
            </div>
            <div className="col-span-12 md:col-span-6 bg-surface border border-outline-variant/30 rounded-2xl p-8 hover:border-gradient-mid/50 transition-colors group">
              <span className="material-symbols-outlined text-gradient-mid text-4xl mb-4 group-hover:scale-110 transition-transform">
                description
              </span>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Detailed Reports
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Export professional PDF/CSV reports for taxes or personal reviews
                with a single tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-section-padding px-gutter bg-surface-container-lowest/50 relative overflow-hidden">
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-4">
              Your Path to Wealth in 4 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-primary/0 via-outline-variant/50 to-primary/0 -z-10"></div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mx-auto text-primary font-headline-md">
                1
              </div>
              <h4 className="font-headline-md text-headline-md text-text-primary">
                Create Account
              </h4>
              <p className="font-body-md text-on-surface-variant">
                Sign up securely in 30 seconds.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mx-auto text-primary font-headline-md">
                2
              </div>
              <h4 className="font-headline-md text-headline-md text-text-primary">
                Add Data
              </h4>
              <p className="font-body-md text-on-surface-variant">
                Sync banks or enter manually.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mx-auto text-primary font-headline-md">
                3
              </div>
              <h4 className="font-headline-md text-headline-md text-text-primary">
                Set Budgets
              </h4>
              <p className="font-body-md text-on-surface-variant">
                Define your monthly limits.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mx-auto text-primary font-headline-md">
                4
              </div>
              <h4 className="font-headline-md text-headline-md text-text-primary">
                Get Insights
              </h4>
              <p className="font-body-md text-on-surface-variant">
                Watch your wealth grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-section-padding px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-4">
              Invest in Your Financial Peace
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="glass-card rounded-3xl p-8 border border-outline-variant/30 flex flex-col">
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Free
              </h3>
              <p className="font-body-md text-on-surface-variant mb-6">
                Perfect for starters.
              </p>
              <div className="mb-8">
                <span className="font-headline-lg text-headline-lg text-text-primary">
                  ₹0
                </span>
                <span className="text-on-surface-variant">/forever</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Manual tracking
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  2 Budget limits
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Basic analytics
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-outline-variant text-text-primary font-bold hover:bg-surface-variant transition-colors">
                Start Free
              </button>
            </div>
            {/* Pro */}
            <div className="relative glass-card rounded-3xl p-8 border-2 border-primary shadow-[0_0_40px_rgba(20,184,166,0.15)] flex flex-col scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-label-sm font-label-sm">
                MOST POPULAR
              </div>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Pro
              </h3>
              <p className="font-body-md text-on-surface-variant mb-6">
                For the finance serious.
              </p>
              <div className="mb-8">
                <span className="font-headline-lg text-headline-lg text-text-primary">
                  ₹199
                </span>
                <span className="text-on-surface-variant">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Auto bank sync
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Unlimited budgets
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  AI spending alerts
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Multi-device sync
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl btn-gradient text-white font-bold">
                Go Pro Now
              </button>
            </div>
            {/* Premium */}
            <div className="glass-card rounded-3xl p-8 border border-outline-variant/30 flex flex-col">
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">
                Premium
              </h3>
              <p className="font-body-md text-on-surface-variant mb-6">
                Total financial mastery.
              </p>
              <div className="mb-8">
                <span className="font-headline-lg text-headline-lg text-text-primary">
                  ₹499
                </span>
                <span className="text-on-surface-variant">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Investment tracking
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Tax optimization AI
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Custom white-label reports
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-outline-variant text-text-primary font-bold hover:bg-surface-variant transition-colors">
                Upgrade Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-section-padding px-gutter bg-surface-container-lowest/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-text-primary mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-surface rounded-xl p-6 border border-outline-variant/30 cursor-pointer group hover:border-primary/50 transition-all">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-headline-md text-text-primary">
                  Is my data secure?
                </h4>
                <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:rotate-180">
                  expand_more
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant hidden group-active:block group-hover:block">
                Yes, we use bank-grade 256-bit AES encryption. Your data is stored
                on decentralized servers with zero-knowledge access.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 border border-outline-variant/30 cursor-pointer group hover:border-primary/50 transition-all">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-headline-md text-text-primary">
                  Can I export my data?
                </h4>
                <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:rotate-180">
                  expand_more
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant hidden group-active:block group-hover:block">
                Absolutely. You can export your entire transaction history in PDF,
                CSV, or Excel formats anytime you want.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 border border-outline-variant/30 cursor-pointer group hover:border-primary/50 transition-all">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-headline-md text-text-primary">
                  How does AI tracking work?
                </h4>
                <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:rotate-180">
                  expand_more
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant hidden group-active:block group-hover:block">
                Our proprietary AI reads transaction descriptors and maps them to
                categories based on patterns from millions of anonymous data
                points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-section-padding px-gutter text-center relative overflow-hidden">
        <div className="glow-orb w-[800px] h-[800px] bg-primary top-[-400px] left-1/2 -translate-x-1/2 opacity-10"></div>
        <div className="max-w-container-max mx-auto relative z-10">
          <h2 className="font-display-hero text-display-hero md:text-display-hero-mobile text-text-primary mb-8">
            Take Control of Your Financial Future Today.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-xl mx-auto">
            Join over 50,000+ people who are already mastering their money with
            MoneyMap AI.
          </p>
          <Link to="/register" className="inline-block btn-gradient px-12 py-5 rounded-2xl text-white font-bold font-headline-md text-xl shadow-2xl hover:scale-105 transition-all">
            Get Started for Free
          </Link>
          <p className="mt-6 text-label-sm text-outline">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-section-padding border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg max-w-container-max mx-auto px-gutter">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img
                alt="MoneyMap Logo"
                className="h-8 w-auto"
                src={logo}
              />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                MoneyMap
              </span>
            </Link>
            <p className="font-body-md text-on-surface-variant">
              © 2024 MoneyMap AI. All rights reserved. Precision in every penny.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">
                language
              </span>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">
                share
              </span>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">
                mail
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-label-sm text-label-sm text-text-primary uppercase tracking-widest">
              Product
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Analytics
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-label-sm text-label-sm text-text-primary uppercase tracking-widest">
              Company
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-label-sm text-label-sm text-text-primary uppercase tracking-widest">
              Legal
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                  href="#"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
