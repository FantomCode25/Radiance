import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, User, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";

/**
 * @typedef {Object} VideoChatProps
 * @property {string} therapistName
 * @property {string} therapistImage
 * @property {number} sessionDuration - in minutes
 * @property {Function} onEndCall
 */

const VideoChat = ({ therapistName, therapistImage, sessionDuration, onEndCall }) => {
  const { id } = useParams();
  const location = useLocation();
  
  // Determine role based on URL path
  const role = location.pathname.includes("/therapists/") ? "therapist" : "user";
  
  // WebRTC refs and state
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  
  // UI state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(sessionDuration * 60); // Convert to seconds
  const { toast } = useToast();
  
  // Room ID for signaling
  const roomId = `therapy-session-${id}`;

  console.log(`Current role: ${role}, Room ID: ${roomId}`);

  // Initialize WebRTC and media
  useEffect(() => {
    // Initialize socket connection with explicit URL
    const SOCKET_SERVER_URL = "http://localhost:5001";
    console.log(`Connecting to socket server at: ${SOCKET_SERVER_URL}`);
    
    socketRef.current = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'] // Try websocket first, fallback to polling
    });
    
    // Socket connection events
    socketRef.current.on('connect', () => {
      console.log('Socket connected with ID:', socketRef.current.id);
      toast({
        title: "Connecting to session",
        description: "Please wait while we connect you",
      });
    });
    
    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus(`Connection error: ${error.message}`);
      toast({
        title: "Connection error",
        description: error.message,
        variant: "destructive",
      });
    });
    
    // Set up media and WebRTC
    const setupMedia = async () => {
      try {
        console.log('Requesting user media...');
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        console.log('User media acquired successfully');
        localStreamRef.current = stream;
        
        // Attach local stream to video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log('Local video stream attached to video element');
        }
        
        // Initialize WebRTC after media is ready
        setupWebRTC();
        
        // Join the room after everything is set up
        console.log(`Joining room ${roomId} as ${role}`);
        socketRef.current.emit("join-room", { roomId, role });
        
        setConnectionStatus("Waiting for peer...");
        
        // Add welcome message if role is user
        if (role === "user") {
          setTimeout(() => {
            setMessages([
              {
                sender: therapistName,
                text: `Hello! I'm ${therapistName}. How are you feeling today?`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }, 2000);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setConnectionStatus(`Failed to access camera/microphone: ${err.message}`);
        toast({
          title: "Camera access denied",
          description: "Please enable camera access to join the session",
          variant: "destructive",
        });
      }
    };
    
    setupMedia();
    
    // Cleanup on component unmount
    return () => {
      console.log('Cleaning up resources...');
      // Close media streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped track: ${track.kind}`);
        });
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        console.log('Peer connection closed');
      }
      
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [roomId, role, therapistName, toast]);

  const setupWebRTC = () => {
    console.log('Setting up WebRTC connection...');
    
    // Create RTCPeerConnection with multiple STUN servers for better NAT traversal
    const configuration = {
      iceServers: [
        // Keep existing STUN
        { urls: "stun:stun.l.google.com:19302" },
        
        // Add this FREE TURN server (temporary for testing)
        {
          urls: "turn:global.turn.twilio.com:3478?transport=udp",
          username: "test",
          credential: "test123"
        },
        {
          urls: "turn:global.turn.twilio.com:3478?transport=tcp", 
          username: "test",
          credential: "test123"
        }
      ],
      iceTransportPolicy: "all" // Keep this
    };
    
    peerConnectionRef.current = new RTCPeerConnection(configuration);
    console.log('RTCPeerConnection created');

    // Add local tracks to the peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`);
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });
    }

    // Handle incoming remote tracks
    peerConnectionRef.current.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);
      if (remoteVideoRef.current && event.streams && event.streams[0]) {
        console.log('Setting remote stream to video element');
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnectionStatus("Connected");
        toast({
          title: role === "user" ? "Therapist connected" : "Client connected",
          description: role === "user" ? `${therapistName} has joined the session` : "Your client has joined the session",
        });
      } else {
        console.warn('Could not attach remote stream to video element');
      }
    };

    // Log signaling state changes
    peerConnectionRef.current.onsignalingstatechange = () => {
      console.log('Signaling state changed:', peerConnectionRef.current.signalingState);
    };
    
    // Log connection state changes
    peerConnectionRef.current.onconnectionstatechange = () => {
      console.log('Connection state changed:', peerConnectionRef.current.connectionState);
      setConnectionStatus(`Connection: ${peerConnectionRef.current.connectionState}`);
      
      if (peerConnectionRef.current.connectionState === 'connected') {
        console.log('WebRTC connection established successfully!');
      }
    };

    // Handle ICE connection state changes
    peerConnectionRef.current.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', peerConnectionRef.current.iceConnectionState);
      
      if (peerConnectionRef.current.iceConnectionState === "disconnected" ||
          peerConnectionRef.current.iceConnectionState === "failed") {
        setConnectionStatus("Connection lost. Trying to reconnect...");
        restartIce();
      }
    };

    // Handle ICE gathering state changes
    peerConnectionRef.current.onicegatheringstatechange = () => {
      console.log('ICE Gathering State:', peerConnectionRef.current.iceGatheringState);
    };

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate generated:', event.candidate.candidate.substr(0, 50) + '...');
        socketRef.current.emit("ice-candidate", { 
          room: roomId, 
          candidate: event.candidate 
        });
      } else {
        console.log('All ICE candidates gathered');
      }
    };

    // Socket event handlers
    socketRef.current.on("user-joined", async (userId) => {
      console.log("Peer joined:", userId);
      setConnectionStatus("Peer joined. Establishing connection...");
      
      // Initiating side creates and sends the offer
      if (role === "user") {
        try {
          console.log('Creating offer as user...');
          const offer = await peerConnectionRef.current.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          });
          
          console.log('Setting local description (offer)');
          await peerConnectionRef.current.setLocalDescription(offer);
          
          console.log('Sending offer to signaling server');
          socketRef.current.emit("offer", { room: roomId, offer });
        } catch (err) {
          console.error("Error creating offer:", err);
          setConnectionStatus(`Offer error: ${err.message}`);
        }
      }
    });

    // Handle incoming offer
    socketRef.current.on("offer", async (offer) => {
      if (role === "therapist") {
        try {
          console.log('Received offer as therapist');
          console.log('Setting remote description (offer)');
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
          
          console.log('Creating answer...');
          const answer = await peerConnectionRef.current.createAnswer();
          
          console.log('Setting local description (answer)');
          await peerConnectionRef.current.setLocalDescription(answer);
          
          console.log('Sending answer to signaling server');
          socketRef.current.emit("answer", { room: roomId, answer });
        } catch (err) {
          console.error("Error handling offer:", err);
          setConnectionStatus(`Answer error: ${err.message}`);
        }
      }
    });

    // Handle incoming answer
    socketRef.current.on("answer", async (answer) => {
      if (role === "user") {
        try {
          console.log('Received answer as user');
          console.log('Setting remote description (answer)');
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error("Error handling answer:", err);
          setConnectionStatus(`Remote description error: ${err.message}`);
        }
      }
    });

    // Handle ICE candidates from remote peer
    socketRef.current.on("ice-candidate", async (candidate) => {
      try {
        console.log('Received remote ICE candidate');
        
        if (peerConnectionRef.current.remoteDescription) {
          console.log('Adding ICE candidate to peer connection');
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          console.log('Received ICE candidate before remote description, postponing');
          // If you want to handle this case, you could store candidates and add them later
        }
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });
    
    // Set up channel for text messages
    const dataChannel = peerConnectionRef.current.createDataChannel("chat", {
      ordered: true
    });
    
    dataChannel.onopen = () => {
      console.log("Data channel opened");
    };
    
    dataChannel.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        setMessages(prev => [...prev, {
          sender: role === "user" ? therapistName : "Client",
          text: messageData.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (err) {
        console.error("Error parsing message data", err);
      }
    };
    
    peerConnectionRef.current.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = (e) => {
        try {
          const messageData = JSON.parse(e.data);
          setMessages(prev => [...prev, {
            sender: role === "user" ? therapistName : "Client",
            text: messageData.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        } catch (err) {
          console.error("Error parsing message data", err);
        }
      };
    };
  };

  // Restart ICE if connection is failing
  const restartIce = () => {
    if (peerConnectionRef.current) {
      console.log("Restarting ICE connection...");
      
      // Recreate the offer with ICE restart flag
      if (role === "user") {
        peerConnectionRef.current.createOffer({ iceRestart: true })
          .then(offer => {
            return peerConnectionRef.current.setLocalDescription(offer);
          })
          .then(() => {
            socketRef.current.emit("offer", { room: roomId, offer: peerConnectionRef.current.localDescription });
          })
          .catch(err => {
            console.error("Error restarting ICE:", err);
          });
      }
    }
  };
  
  // Session timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onEndCall();
      return;
    }
    
    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      
      // Show notifications at specific time marks
      if (timeLeft === 300) { // 5 minutes left
        toast({
          title: "5 minutes remaining",
          description: "Your session will end soon",
        });
      } else if (timeLeft === 60) { // 1 minute left
        toast({
          title: "1 minute remaining",
          description: "Your session is about to end",
        });
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [timeLeft, onEndCall, toast]);
  
  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      
      setIsMicOn(!isMicOn);
      
      toast({
        title: isMicOn ? "Microphone turned off" : "Microphone turned on",
        duration: 2000,
      });
    }
  };
  
  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      
      setIsVideoOn(!isVideoOn);
      
      toast({
        title: isVideoOn ? "Camera turned off" : "Camera turned on",
        duration: 2000,
      });
    }
  };
  
  const sendChatMessage = (text) => {
    if (peerConnectionRef.current && peerConnectionRef.current.dataChannel && peerConnectionRef.current.dataChannel.readyState === "open") {
      peerConnectionRef.current.dataChannel.send(JSON.stringify({ text }));
    } else {
      console.log("Data channel not ready, using mock messages");
      // If WebRTC data channel isn't ready, use mock messages
      setTimeout(() => {
        const responseMessages = [
          "I understand how you feel. Let's explore that further.",
          "Thank you for sharing that with me. How does that make you feel?",
          "That's an important insight. What do you think led to that?",
          "I appreciate your openness. Let's work through this together.",
          "It sounds like that's been challenging for you. How have you been coping?"
        ];
        
        const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
        
        const therapistMessage = {
          sender: therapistName,
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, therapistMessage]);
      }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Try to send via WebRTC data channel
    sendChatMessage(newMessage);
    
    setNewMessage('');
  };
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Video container */}
      <div className="flex-grow relative overflow-hidden bg-black">
        {/* Main video (therapist or remote) */}
        <div className="h-full w-full flex items-center justify-center">
          <div className="relative w-full h-full">
            {role === "user" ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                poster={therapistImage}
              />
            ) : (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {/* If no real video, show therapist image or placeholder */}
            {(connectionStatus !== "Connected" && role === "user") && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <User size={80} className="mx-auto mb-2 opacity-70" />
                  <h3 className="text-xl font-medium">{therapistName}</h3>
                  <p className="text-sm opacity-80">{connectionStatus}</p>
                </div>
              </div>
            )}
            
            {(connectionStatus !== "Connected" && role === "therapist") && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <User size={80} className="mx-auto mb-2 opacity-70" />
                  <h3 className="text-xl font-medium">Waiting for client</h3>
                  <p className="text-sm opacity-80">{connectionStatus}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* User/local video (small overlay) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 md:w-64 md:h-48 rounded-lg overflow-hidden border-2 border-white shadow-md">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isVideoOn ? '' : 'hidden'}`}
          />
          {!isVideoOn && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <User size={40} className="text-white opacity-70" />
            </div>
          )}
        </div>
        
        {/* Session info overlay */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full">
          <div className="flex items-center space-x-2">
            <span className="animate-pulse bg-red-600 h-2 w-2 rounded-full"></span>
            <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
      
      {/* Controls bar */}
      <div className="bg-white py-4 px-6 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleMic}
                  className={`rounded-full ${!isMicOn ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMicOn ? 'Turn off microphone' : 'Turn on microphone'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleVideo}
                  className={`rounded-full ${!isVideoOn ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVideoOn ? 'Turn off camera' : 'Turn on camera'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={`rounded-full ${isChatOpen ? 'bg-oasis-primary/10 text-oasis-primary border-oasis-primary/30' : ''}`}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isChatOpen ? 'Close chat' : 'Open chat'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full"
                  onClick={restartIce}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={onEndCall}
          className="rounded-full flex items-center"
        >
          <Phone className="h-5 w-5 mr-2 rotate-135" />
          End Call
        </Button>
      </div>
      
      {/* Chat sidebar */}
      {isChatOpen && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-lg z-10 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Chat with {role === "user" ? therapistName : "Client"}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsChatOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`max-w-[80%] ${message.sender === 'You' ? 'ml-auto' : 'mr-auto'}`}
              >
                <div className={`rounded-lg p-3 ${
                  message.sender === 'You' 
                    ? 'bg-oasis-primary text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.text}
                </div>
                <div className={`text-xs mt-1 text-gray-500 flex items-center ${
                  message.sender === 'You' ? 'justify-end' : 'justify-start'
                }`}>
                  {message.sender === 'You' ? message.time : `${message.sender} • ${message.time}`}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoChat;