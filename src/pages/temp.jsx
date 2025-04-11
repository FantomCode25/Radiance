import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";

const VideoChat = () => {
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          Video Session ({role === "user" ? "Patient" : "Therapist"})
        </h1>
        
        <p className="mb-4 text-gray-600">
          Status: {connectionStatus}
        </p>
        
        <div className="text-sm text-gray-500 mb-4">
          ICE Candidates: Sent {iceCandidatesSent}, Received {iceCandidatesReceived}
        </div>
        
        {/* Video chat UI */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Local video */}
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-semibold mb-2">You</h2>
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Remote video */}
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-semibold mb-2">
              {role === "user" ? "Therapist" : "Patient"}
            </h2>
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {connectionStatus !== "Connected" && connectionStatus !== "Connection: connected" && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-opacity-50 bg-black">
                  Waiting for connection...
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-6 flex justify-center gap-4">
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-full"
            onClick={() => window.history.back()}
          >
            End Call
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-full"
            onClick={restartIce}
          >
            Restart Connection
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-full">
            Mute
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-full">
            Disable Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;