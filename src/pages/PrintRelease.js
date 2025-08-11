import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { usePrintJob } from '../context/PrintJobContext';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  FaQrcode, 
  FaKey, 
  FaPrint, 
  FaUser, 
  FaClock, 
  FaCheck,
  FaTimes,
  FaServer,
  FaShieldAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { useParams, useLocation } from 'react-router-dom';
import { api } from '../api/client';

const ReleaseContainer = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  p {
    color: #7f8c8d;
    font-size: 16px;
  }
`;

const PrinterInterface = styled.div`
  background: #2c3e50;
  border-radius: 20px;
  padding: 40px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #2ecc71, #f39c12, #e74c3c);
  }
`;

const PrinterHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  .printer-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .printer-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    opacity: 0.8;
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2ecc71;
      animation: pulse 2s infinite;
    }
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const AuthSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AuthMethod = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.2);
  }
  
  .auth-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #3498db;
  }
  
  .auth-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .auth-description {
    font-size: 14px;
    opacity: 0.8;
    line-height: 1.4;
  }
`;

const PinInput = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
  
  input {
    width: 60px;
    height: 60px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      background: rgba(52, 152, 219, 0.2);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const QRCodeDisplay = styled.div`
  text-align: center;
  margin: 20px 0;
  
  .qr-code {
    background: white;
    padding: 20px;
    border-radius: 12px;
    display: inline-block;
    margin-bottom: 16px;
  }
  
  .qr-instructions {
    font-size: 14px;
    opacity: 0.8;
    line-height: 1.4;
  }
`;

const JobsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin-top: 30px;
`;

const JobsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .jobs-title {
    font-size: 18px;
    font-weight: 600;
  }
  
  .jobs-count {
    background: rgba(52, 152, 219, 0.3);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const JobItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .job-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .job-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(52, 152, 219, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3498db;
    }
    
    .job-details {
      .job-name {
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .job-meta {
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }
  
  .job-actions {
    display: flex;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
    
    &:disabled {
      background: rgba(52, 152, 219, 0.5);
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const UserInfo = styled.div`
  background: rgba(46, 204, 113, 0.2);
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  
  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #2ecc71;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
  }
  
  .user-details {
    .user-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .user-role {
      font-size: 14px;
      opacity: 0.8;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  opacity: 0.7;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .empty-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .empty-description {
    font-size: 14px;
  }
`;

const PrintRelease = () => {
  const { currentUser, loginWithPin } = useAuth();
  const { printJobs, releasePrintJob, printers } = usePrintJob();
  const params = useParams();
  const location = useLocation();
  const [authMethod, setAuthMethod] = useState(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinInputs, setPinInputs] = useState([null, null, null, null]);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [linkTargetJobId, setLinkTargetJobId] = useState(null);

  useEffect(() => {
    // Validate link against backend (works cross-device)
    (async () => {
      const jobId = params.jobId;
      const search = new URLSearchParams(location.search);
      const token = search.get('token');
      if (!jobId || !token) return;
      try {
        const { data } = await api.get(`/api/jobs/${jobId}`, { params: { token } });
        if (data?.job?.status === 'pending') {
          setLinkTargetJobId(jobId);
        }
      } catch (e) {
        // invalid token or not found – keep default flow
      }
    })();
  }, [params.jobId, location.search]);

  const userJobs = authenticatedUser 
    ? printJobs.filter(job => job.userId === authenticatedUser.id && job.status === 'pending')
    : [];

  const jobsToShow = linkTargetJobId
    ? userJobs.filter(j => j.id === linkTargetJobId)
    : userJobs;

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    if (value && index < 3) {
      pinInputs[index + 1]?.focus();
    }
  };

  const handlePinSubmit = async () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) {
      toast.error('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithPin(pinString);
      setAuthenticatedUser(result.user);
      toast.success(`Welcome, ${result.user.name}!`);
      setPin(['', '', '', '']);
    } catch (error) {
      toast.error('Invalid PIN');
      setPin(['', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseJob = async (jobId) => {
    if (!selectedPrinter) {
      toast.error('Please select a printer first');
      return;
    }

    setLoading(true);
    try {
      const token = new URLSearchParams(location.search).get('token');
      await releasePrintJob(jobId, selectedPrinter.id, authenticatedUser.id, token);
      toast.success('Print job released successfully!');
    } catch (error) {
      toast.error('Failed to release print job');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseAll = async () => {
    if (!selectedPrinter) {
      toast.error('Please select a printer first');
      return;
    }

    setLoading(true);
    try {
      const token = new URLSearchParams(location.search).get('token');
      for (const job of jobsToShow) {
        await releasePrintJob(job.id, selectedPrinter.id, authenticatedUser.id, token);
      }
      toast.success('All print jobs released successfully!');
    } catch (error) {
      toast.error('Failed to release some print jobs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <ReleaseContainer>
      <PageHeader>
        <h1>Secure Print Release</h1>
        <p>Authenticate and release your print jobs at any compatible printer</p>
      </PageHeader>

      <PrinterInterface>
        <PrinterHeader>
          <div className="printer-name">Main Office Printer</div>
          <div className="printer-status">
            <div className="status-dot"></div>
            <span>Online & Ready</span>
          </div>
        </PrinterHeader>

        {!authenticatedUser ? (
          <>
            <AuthSection>
              <AuthMethod 
                className={authMethod === 'pin' ? 'active' : ''}
                onClick={() => setAuthMethod('pin')}
              >
                <FaKey className="auth-icon" />
                <div className="auth-title">PIN Authentication</div>
                <div className="auth-description">
                  Enter your 4-digit PIN to access your print jobs
                </div>
              </AuthMethod>

              <AuthMethod 
                className={authMethod === 'qr' ? 'active' : ''}
                onClick={() => setAuthMethod('qr')}
              >
                <FaQrcode className="auth-icon" />
                <div className="auth-title">QR Code Scan</div>
                <div className="auth-description">
                  Scan QR code from mobile app for instant access
                </div>
              </AuthMethod>
            </AuthSection>

            {authMethod === 'pin' && (
              <div style={{ textAlign: 'center' }}>
                <PinInput>
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      ref={(el) => setPinInputs(prev => { prev[index] = el; return prev; })}
                      autoFocus={index === 0}
                      placeholder="•"
                    />
                  ))}
                </PinInput>
                <ActionButton 
                  className="primary" 
                  onClick={handlePinSubmit}
                  disabled={loading || pin.join('').length !== 4}
                >
                  {loading ? 'Authenticating...' : 'Authenticate'}
                </ActionButton>
              </div>
            )}

            {authMethod === 'qr' && (
              <QRCodeDisplay>
                <div className="qr-code">
                  <QRCodeCanvas 
                    value={JSON.stringify({
                      type: 'secure-print-release',
                      timestamp: Date.now(),
                      sessionId: Math.random().toString(36).substr(2, 9)
                    })} 
                    size={200} 
                  />
                </div>
                <div className="qr-instructions">
                  Open the Secure Print Link mobile app and scan this QR code to authenticate automatically.
                  <br />
                  <strong>Demo PIN:</strong> 1234 (Admin), 5678 (User 1), 9012 (User 2)
                </div>
              </QRCodeDisplay>
            )}
          </>
        ) : (
          <>
            <UserInfo>
              <div className="user-avatar">
                {getInitials(authenticatedUser.name)}
              </div>
              <div className="user-details">
                <div className="user-name">{authenticatedUser.name}</div>
                <div className="user-role">{authenticatedUser.role} • {authenticatedUser.department}</div>
              </div>
            </UserInfo>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Select Printer:
              </label>
              <select
                value={selectedPrinter?.id || ''}
                onChange={(e) => {
                  const printer = printers.find(p => p.id === parseInt(e.target.value));
                  setSelectedPrinter(printer);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="">Choose a printer...</option>
                {printers.filter(p => p.status === 'online').map(printer => (
                  <option key={printer.id} value={printer.id}>
                    {printer.name} - {printer.location}
                  </option>
                ))}
              </select>
            </div>

            <JobsSection>
              <JobsHeader>
                <div className="jobs-title">Your Print Jobs</div>
                <div className="jobs-count">{userJobs.length} pending</div>
              </JobsHeader>

              {userJobs.length > 0 ? (
                <>
                  <JobList>
                    {jobsToShow.map(job => (
                      <JobItem key={job.id}>
                        <div className="job-info">
                          <div className="job-icon">
                            <FaPrint />
                          </div>
                          <div className="job-details">
                            <div className="job-name">{job.documentName || 'Document'}</div>
                            <div className="job-meta">
                              {formatDate(job.submittedAt)} • {job.pages} pages • {job.copies} copies • ${job.cost}
                            </div>
                          </div>
                        </div>
                        <div className="job-actions">
                          <ActionButton 
                            className="primary"
                            onClick={() => handleReleaseJob(job.id)}
                            disabled={loading || !selectedPrinter}
                          >
                            Release
                          </ActionButton>
                        </div>
                      </JobItem>
                    ))}
                  </JobList>
                  
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <ActionButton 
                      className="primary"
                      onClick={handleReleaseAll}
                      disabled={loading || !selectedPrinter || userJobs.length === 0}
                    >
                      {loading ? 'Releasing...' : `Release All Jobs (${userJobs.length})`}
                    </ActionButton>
                  </div>
                </>
              ) : (
                <EmptyState>
                  <FaPrint className="empty-icon" />
                  <div className="empty-title">No pending print jobs</div>
                  <div className="empty-description">
                    All your print jobs have been released or completed
                  </div>
                </EmptyState>
              )}
            </JobsSection>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <ActionButton 
                className="secondary"
                onClick={() => {
                  setAuthenticatedUser(null);
                  setAuthMethod(null);
                  setSelectedPrinter(null);
                }}
              >
                Sign Out
              </ActionButton>
            </div>
          </>
        )}
      </PrinterInterface>
    </ReleaseContainer>
  );
};

export default PrintRelease;
