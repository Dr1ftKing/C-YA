import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function HeroSection() {
    return (
        <section className="bg-white py-20 px-8">
             <div className="max-w-6xl mx-auto">
                <div className="bg-lavender-mist rounded-xl p-8 max-w-md">
                <h1 className="text-5xl font-bold mb-4 text-soft-periwinkle">About C-YA</h1>
                    <p className="text-black ">C-ya is a hangout coordination app intended to help ease the burden of planning group hangouts.
                        The platform has users create events, propose multiple date/time options 
                        and allow participants to vote on their availability, making group scheduling effortless.</p>
                </div>
            </div>
        </section>
    );
}

function ProblemSection() {
    return (
        <section className="bg-white py-20 px-8">
            <div className="max-w-6xl mx-auto flex justify-end">
                <div className="bg-lavender-mist rounded-xl p-8 max-w-md">
                    <h2 className="text-3xl text-slate-blue font-bold mb-2">The Problem</h2>
                    <p className="w-90  ">
                        Coordinating hangouts with busy friends means endless back and forth
                        messages trying to find a time that works for everyone.
                    </p>
                </div>
            </div>
        </section>
    );
}

function TechStackSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl text-black font-bold mb-6 text-center">Built With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-periwinkle rounded-xl shadow">
            <p className="font-semibold text-white">React</p>
          </div>
          <div className="p-4 bg-periwinkle rounded-xl shadow">
            <p className="font-semibold text-white">Express.js</p>
          </div>
          <div className="p-4 bg-periwinkle rounded-xl shadow">
            <p className="font-semibold text-white">PostgreSQL</p>
          </div>
          <div className="p-4 bg-periwinkle rounded-xl shadow">
            <p className="font-semibold text-white">Railway</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeveloperSection() {
  return (
    <section className="py-8 px-4 bg-lavender-mist">
      <div className="max-w-4xl mx-auto text-center">
        <img 
          src="/Juan-Headshot.jpg" 
          alt="Juan Lopez"
          className="w-40 h-40 rounded-full object-cover mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold mb-6">About the Developer</h2>
        <p className="text-gray-700 text-lg mb-6">
          I'm Juan, a software engineer with experience at AWS and a passion for building tools that solve real problems. 
          C-ya started as a personal frustration coordinating group hangouts shouldn't require a dozen text threads. 
          I built this full-stack application using React, Express.js, and PostgreSQL to make planning easier. 
          Recent graduate of the University of Massachusetts Lowell with a B.S. in Information Technology, 
          while also serving in the Army National Guard.
        
        </p>
        <div className="space-x-4">
          <a 
            href="https://github.com/Dr1ftKing/C-YA" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
          >
            View on GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/juan-lopz/" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function HeroImage() {
  return (
    <section className="bg-white px-8">
        <div className="max-w-6xl mx-auto flex justify-center">
        <img 
            src="/dap-up.png" 
            alt="C-ya application interface showing availability calendar"
            className="max-w-3xl rounded-lg"
            />
        </div>
    </section>
  );
}


function About() {


    return (
        <>
            <HeroSection />
            <ProblemSection />
            <HeroImage />
            <DeveloperSection />
            <TechStackSection />
            
            {/*Footer*/}
            <section className="bg-white py-12 px-4 text-center">
                <h2 className="text-3xl font-bold mb-4"> Ready to try it?</h2>
                <Link
                  to="/signup"
                  className="inline-block px-8 py-3 bg-white text-slate-blue rounded-xl font-semibold hover:bg-gray-100"
                >
                    Get started
                </Link>
            </section>
        </>
    );
}

export default About;