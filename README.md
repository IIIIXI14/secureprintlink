# Secure Print Link

A comprehensive secure printing solution that protects confidential documents through encryption, authentication, and hold-and-release printing technology.

## 🛡️ Overview

Secure Print Link addresses the critical security vulnerabilities in traditional printing environments by implementing a secure "hold-and-release" system. This prevents sensitive documents from being left unattended on printer output trays, ensuring confidential information remains protected.

## ✨ Key Features

### 🔐 Multi-Factor Authentication
- **Username/Password Login**: Traditional credential-based authentication
- **PIN Code Authentication**: Quick 4-digit PIN for printer release
- **QR Code Authentication**: Mobile app integration for seamless access
- **Role-based Access Control**: Admin and user permissions

### 📄 Secure Print Job Management
- **Document Upload**: Drag-and-drop file upload with support for PDF, DOC, DOCX, TXT, and images
- **Encryption**: End-to-end encryption for all documents
- **Secure Tokens**: Unique tokens generated for each print job
- **Job Queue Management**: Comprehensive job tracking and management

### 🖨️ Printer Integration
- **Printer Management**: Add, configure, and monitor network printers
- **Status Monitoring**: Real-time printer status and health monitoring
- **Capability Detection**: Automatic detection of printer features (color, duplex, stapling)
- **Location-based Printing**: Department-specific printer assignments

### 📊 Analytics & Reporting
- **Usage Statistics**: Detailed print job analytics
- **Cost Tracking**: Per-job and departmental cost analysis
- **Audit Trails**: Complete logging of all print activities
- **Performance Metrics**: Printer uptime and efficiency reports

### 🎨 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Navigation**: Clean, modern interface with easy-to-use controls
- **Real-time Updates**: Live status updates and notifications
- **Accessibility**: WCAG compliant design with keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secureprintlink
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Credentials

The application includes demo users for testing:

| Role | Username | Password | PIN |
|------|----------|----------|-----|
| Admin | admin | admin123 | 1234 |
| User 1 | user1 | user123 | 5678 |
| User 2 | user2 | user123 | 9012 |

## 📱 Usage Guide

### For Users

1. **Login**: Use your credentials or PIN to access the system
2. **Submit Print Job**: 
   - Upload your document
   - Configure print settings (pages, copies, color, etc.)
   - Submit the job securely
3. **Release at Printer**:
   - Go to any compatible printer
   - Authenticate using PIN or QR code
   - Select and release your print jobs

### For Administrators

1. **User Management**: Add, edit, and manage user accounts
2. **Printer Management**: Configure and monitor network printers
3. **System Monitoring**: View analytics and system health
4. **Security Settings**: Configure authentication and security policies

## 🏗️ Architecture

### Frontend
- **React 19**: Modern React with hooks and functional components
- **Styled Components**: CSS-in-JS for maintainable styling
- **React Router**: Client-side routing
- **Context API**: State management for authentication and print jobs

### Security Features
- **CryptoJS**: Document encryption and secure token generation
- **QR Code Generation**: Secure authentication tokens
- **Session Management**: Secure user sessions with timeout
- **Input Validation**: Comprehensive form validation

### Data Management
- **Local Storage**: Persistent user sessions and job data
- **Mock Data**: Demo data for testing and demonstration
- **State Management**: Centralized state with React Context

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENCRYPTION_KEY=your-secret-key
REACT_APP_SESSION_TIMEOUT=30
```

### Customization
- **Branding**: Update colors and logos in the theme configuration
- **Printer Integration**: Configure printer-specific settings
- **Authentication**: Customize authentication methods and policies

## 📊 Features in Detail

### Secure Print Workflow

1. **Document Submission**
   - User uploads document through web interface
   - Document is encrypted and stored securely
   - Unique secure token is generated
   - QR code is created for printer authentication

2. **Authentication**
   - Multiple authentication methods supported
   - PIN-based authentication for quick access
   - QR code scanning for mobile integration
   - Role-based access control

3. **Print Release**
   - User authenticates at printer location
   - Secure token validation
   - Job selection and release
   - Audit trail logging

4. **Job Management**
   - Real-time job status tracking
   - Job cancellation and modification
   - Cost calculation and reporting
   - Historical job data

### Security Measures

- **Document Encryption**: All documents encrypted in transit and storage
- **Secure Tokens**: Cryptographically secure tokens for job release
- **Session Management**: Secure user sessions with automatic timeout
- **Audit Logging**: Complete audit trail of all activities
- **Access Control**: Role-based permissions and restrictions

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Application header
│   └── Sidebar.js      # Navigation sidebar
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── PrintJobContext.js # Print job management
├── pages/              # Application pages
│   ├── Authentication.js
│   ├── Dashboard.js
│   ├── PrintJobSubmission.js
│   ├── PrintJobQueue.js
│   ├── PrintRelease.js
│   ├── PrinterManagement.js
│   ├── UserManagement.js
│   ├── Reports.js
│   └── Settings.js
├── App.js              # Main application component
└── index.js            # Application entry point
```

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App

## 🔮 Future Enhancements

### Planned Features
- **Mobile App**: Native iOS and Android applications
- **Cloud Integration**: AWS/Azure cloud deployment
- **Advanced Analytics**: Machine learning insights
- **API Integration**: RESTful API for third-party integration
- **Multi-language Support**: Internationalization
- **Advanced Security**: Biometric authentication

### Technical Improvements
- **Backend API**: Node.js/Express or Python/Django backend
- **Database**: PostgreSQL or MongoDB for data persistence
- **Real-time Updates**: WebSocket integration
- **Microservices**: Scalable microservices architecture
- **Containerization**: Docker deployment
- **CI/CD**: Automated testing and deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- React team for the amazing framework
- Styled Components for CSS-in-JS solution
- React Icons for the icon library
- All contributors and testers

---

**Secure Print Link** - Protecting your documents, one print job at a time. 🛡️🖨️
