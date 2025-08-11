import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { usePrintJob } from '../context/PrintJobContext';
import { 
  FaPrint, 
  FaTrash, 
  FaEye, 
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaFileAlt,
  FaSearch,
  FaSort,
  FaDownload
} from 'react-icons/fa';

const QueueContainer = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
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

const ControlsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }
  
  input, select {
    padding: 10px;
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

const SearchBox = styled.div`
  position: relative;
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  
  input {
    padding-left: 40px;
  }
`;

const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const FilterChip = styled.button`
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#2980b9' : '#f8f9fa'};
  }
`;

const JobsContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const JobsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .jobs-count {
      font-weight: 500;
      color: #2c3e50;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
  }
`;

const JobList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const JobItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const JobIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'printing': return '#d1ecf1';
      case 'completed': return '#d4edda';
      case 'cancelled': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'printing': return '#0c5460';
      case 'completed': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#6c757d';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 16px;
`;

const JobDetails = styled.div`
  flex: 1;
  
  .job-name {
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 4px;
    font-size: 16px;
  }
  
  .job-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #7f8c8d;
    margin-bottom: 8px;
  }
  
  .job-options {
    display: flex;
    gap: 8px;
    font-size: 12px;
    
    .option {
      padding: 2px 6px;
      border-radius: 4px;
      background: #e9ecef;
      color: #495057;
    }
  }
`;

const JobStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
  
  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    
    &.pending {
      background: #fff3cd;
      color: #856404;
    }
    
    &.printing {
      background: #d1ecf1;
      color: #0c5460;
    }
    
    &.completed {
      background: #d4edda;
      color: #155724;
    }
    
    &.cancelled {
      background: #f8d7da;
      color: #721c24;
    }
  }
  
  .job-cost {
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
  }
`;

const JobActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.danger:hover {
    background: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
  }
  
  &.success:hover {
    background: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  .empty-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .empty-description {
    font-size: 14px;
  }
`;

const PrintJobQueue = () => {
  const { currentUser } = useAuth();
  const { printJobs, cancelPrintJob, deletePrintJob } = usePrintJob();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    let jobs = printJobs.filter(job => job.userId === currentUser?.id);

    // Apply filters
    if (filters.status !== 'all') {
      jobs = jobs.filter(job => job.status === filters.status);
    }
    if (filters.priority !== 'all') {
      jobs = jobs.filter(job => job.priority === filters.priority);
    }
    if (filters.search) {
      jobs = jobs.filter(job => 
        job.documentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.notes?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    jobs.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'submittedAt' || sortBy === 'releasedAt' || sortBy === 'completedAt') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredJobs(jobs);
  }, [printJobs, filters, sortBy, sortOrder, currentUser?.id]);

  const handleCancelJob = async (jobId) => {
    try {
      await cancelPrintJob(jobId);
      toast.success('Print job cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel print job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deletePrintJob(jobId);
      toast.success('Print job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete print job');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock />;
      case 'printing': return <FaPrint />;
      case 'completed': return <FaCheckCircle />;
      case 'cancelled': return <FaExclamationTriangle />;
      default: return <FaFileAlt />;
    }
  };

  return (
    <QueueContainer>
      <PageHeader>
        <h1>Print Job Queue</h1>
        <p>Manage and track your secure print jobs</p>
      </PageHeader>

      <ControlsSection>
        <ControlsGrid>
          <SearchBox>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </SearchBox>
          
          <ControlGroup>
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="printing">Printing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </ControlGroup>
          
          <ControlGroup>
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </ControlGroup>
        </ControlsGrid>

        <FilterChips>
          <FilterChip
            active={filters.status === 'all'}
            onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
          >
            All ({printJobs.filter(job => job.userId === currentUser?.id).length})
          </FilterChip>
          <FilterChip
            active={filters.status === 'pending'}
            onClick={() => setFilters(prev => ({ ...prev, status: 'pending' }))}
          >
            Pending ({printJobs.filter(job => job.userId === currentUser?.id && job.status === 'pending').length})
          </FilterChip>
          <FilterChip
            active={filters.status === 'printing'}
            onClick={() => setFilters(prev => ({ ...prev, status: 'printing' }))}
          >
            Printing ({printJobs.filter(job => job.userId === currentUser?.id && job.status === 'printing').length})
          </FilterChip>
          <FilterChip
            active={filters.status === 'completed'}
            onClick={() => setFilters(prev => ({ ...prev, status: 'completed' }))}
          >
            Completed ({printJobs.filter(job => job.userId === currentUser?.id && job.status === 'completed').length})
          </FilterChip>
        </FilterChips>
      </ControlsSection>

      <JobsContainer>
        <JobsHeader>
          <div className="header-left">
            <div className="jobs-count">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="header-right">
            <SortButton
              active={sortBy === 'submittedAt'}
              onClick={() => handleSort('submittedAt')}
            >
              <FaSort />
              Date
            </SortButton>
            <SortButton
              active={sortBy === 'priority'}
              onClick={() => handleSort('priority')}
            >
              <FaSort />
              Priority
            </SortButton>
            <SortButton
              active={sortBy === 'status'}
              onClick={() => handleSort('status')}
            >
              <FaSort />
              Status
            </SortButton>
          </div>
        </JobsHeader>

        <JobList>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobItem key={job.id}>
                <JobIcon status={job.status}>
                  {getStatusIcon(job.status)}
                </JobIcon>
                
                <JobDetails>
                  <div className="job-name">{job.documentName || 'Document'}</div>
                  <div className="job-meta">
                    <span>Submitted: {formatDate(job.submittedAt)}</span>
                    {job.releasedAt && <span>Released: {formatDate(job.releasedAt)}</span>}
                    {job.completedAt && <span>Completed: {formatDate(job.completedAt)}</span>}
                    <span>{job.pages} pages</span>
                    <span>{job.copies} copies</span>
                  </div>
                  <div className="job-options">
                    {job.color && <span className="option">Color</span>}
                    {job.duplex && <span className="option">Duplex</span>}
                    {job.stapling && <span className="option">Stapled</span>}
                    <span className="option">{job.priority}</span>
                  </div>
                </JobDetails>
                
                <JobStatus>
                  <div className={`status-badge ${job.status}`}>
                    {job.status}
                  </div>
                  <div className="job-cost">${job.cost}</div>
                </JobStatus>
                
                <JobActions>
                  <ActionButton title="View Details">
                    <FaEye />
                  </ActionButton>
                  {job.status === 'pending' && (
                    <ActionButton
                      title="Cancel Job"
                      className="danger"
                      onClick={() => handleCancelJob(job.id)}
                    >
                      <FaTimes />
                    </ActionButton>
                  )}
                  {(job.status === 'completed' || job.status === 'cancelled') && (
                    <ActionButton
                      title="Delete Job"
                      className="danger"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <FaTrash />
                    </ActionButton>
                  )}
                  {job.status === 'completed' && (
                    <ActionButton title="Download" className="success">
                      <FaDownload />
                    </ActionButton>
                  )}
                </JobActions>
              </JobItem>
            ))
          ) : (
            <EmptyState>
              <FaFileAlt className="empty-icon" />
              <div className="empty-title">No print jobs found</div>
              <div className="empty-description">
                {filters.status !== 'all' || filters.search
                  ? 'Try adjusting your filters or search terms'
                  : 'Submit your first print job to get started'
                }
              </div>
            </EmptyState>
          )}
        </JobList>
      </JobsContainer>
    </QueueContainer>
  );
};

export default PrintJobQueue;
