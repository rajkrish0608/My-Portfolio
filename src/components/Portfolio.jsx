import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Cpu, Server, Zap, Database, Code, Send } from 'lucide-react';
import * as THREE from 'three';
import _ from 'lodash';

// Custom Neural Network Background Component
const NeuralNetworkBackground = () => {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create neural network nodes and connections
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Lines connecting nodes
    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2
    });
    
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);
    
    // Create connections between nearby points
    const connectNearbyPoints = () => {
      linesGroup.clear();
      
      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x1 = positions[i];
        const y1 = positions[i + 1];
        const z1 = positions[i + 2];
        
        for (let j = i + 3; j < positions.length; j += 3) {
          const x2 = positions[j];
          const y2 = positions[j + 1];
          const z2 = positions[j + 2];
          
          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2) +
            Math.pow(z2 - z1, 2)
          );
          
          if (distance < 3) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(x1, y1, z1),
              new THREE.Vector3(x2, y2, z2)
            ]);
            
            const line = new THREE.Line(lineGeometry, linesMaterial);
            linesGroup.add(line);
          }
        }
      }
    };
    
    connectNearbyPoints();
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.0005;
      linesGroup.rotation.x += 0.0005;
      linesGroup.rotation.y += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!mounted) return null;
  
  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
};

// HUD Circle Component
const HudCircle = ({ size = 'md', pulseColor = 'cyan', className = '', children }) => {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40',
    '2xl': 'h-48 w-48',
  };
  
  const pulseColorClasses = {
    cyan: 'before:from-cyan-500/20 before:to-cyan-500/0',
    purple: 'before:from-purple-500/20 before:to-purple-500/0',
    red: 'before:from-red-500/20 before:to-red-500/0',
  };
  
  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center
      border border-cyan-500/50 backdrop-blur-sm 
      before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r
      ${pulseColorClasses[pulseColor]} before:animate-pulse before:z-0 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Tech Skill Card Component
const TechSkillCard = ({ icon, name, level = 90, color = 'cyan' }) => {
  const colorClasses = {
    cyan: 'from-cyan-400 to-cyan-600',
    purple: 'from-purple-400 to-purple-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    red: 'from-red-400 to-red-600',
  };
  
  return (
    <motion.div
      className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-cyan-400">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
      </div>
      
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

// Main Portfolio Component
export default function Portfolio() {
  const [section, setSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Simulate system boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Section navigation variants
  const navVariants = {
    inactive: { opacity: 0.7, scale: 1 },
    active: { 
      opacity: 1,
      scale: 1.05,
      textShadow: '0 0 8px rgba(0, 255, 255, 0.7)',
    },
    hover: {
      scale: 1.1,
      textShadow: '0 0 12px rgba(0, 255, 255, 0.9)',
    }
  };
  
  // Projects data
  const projects = [
    {
      id: 1,
      title: "Neural Interface",
      description: "Brainwave-to-machine interface using advanced AI models for direct thought control of robotic systems.",
      tags: ["AI", "Neural Networks", "BCI"],
      color: "cyan",
      icon: <Cpu size={20} />
    },
    {
      id: 2,
      title: "Autonomous Drone",
      description: "Self-navigating drone with computer vision capable of mapping unknown environments and responding to dynamic obstacles.",
      tags: ["Robotics", "Computer Vision", "Lidar"],
      color: "purple",
      icon: <Zap size={20} />
    },
    {
      id: 3,
      title: "Quantum Computing API",
      description: "Cloud-based interface for quantum computing algorithms with practical applications in cryptography and optimization problems.",
      tags: ["Quantum", "API", "Cloud"],
      color: "blue",
      icon: <Server size={20} />
    },
    {
      id: 4,
      title: "Smart City Grid",
      description: "IoT network with distributed AI processing for urban infrastructure management and optimization.",
      tags: ["IoT", "Smart City", "Distributed Systems"],
      color: "green",
      icon: <Database size={20} />
    },
    {
      id: 5,
      title: "AR Development Kit",
      description: "Framework for integrating AI with augmented reality visualizations for industrial applications.",
      tags: ["AR", "SDK", "Industry 4.0"],
      color: "cyan",
      icon: <Code size={20} />
    }
  ];
  
  // System boot sequence
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyan-400 font-mono">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-8 tracking-wider">SYSTEM BOOT SEQUENCE</h1>
          
          <div className="space-y-4 text-left max-w-md mx-auto">
            {[
              "Initializing neural network interface...",
              "Loading quantum algorithms...",
              "Calibrating holographic display...",
              "Establishing secure connection...",
              "Activating user interface..."
            ].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.4 }}
                className="flex items-center"
              >
                <ChevronRight size={16} className="mr-2 text-cyan-500" />
                <span>{text}</span>
                {index === 4 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-2"
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 2 }}
            className="h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-8 rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden relative">
      {/* Neural network background */}
      <NeuralNetworkBackground />
      
      {/* Overlay patterns */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-screen bg-[url('/grid.svg')] opacity-20"></div>
      </div>
      
      {/* Header with HUD elements */}
      <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-black/30 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.h1 
            className="text-2xl font-bold text-cyan-400 tracking-widest relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              textShadow: ['0 0 0px rgba(34, 211, 238, 0)', '0 0 10px rgba(34, 211, 238, 0.7)', '0 0 5px rgba(34, 211, 238, 0.5)']
            }}
            transition={{ 
              duration: 1,
              textShadow: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
            }}
          >
            RAJ_KRISH
            <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-cyan-500 to-transparent"></span>
          </motion.h1>
          
          {/* Navigation */}
          <nav className="flex gap-6 text-sm">
            {['home', 'about', 'projects', 'skills', 'contact', 'awards'].map(s => (
              <motion.button
                key={s}
                onClick={() => setSection(s)}
                variants={navVariants}
                initial="inactive"
                animate={section === s ? "active" : "inactive"}
                whileHover="hover"
                transition={{ duration: 0.2 }}
                className={`uppercase tracking-wider relative ${section === s ? 'text-cyan-300' : 'text-gray-300'}`}
              >
                {s}
                {section === s && (
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-500"
                    layoutId="navIndicator"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {section === 'home' && (
              <motion.section 
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center min-h-[80vh] py-12 relative"
              >
                {/* Main title */}
                <motion.h2
                  className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400 text-transparent bg-clip-text tracking-tighter"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  ENGINEERING
                  <br />
                  <span className="text-6xl sm:text-7xl md:text-8xl">INTELLIGENCE</span>
                </motion.h2>
                
                {/* Tagline */}
                <motion.p
                  className="mt-6 max-w-2xl text-center text-lg text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Versatile and innovative developer with hands-on experience in IoT, Robotics, AI, and Web Development. Skilled in building scalable, real-world solutions such as autonomous systems, health-monitoring wearables, and smart web platforms. Strong problem-solver with a broad tech stack and a passion for creating intelligent, user-centric products. Proven ability to integrate hardware and software for impactful, cross-domain applications.
                </motion.p>
                
                {/* Interactive profile image with HUD elements */}
                <motion.div
                  className="relative mt-16 mb-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  {/* Main profile image */}
                  <div className="relative z-10 w-64 h-64 rounded-full border-4 border-cyan-400 overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-900/50 z-10"></div>
                    <img src="/profile.jpg" alt="Profile" className="object-cover w-full h-full" />
                  </div>
                  
                  {/* HUD decorative elements */}
                  <HudCircle size="2xl" className="absolute -inset-8 z-0 border-dashed animate-spin-slow opacity-70" />
                  <HudCircle size="sm" pulseColor="purple" className="absolute -top-4 -right-4 z-20" />
                  <HudCircle size="sm" pulseColor="cyan" className="absolute -bottom-4 -left-4 z-20" />
                  
                  {/* Scanning effect */}
                  <motion.div
                    className="absolute inset-0 z-20 bg-gradient-to-b from-cyan-500/10 to-transparent"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
                  />
                </motion.div>
                
                {/* Bio */}
                <motion.p
                  className="text-center text-gray-300 max-w-lg mx-auto relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <span className="text-cyan-400 font-bold">// Bio:</span> Hi, I'm Raj — a passionate developer blending AI, robotics, and embedded systems to build meaningful technology.
                </motion.p>

                <motion.div className="mt-8 space-y-4 text-center max-w-2xl mx-auto">
  {/* <p className="text-gray-300">
    🚀 <strong>Building something bold?</strong><br/>
    Crafting battlefield bots, medtech wearables, or real-time AI systems? I love trading notes with fellow builders—send me what you’re making. <br/>
    <strong>Let’s collaborate on tech that doesn’t just work—it matters.</strong>
  </p> */}

  <div className="flex justify-center gap-4">
    <a href="https://www.linkedin.com/in/raj-krish-3a7a3b285/" target="_blank" className="text-cyan-400 hover:underline">LinkedIn</a>
    <a href="https://github.com/rajkrish0608" target="_blank" className="text-cyan-400 hover:underline">GitHub</a>
    <a href="https://yourwebsite.com" target="_blank" className="text-cyan-400 hover:underline">Website</a>
    <a href="rajkrish060804@gmail.com" className="text-cyan-400 hover:underline">Email</a>
  </div>

  <a
    href="/Raj_Resume.pdf"
    target="_blank"
    className="inline-block mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded shadow"
  >
    📄 View Resume
  </a>
</motion.div>

                
                {/* Decorative code comment */}
                <div className="absolute bottom-8 left-8 text-xs text-cyan-600/70 hidden md:block">
                  <pre>
                    {`/*
 * Neural Network Status: ONLINE
 * Quantum Processing: ACTIVE 
 * System Efficiency: 98.7%
 */`}
                  </pre>
                </div>
              </motion.section>
            )}

            {section === 'about' && (
              <motion.section 
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto py-12 px-4"
              >
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  {/* About content */}
                  <motion.div
                    className="flex-1 space-y-6"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text">
                      SYSTEM ARCHITECT
                    </h2>
                    
                    <div className="space-y-4 text-gray-300">
                      <p>
                        I’m Raj Krish, a purpose-driven engineering student (B.Tech, Computer Engineering, Batch ’27) with a passion for building intelligent systems that solve real-world problems. I specialize in Robotics, IoT, AI/ML, and Full-Stack Development—creating smart, responsive technologies that matter.
                      </p>
                      
                      <p>
                        My work spans battlefield AI wearables, smart mobility solutions, and emergency health devices. I’ve won the Harvard Business School Hackathon, secured 1st Runner-Up at the Microsoft x Stanford Hackathon, and earned 5+ national and international awards for real-time, hardware-software integrated innovations.
                      </p>
                      
                      <p>
                        Currently a Robotics Intern at Alpixn Technologies, I build systems using ESP32, Raspberry Pi, sensors, and machine learning. I also lead Pradyog, mentoring 200+ students in hands-on innovation.
                      </p>

                      <p>
                        I’m driven by a mission to build tech with purpose—systems that not only work but create measurable impact. Let’s connect if you’re building at the edge of autonomy, intelligence, and human need.
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-xl font-semibold text-cyan-400 mb-3">Core Capabilities:</h3>
                      
                      <ul className="grid grid-cols-2 gap-2">
                        {["Neural Systems Design", "Robotics Integration", "Computer Vision", "Reinforcement Learning", "Edge AI Deployment", "Embedded Programming", "Intelligent Robotics Systems", "Hardware-Software Integration", "Full-Stack Development", "Technical Leadership, Mentoring & Hackathon Innovation"].map((item, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-center text-gray-300"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + (index * 0.1) }}
                          >
                            <span className="mr-2 text-xs text-cyan-500">&gt;</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                  
                  {/* Decorative visualization */}
                  <motion.div
                    className="relative w-full max-w-md aspect-square"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="w-full h-full rounded-xl border border-cyan-500/30 backdrop-blur-sm bg-black/30 overflow-hidden p-4 relative">
                      {/* Placeholder for a 3D model or visualization */}
                      <div className="absolute inset-0 flex items-center justify-center text-cyan-500/50">
                        <div className="text-center">
                          <div className="text-8xl mb-4 opacity-30">🤖</div>
                          <div className="text-xs text-cyan-400/70">NEURAL ARCHITECTURE VISUALIZATION</div>
                        </div>
                      </div>
                      
                      {/* HUD corners */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>
                    </div>
                  </motion.div>
                </div>
              </motion.section>
            )}

            {section === 'projects' && (
              <motion.section 
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="py-12 px-4"
              >
                <motion.h2 
                  className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  PROJECT DATABASE
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border border-cyan-500/30 h-full group hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300">
                        <CardContent className="p-6 relative h-full">
                          {/* Top corner decoration */}
                          <div className="absolute top-0 right-0 w-12 h-12">
                            <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-cyan-500/50"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 bg-cyan-500"></div>
                          </div>
                          
                          {/* Project icon */}
                          <div className="mb-4 text-cyan-400">
                            {project.icon}
                          </div>
                          
                          {/* Project title */}
                          <h3 className="text-xl font-bold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors">
                            {project.title}
                          </h3>
                          
                          {/* Project description */}
                          <p className="text-gray-400 text-sm mb-4">
                            {project.description}
                          </p>
                          
                          {/* Project tags */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {project.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex} 
                                className="text-xs py-1 px-2 rounded-sm bg-cyan-900/30 text-cyan-300 border border-cyan-500/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Bottom scan line effect */}
                          <motion.div
                            className="absolute bottom-0 left-0 h-0.5 bg-cyan-500/50"
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {section === 'skills' && (
              <motion.section 
                key="skills"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="py-12 px-4"
              >
                <motion.h2 
                  className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  TECHNICAL CAPABILITIES
                </motion.h2>
                
                <motion.p 
                  className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Core technologies and frameworks I use to build advanced AI and robotic systems.
                </motion.p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  <TechSkillCard icon={<Cpu size={24} />} name="TensorFlow" level={95} color="cyan" />
                  <TechSkillCard icon={<Cpu size={24} />} name="PyTorch" level={90} color="purple" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Python" level={98} color="blue" />
                  <TechSkillCard icon={<Server size={24} />} name="ROS2" level={85} color="cyan" />
                  <TechSkillCard icon={<Zap size={24} />} name="Embedded C++" level={92} color="red" />
                  <TechSkillCard icon={<Database size={24} />} name="Computer Vision" level={88} color="green" />
                  <TechSkillCard icon={<Server size={24} />} name="ESP32/Arduino" level={94} color="cyan" />
                  <TechSkillCard icon={<Code size={24} />} name="Raspberry Pi" level={96} color="red" />
                  <TechSkillCard icon={<Database size={24} />} name="OpenCV" level={89} color="blue" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Machine Learning" level={97} color="blue" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Embedded AI" level={95} color="cyan" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Deep Learning" level={96} color="purple" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Sensor Fusion" level={90} color="green" />
                  <TechSkillCard icon={<Cpu size={24} />} name="SLAM IoT Device Architecture & Sensor Integration" level={89} color="red" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Edge Computing & Real-Time Data Monitoring" level={91} color="blue" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Wireless Protocols" level={88} color="cyan" />
                  <TechSkillCard icon={<Cpu size={24} />} name="API Integration" level={92} color="purple" />
                  <TechSkillCard icon={<Cpu size={24} />} name="Authentication & Realtime Data Visualization" level={90} color="blue" />
                  <TechSkillCard icon={<Server size={24} />} name="Backend: Node.js, Express.js" level={94} color="cyan" />
                  <TechSkillCard icon={<Server size={24} />} name="Git & GitHub" level={95} color="green" />
                  <TechSkillCard icon={<Database size={24} />} name="Firebase" level={93} color="red" />
                  <TechSkillCard icon={<Database size={24} />} name="Technical Mentorship & Team Collaboration" level={97} color="cyan" />
                  <TechSkillCard icon={<Database size={24} />} name="Rapid Prototyping & Iterative Design" level={92} color="blue" />
                  <TechSkillCard icon={<Database size={24} />} name="Hackathon Strategy & Innovation" level={96} color="purple" />
                  <TechSkillCard icon={<Database size={24} />} name="Technical Documentation" level={98} color="cyan" />
                  
                  </div> 

            
                  {/* close grid container */}
            
                  {/* close skills section */}
                  </motion.section>
                  )} 




{section === 'contact' && (
  <motion.section 
    key="contact" 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    transition={{ duration: 0.5 }} 
    className="py-12 px-4"
  >
    <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text">
      Contact Me
    </h2>

    {/* Added text from Home Menu */}
    <motion.p 
      className="text-center text-gray-300 max-w-2xl mx-auto mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      🚀 Building something bold? Crafting battlefield bots, medtech wearables, or real-time AI systems? 
      I love trading notes with fellow builders—send me what you’re making. 
      Let’s collaborate on tech that doesn’t just work—it matters.
    </motion.p>

    {/* Contact Form */}
    <form 
      className="max-w-xl mx-auto space-y-6 text-black" 
      action="https://formspree.io/f/xjkwdrby" 
      method="POST"
    >
      <input type="text" name="name" placeholder="Name" required className="w-full px-4 py-2 rounded bg-gray-100" />
      <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-2 rounded bg-gray-100" />
      <input type="text" name="subject" placeholder="Subject" className="w-full px-4 py-2 rounded bg-gray-100" />
      <textarea name="message" rows="5" placeholder="Your message" required className="w-full px-4 py-2 rounded bg-gray-100"></textarea>
      <button 
        type="submit" 
        className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
      >
        Send Message
      </button>
    </form>

    {/* Contact Links */}
    <motion.div 
      className="mt-8 text-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <h3 className="text-lg font-semibold text-cyan-400">Connect with me:</h3>
      <div className="flex justify-center gap-4">
        <a href="https://www.linkedin.com/in/raj-krish-3a7a3b285/" target="_blank" className="text-cyan-400 hover:underline">LinkedIn</a>
        <a href="https://github.com/rajkrish0608" target="_blank" className="text-cyan-400 hover:underline">GitHub</a>
        <a href="https://yourwebsite.com" target="_blank" className="text-cyan-400 hover:underline">Website</a>
        <a href="mailto:rajkrish060804@gmail.com" className="text-cyan-400 hover:underline">Email</a>
      </div>
    </motion.div>
  </motion.section>
)}

{section === 'awards' && (
  <motion.section 
    key="awards" 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    transition={{ duration: 0.5 }} 
    className="py-12 px-4"
  >
    <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text">
      Awards & Achievements
    </h2>

    {/* Awards Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      
      <Card className="bg-black/40 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
        <CardContent>
          <h3 className="text-lg font-bold text-cyan-300 mb-3">Pradyog Student Chapter</h3>
          <p className="text-gray-300">
            Founded a student-led initiative, mentoring "200+ students" in IoT, Robotics, and AI/ML through hands-on sessions and tech challenges.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
        <CardContent>
          <h3 className="text-lg font-bold text-purple-300 mb-3">Acehack 4.0 & HackUEM</h3>
          <p className="text-gray-300">
            Organized large-scale hackathons ("1000+ participants, 100+ sponsors") to cultivate innovation on campus.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border border-yellow-500/30 rounded-lg p-6 backdrop-blur-sm">
        <CardContent>
          <h3 className="text-lg font-bold text-yellow-300 mb-3">Hackathon Highlights</h3>
          <ul className="text-gray-300 space-y-2">
            <li>🥇 Harvard Business School Hackathon</li>
            <li>🥇 IIIT Delhi Esya-23</li>
            <li>🥈 Microsoft × Stanford Hackathon</li>
            <li>🥉 SKIT Startup Expo</li>
          </ul>
        </CardContent>
      </Card>

      {/* Research Paper Card */}
      <Card className="bg-black/40 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
        <CardContent>
          <h3 className="text-lg font-bold text-blue-300 mb-3">📘 Research Paper</h3>
          <p className="text-gray-300">
            Published a paper on "Real-Time Gas Detection System using AI-enhanced Sensors" in the International Journal of Emerging Tech Research.
          </p>
        </CardContent>
      </Card>

    </div>
  </motion.section>
)}
          
                  {/* <-- close conditional rendering */}

                  </AnimatePresence>
                  {/* close AnimatePresence */}

                  </div> 
                  {/* close max-w-7xl container */}

                  </main> 
                  {/* close main */}

                  </div>            
                   );
                 }

