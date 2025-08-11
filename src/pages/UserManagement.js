import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEdit, 
  FaTrash, 
  FaShieldAlt
} from 'react-icons/fa';

const ManagementContainer = styled.div`
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

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.role === 'admin' ? '#e74c3c' : '#3498db'};
  
  .user-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: ${props => props.role === 'admin' ? '#e74c3c' : '#3498db'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    .user-info {
      flex: 1;
      
      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      
      .user-role {
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
        font-weight: 500;
      }
    }
  }
  
  .user-details {
    margin-bottom: 16px;
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #7f8c8d;
    }
  }
  
  .user-actions {
    display: flex;
    gap: 8px;
    
    .action-btn {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #e1e5e9;
      border-radius: 6px;
      background: white;
      color: #333;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      
      &:hover {
        background: #f8f9fa;
      }
      
      &.danger:hover {
        background: #f8d7da;
        color: #721c24;
        border-color: #f5c6cb;
      }
    }
  }
`;

const UserManagement = () => {
  const { mockUsers } = useAuth();

  return (
    <ManagementContainer>
      <PageHeader>
        <h1>User Management</h1>
        <p>Manage user accounts, permissions, and access controls</p>
      </PageHeader>

      <UsersGrid>
        {mockUsers.map(user => (
          <UserCard key={user.id} role={user.role}>
            <div className="user-header">
              <div className="user-avatar">
                {user.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
            </div>
            
            <div className="user-details">
              <div className="detail-item">
                <FaUser />
                <span>{user.username}</span>
              </div>
              <div className="detail-item">
                <FaShieldAlt />
                <span>PIN: {user.pin}</span>
              </div>
              <div className="detail-item">
                <span>Department: {user.department}</span>
              </div>
            </div>
            
            <div className="user-actions">
              <button className="action-btn">
                <FaEdit />
                Edit
              </button>
              <button className="action-btn">
                <FaShieldAlt />
                Permissions
              </button>
              <button className="action-btn danger">
                <FaTrash />
                Delete
              </button>
            </div>
          </UserCard>
        ))}
      </UsersGrid>
    </ManagementContainer>
  );
};

export default UserManagement;
