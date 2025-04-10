# IoTify Education Platform

A comprehensive IoT education platform featuring real-time data visualization, device integration, and gamified learning experiences.

## Overview

IoTify is an interactive educational platform designed to teach IoT concepts through hands-on challenges and tasks. The system supports high-performance device communication with ESP32/NodeMCU devices at 2,000 requests per second, features real-time data visualization, and incorporates gamification elements to enhance the learning experience.

## Features

- **High-Performance API**: Handles 2,000 requests per second from ESP32/NodeMCU devices
- **Real-Time Visualization**: Live data streams and visual feedback for IoT device interactions
- **Gamification System**: Point-based scoring system with leaderboards
- **Auto-Scoring**: Automatic evaluation for 12+ different IoT tasks and challenges
- **User Management**: Registration, authentication, and qualification tracking
- **Quiz System**: Multiple-choice quizzes with automatic grading
- **Attendance Tracking**: Real-time attendance monitoring with SSE (Server-Sent Events)
- **Message Box**: Communication system between users and administrators
- **Weather Simulation**: Simulated weather data for IoT experiments
- **RGB LED Control**: Remote control of RGB LED devices for visual feedback

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email Service**: Mailgun
- **Real-Time Communication**: Server-Sent Events (SSE)
- **Frontend Templating**: EJS

## Components

### User Management

- User registration with unique IDs
- Qualification status tracking
- Score management for gamification

### Learning Activities

1. **Temperature Activity**: Submit temperature readings from IoT sensors
2. **Message Box Activity**: Send messages from connected devices
3. **Quiz System**: Multiple interactive quizzes covering IoT concepts
4. **Attendance System**: Check-in functionality with real-time updates

### Admin Controls

- User management dashboard
- Leaderboard display and control
- Score adjustment (increment/decrement)
- User qualification management
- RGB LED control interface
- Messaging system administration
- Bulk email capabilities

### API Endpoints

#### User Activities
- `/activity1/:uid` - Weather data simulation
- `/msgactivity/:uid` - Message submission endpoint
- `/tempactivity/:uid` - Temperature data submission
- `/quiz1` to `/quiz4` - Quiz submission endpoints
- `/attendance` - Attendance marking endpoint
- `/rgbactivity/` - RGB LED control data

#### Admin Controls
- `/gameplay` - Leaderboard management
- `/leaderboardShowcase` - Public leaderboard display
- `/register` - User registration interface
- `/userAction` - User management actions
- `/rgbcontrol` - RGB LED control interface
- `/msgbox` - Message box administration

## Security Features

- Admin authentication
- Secure cookie handling
- User activity validation
- Input sanitization

## Applications

This platform is ideal for:
- Educational institutions teaching IoT concepts
- Hackathons and IoT workshops
- Remote learning environments for embedded systems
- Technical training programs

