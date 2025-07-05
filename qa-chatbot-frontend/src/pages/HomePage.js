import React, { useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import DotGrid from '../components/Chat/DotGrid';

export default function HomePage() {
    const token = localStorage.getItem('token');
    useEffect(() => {
        // Set viewport height for mobile compatibility (same as chat page)
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        return () => window.removeEventListener('resize', setViewportHeight);
    }, []);

    return (
        <main
            style={{ minHeight: 'calc(var(--vh) * 100)' }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col items-center"
        >
            <header className="w-full flex justify-center items-center p-4 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex-shrink-0 relative z-30 h-16">
                {/* Logo
                <div className="flex items-center gap-4 bg-white bg-opacity-90 border border-white border-opacity-20 rounded-xl p-2 shadow-lg">
                    <img src="ai.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                    <a
                        href="/"
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <h1 className="text-xl font-bold text-gray-900">TestMate AI</h1>
                    </a>
                </div> */}
                {/* Logo */}
                <div className="flex flex-col items-center mt-8 mb-8">
                    <img src="testmate-ai.png" alt="Logo" className="w-30 h-8 rounded-lg object-cover" />
                </div>
            </header>

            {/* Intro Section */}
            <section className="text-center py-12 px-4 max-w-4xl">
                <div className="bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl p-8 mb-1">
                    <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        Welcome to TestMate AI
                    </h1>
                    <p className="text-lg mb-6 text-gray-700">
                        Your smart AI companion for test automation, BDD, TDD, and quality assurance workflows.
                    </p>
                    <a
                        href="/chat"
                        className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Start Chatting
                    </a>
                    {/* {token ? (
                        <a
                            href="/chat"
                            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Start Chatting
                        </a>
                    ) : (
                        <div className="space-x-4">
                            <a
                                href="/login"
                                className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Login
                            </a>
                            <a
                                href="/register"
                                className="inline-block bg-white text-indigo-600 border-2 border-indigo-500 px-6 py-3 rounded-lg text-base font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Sign Up
                            </a>
                        </div>
                    )} */}
                </div>
            </section>

            {/* 3D Spline Model with DotGrid Background */}
            <section className="w-full max-w-6xl aspect-[16/9] px-4 mb-12 flex-1 flex items-center">
                <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white border-opacity-20 bg-gradient-to-br from-gray-900 to-black relative">
                    {/* DotGrid Background - only in this container */}
                    <div className="absolute inset-0 w-full h-full">
                        <DotGrid
                            dotSize={4}
                            gap={15}
                            baseColor="#ffffff20"
                            activeColor="#8b5cf6"
                            proximity={80}
                            shockRadius={150}
                            shockStrength={2}
                            resistance={500}
                            returnDuration={1.0}
                            className="w-full h-full"
                        />
                    </div>
                    {/* 3D Spline Model on top */}
                    <div className="relative z-10 w-full h-full">
                        <Spline scene="https://prod.spline.design/RDwCN0TjO1KiZfUu/scene.splinecode" />

                        {/* Overlay to cover "Built with Spline" watermark */}
                        <div className="absolute bottom-7 right-4 z-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm bg-opacity-90">
                            Powered by TestMate AI
                        </div>
                    </div>
                </div>
            </section>

            {/* Optional: Features Section */}
            <section className="w-full max-w-6xl px-4 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Test Automation</h3>
                        <p className="text-gray-600 text-sm">
                            Generate comprehensive test scripts and automation frameworks with AI assistance.
                        </p>
                    </div>

                    <div className="bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">BDD & TDD</h3>
                        <p className="text-gray-600 text-sm">
                            Create behavior-driven and test-driven development workflows effortlessly.
                        </p>
                    </div>

                    <div className="bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Quality Assurance</h3>
                        <p className="text-gray-600 text-sm">
                            Enhance your QA processes with intelligent recommendations and best practices.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className=" rounded-xl p-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
                    <p className="mb-6 text-indigo-100">
                        Have questions about TestMate AI or want to collaborate? We'd love to hear from you!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="mailto:rsroopesh565@gmail.com"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
                        >
                            Email Us
                        </a>
                        <a
                            href="https://github.com/Roopesh519/testmate-ai/"
                            className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                        >
                            Github
                        </a>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="mt-8 text-center">
                    <h3 className="text-lg font-semibold text-white-800 mb-4">Built with Technologies</h3>
                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">React</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Node.js</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">AI/ML</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">MongoDB</span>
                    </div>
                </div>
            </section>
        </main>
    );
}