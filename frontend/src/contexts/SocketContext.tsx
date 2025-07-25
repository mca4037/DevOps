import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContextType } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (token && user) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: token,
        },
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        
        // Join user-specific room
        newSocket.emit('join', {
          userId: user.id,
          userType: user.role === 'vehicle_owner' ? 'driver' : user.role,
        });
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      // Listen for booking-related events
      newSocket.on('booking_request', (data) => {
        if (user.role === 'vehicle_owner') {
          toast(`New booking request nearby!`, {
            icon: '🚛',
            duration: 5000,
          });
        }
      });

      newSocket.on('booking_accepted', (data) => {
        if (user.role === 'farmer') {
          toast.success(`Your booking has been accepted!`);
        }
      });

      newSocket.on('booking_status_update', (data) => {
        const statusMessages: { [key: string]: string } = {
          en_route_pickup: 'Driver is on the way to pickup location',
          picked_up: 'Your produce has been picked up',
          en_route_delivery: 'Your produce is on the way to destination',
          delivered: 'Your produce has been delivered successfully!',
        };

        const message = statusMessages[data.status] || `Booking status updated: ${data.status}`;
        toast(message, {
          icon: data.status === 'delivered' ? '🎉' : '📦',
        });
      });

      newSocket.on('booking_cancelled', (data) => {
        toast.error(`Booking has been cancelled: ${data.reason}`);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  }, [token, user]);

  const joinRoom = (userId: string, userType: string) => {
    if (socket && isConnected) {
      socket.emit('join', { userId, userType });
    }
  };

  const leaveRoom = () => {
    if (socket && isConnected) {
      socket.emit('leave');
    }
  };

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};