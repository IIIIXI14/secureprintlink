import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { usePrintJob } from '../context/PrintJobContext';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  FaUpload, 
  FaFileAlt, 
  FaPrint, 
  FaShieldAlt, 
  FaCog,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaQrcode
} from 'react-icons/fa';

const SubmissionContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
  
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

const SubmissionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  
  .step {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .step-number {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      background: ${props => props.active ? '#3498db' : '#ecf0f1'};
      color: ${props => props.active ? 'white' : '#7f8c8d'};
    }
    
    .step-text {
      font-weight: 500;
      color: ${props => props.active ? '#2c3e50' : '#7f8c8d'};
    }
    
    &:not(:last-child)::after {
      content: '';
      width: 40px;
      height: 2px;
      background: #ecf0f1;
      margin: 0 10px;
    }
  }
`;

const FileUploadSection = styled.div`
  text-align: center;
  padding: 40px;
  border: 2px dashed #e1e5e9;
  border-radius: 12px;
  margin-bottom: 30px;
  transition: border-color 0.3s ease;
  
  &.drag-active {
    border-color: #3498db;
    background: #f8f9fa;
  }
  
  .upload-icon {
    font-size: 48px;
    color: #3498db;
    margin-bottom: 16px;
  }
  
  .upload-text {
    font-size: 18px;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  .upload-hint {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .upload-button {
    background: #3498db;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background: #2980b9;
    }
  }
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .file-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #3498db20;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3498db;
  }
  
  .file-info {
    flex: 1;
    
    .file-name {
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 4px;
    }
    
    .file-size {
      font-size: 12px;
      color: #7f8c8d;
    }
  }
  
  .remove-file {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    
    &:hover {
      background: #f8d7da;
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 30px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }
  
  input, select {
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 10px;
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #3498db;
    }
    
    label {
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }
  }
`;

const SecuritySection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  
  .security-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    
    .security-icon {
      color: #27ae60;
      font-size: 18px;
    }
    
    .security-title {
      font-weight: 600;
      color: #2c3e50;
    }
  }
  
  .security-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    
    .feature {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #27ae60;
      
      .feature-icon {
        font-size: 12px;
      }
    }
  }
`;

const QRCodeSection = styled.div`
  text-align: center;
  padding: 20px;
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .qr-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
  
  .qr-code {
    margin: 0 auto;
    padding: 16px;
    background: white;
    border-radius: 8px;
    display: inline-block;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkBox = styled.div`
  background: #f8f9fa;
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #2980b9; }
`;

const PrintJobSubmission = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { submitPrintJob, loading } = usePrintJob();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastSubmittedJob, setLastSubmittedJob] = useState(null);
  const [jobData, setJobData] = useState({
    documentName: '',
    pages: 1,
    copies: 1,
    color: false,
    duplex: false,
    stapling: false,
    priority: 'normal',
    printerId: '',
    notes: ''
  });

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setJobData(prev => ({
        ...prev,
        documentName: file.name
      }));
      setCurrentStep(2);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif']
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to print');
      return;
    }

    try {
      const jobPayload = {
        ...jobData,
        userId: currentUser.id,
        userName: currentUser.name,
        file: selectedFile,
        fileSize: selectedFile.size,
        fileType: selectedFile.type
      };

      const result = await submitPrintJob(jobPayload);
      setLastSubmittedJob(result.job);
      toast.success('Print job submitted successfully!');
      setCurrentStep(3);
    } catch (error) {
      toast.error(error.message || 'Failed to submit print job');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setJobData(prev => ({ ...prev, documentName: '' }));
    setCurrentStep(1);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyLink = async () => {
    if (lastSubmittedJob?.releaseLink) {
      await navigator.clipboard.writeText(lastSubmittedJob.releaseLink);
      toast.info('Release link copied to clipboard');
    }
  };

  return (
    <SubmissionContainer>
      <PageHeader>
        <h1>Submit Print Job</h1>
        <p>Upload your document and configure print settings securely</p>
      </PageHeader>

      <SubmissionCard>
        <StepIndicator active={currentStep}>
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-text">Upload File</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-text">Configure Settings</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-text">Submit Job</div>
          </div>
        </StepIndicator>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <FileUploadSection {...getRootProps()} className={isDragActive ? 'drag-active' : ''}>
              <input {...getInputProps()} />
              <FaUpload className="upload-icon" />
              <div className="upload-text">
                {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
              </div>
              <div className="upload-hint">
                or click to select a file (PDF, DOC, DOCX, TXT, Images)
              </div>
              <button type="button" className="upload-button">
                Choose File
              </button>
            </FileUploadSection>
          )}

          {selectedFile && (
            <FilePreview>
              <div className="file-icon">
                <FaFileAlt />
              </div>
              <div className="file-info">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              </div>
              <button type="button" className="remove-file" onClick={removeFile}>
                <FaTimes />
              </button>
            </FilePreview>
          )}

          {currentStep >= 2 && currentStep !== 3 && (
            <>
              <FormSection>
                <div className="section-title">
                  <FaCog />
                  Print Settings
                </div>
                <FormGrid>
                  <FormGroup>
                    <label>Document Name</label>
                    <input
                      type="text"
                      value={jobData.documentName}
                      onChange={(e) => setJobData(prev => ({ ...prev, documentName: e.target.value }))}
                      placeholder="Enter document name"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Number of Pages</label>
                    <input
                      type="number"
                      min="1"
                      value={jobData.pages}
                      onChange={(e) => setJobData(prev => ({ ...prev, pages: parseInt(e.target.value) }))}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Number of Copies</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={jobData.copies}
                      onChange={(e) => setJobData(prev => ({ ...prev, copies: parseInt(e.target.value) }))}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Priority</label>
                    <select
                      value={jobData.priority}
                      onChange={(e) => setJobData(prev => ({ ...prev, priority: e.target.value }))}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <div className="section-title">
                  <FaPrint />
                  Print Options
                </div>
                <CheckboxGroup>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="color"
                      checked={jobData.color}
                      onChange={(e) => setJobData(prev => ({ ...prev, color: e.target.checked }))}
                    />
                    <label htmlFor="color">Color Printing</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="duplex"
                      checked={jobData.duplex}
                      onChange={(e) => setJobData(prev => ({ ...prev, duplex: e.target.checked }))}
                    />
                    <label htmlFor="duplex">Double-sided Printing</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="stapling"
                      checked={jobData.stapling}
                      onChange={(e) => setJobData(prev => ({ ...prev, stapling: e.target.checked }))}
                    />
                    <label htmlFor="stapling">Stapling</label>
                  </div>
                </CheckboxGroup>
              </FormSection>

              <FormSection>
                <div className="section-title">
                  <FaShieldAlt />
                  Security Features
                </div>
                <SecuritySection>
                  <div className="security-header">
                    <FaShieldAlt className="security-icon" />
                    <div className="security-title">Your document will be secured with:</div>
                  </div>
                  <div className="security-features">
                    <div className="feature">
                      <FaCheck className="feature-icon" />
                      <span>End-to-end encryption</span>
                    </div>
                    <div className="feature">
                      <FaCheck className="feature-icon" />
                      <span>Secure token authentication</span>
                    </div>
                    <div className="feature">
                      <FaCheck className="feature-icon" />
                      <span>Hold-and-release system</span>
                    </div>
                    <div className="feature">
                      <FaCheck className="feature-icon" />
                      <span>Audit trail logging</span>
                    </div>
                  </div>
                </SecuritySection>
              </FormSection>

              <FormSection>
                <div className="section-title">
                  <FaQrcode />
                  Release QR Code
                </div>
                <QRCodeSection>
                  <div className="qr-title">Scan this QR code at any printer to release your job</div>
                  <div className="qr-code">
                    <QRCodeCanvas 
                      value={`https://secureprint.company.com/release/${Date.now()}`} 
                      size={150} 
                    />
                  </div>
                </QRCodeSection>
              </FormSection>

              <FormGroup>
                <label>Additional Notes (Optional)</label>
                <textarea
                  value={jobData.notes}
                  onChange={(e) => setJobData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any special instructions or notes..."
                  rows="3"
                  style={{
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </FormGroup>
            </>
          )}

          {currentStep === 3 && lastSubmittedJob && (
            <>
              <FormSection>
                <div className="section-title">
                  <FaShieldAlt />
                  Secure Release Link
                </div>
                <LinkBox>{lastSubmittedJob.releaseLink}</LinkBox>
                <CopyButton type="button" onClick={copyLink}>Copy Link</CopyButton>
              </FormSection>
              <div style={{ marginTop: 12, color: '#7f8c8d' }}>
                Share this link with the person at the printer to release the job. The link encodes a secure token unique to this job.
              </div>
            </>
          )}

          <SubmitButton type="submit" disabled={loading || !selectedFile}>
            {loading ? 'Submitting...' : (currentStep === 3 ? 'Submit Another Job' : 'Submit Print Job')}
          </SubmitButton>
        </form>
      </SubmissionCard>
    </SubmissionContainer>
  );
};

export default PrintJobSubmission;
