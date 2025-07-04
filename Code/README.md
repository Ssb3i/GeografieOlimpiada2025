# 🌍 Earthquake Preparedness Game

An interactive educational game that teaches essential earthquake safety through hands-on activities covering preparation, response, and recovery phases.

![Game Preview](https://img.shields.io/badge/Status-Ready%20to%20Play-green)
![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Overview

The Earthquake Preparedness Game is an interactive educational tool designed to teach users life-saving earthquake safety skills through three comprehensive phases:

- **🏠 Before**: Emergency kit building, furniture securing, escape planning, and emergency contacts
- **⚡ During**: Drop, Cover, Hold On scenarios with real-time decision making
- **🏥 After**: Safety assessment, injury care, communication, and damage documentation

### 🎮 Game Features

- **Interactive Learning**: Drag-and-drop activities, clickable scenarios, and real-time feedback
- **Scenario-Based Training**: Practice earthquake responses in different environments
- **Progress Tracking**: Score system with achievement levels and completion tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation, screen reader support, and high contrast compatibility
- **Educational Content**: Evidence-based safety information from emergency management experts

## 🚀 Quick Start

### Option 1: Direct Play (Recommended)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/earthquake-preparedness-game.git
   cd earthquake-preparedness-game
   ```

2. Open `src/index.html` in your web browser

### Option 2: Development Server
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Option 3: Python Server
```bash
npm run serve
```

## 🎪 How to Play

### 📋 Before Phase
1. **Build Emergency Kit**: Drag essential items into your emergency kit
2. **Secure Furniture**: Click on furniture items to secure them
3. **Plan Escape Routes**: Draw evacuation routes and set meeting points
4. **Emergency Contacts**: Set up your emergency communication plan

### ⚡ During Phase
1. **Choose Scenario**: Select from indoor, outdoor, or vehicle scenarios
2. **React Quickly**: Make split-second decisions during earthquake simulation
3. **Learn from Feedback**: Understand why certain actions are safer
4. **Practice Multiple Scenarios**: Master different earthquake situations

### 🏥 After Phase
1. **Safety Assessment**: Check for hazards in your environment
2. **Injury Care**: Practice first aid scenarios
3. **Emergency Communication**: Contact services and family
4. **Document Damage**: Learn proper damage reporting procedures

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid/Flexbox, Custom Properties, BEM methodology
- **Audio**: Web Audio API for sound effects and feedback
- **Storage**: localStorage for progress persistence
- **Build**: Live Server for development

## 📁 Project Structure

```
earthquake-preparedness-game/
├── src/
│   ├── index.html              # Main game interface
│   ├── css/
│   │   └── styles.css          # Complete styling system
│   └── js/
│       ├── game.js             # Main game controller
│       ├── scenes/
│       │   ├── before.js       # Preparation activities
│       │   ├── during.js       # Response scenarios
│       │   └── after.js        # Recovery tasks
│       └── utils/
│           └── helpers.js      # Game utilities & classes
├── assets/
│   └── audio/
│       └── sounds.js           # Audio system
├── package.json                # Project configuration
├── tasks.md                    # Development task list
├── copilot-instructions.md     # Development guidelines
└── README.md                   # This file
```

## 🎨 Game Mechanics

### Scoring System
- **Emergency Kit**: 15 points per essential item
- **Furniture Securing**: 10 points per item
- **Escape Planning**: 5-10 points per route/meeting point
- **Emergency Contacts**: 20 points for complete setup
- **Earthquake Response**: 50-80 points based on speed and accuracy
- **Safety Assessment**: 5-20 points per hazard identified
- **Recovery Tasks**: 10-40 points based on completeness

### Progression System
- **Novice**: 0-59 points
- **Beginner**: 60-119 points
- **Intermediate**: 120-179 points
- **Advanced**: 180-239 points
- **Expert**: 240+ points

## 🧪 Educational Standards

This game aligns with:
- FEMA earthquake preparedness guidelines
- American Red Cross emergency preparedness standards
- CDC disaster preparedness recommendations
- International Association of Emergency Managers best practices

## 🔧 Development

### Setup Development Environment
```bash
git clone https://github.com/your-username/earthquake-preparedness-game.git
cd earthquake-preparedness-game
npm install
```

### Available Scripts
- `npm start` - Start development server
- `npm run dev` - Start with file watching
- `npm run serve` - Python HTTP server alternative
- `npm run build` - Prepare for production
- `npm run validate` - Validate code quality

### Code Style Guidelines
- Use semantic HTML5 elements
- Follow BEM methodology for CSS classes
- ES6+ JavaScript with clear documentation
- Mobile-first responsive design
- Accessibility best practices

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly content
- Alternative text for visual elements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Tasks
Check [tasks.md](tasks.md) for current development priorities and completed features.

### Reporting Issues
Please report bugs and feature requests through our [Issue Tracker](https://github.com/your-username/earthquake-preparedness-game/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Emergency Management Experts** for safety content validation
- **Educational Technology Research** for learning methodology
- **Accessibility Guidelines** from W3C and Section 508
- **Open Source Community** for tools and inspiration

## 📞 Emergency Resources

**Remember: This game is educational. In a real emergency:**
- **Emergency Services**: 911 (US) or your local emergency number
- **FEMA**: [ready.gov](https://ready.gov)
- **American Red Cross**: [redcross.org](https://redcross.org)
- **Local Emergency Management**: Contact your local emergency management office

---

**🎯 Start playing today and become earthquake prepared!**