import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Popup from '../Popup';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      age
      height
      weight
      activity_level
      dietary_preferences
      health_goals
      isBlocked
    }
  }
`;

const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      id
    }
  }
`;

const UNBLOCK_USER = gql`
  mutation UnblockUser($id: ID!) {
    unblockUser(id: $id) {
      id
    }
  }
`;

function UserManagement() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [blockUser] = useMutation(BLOCK_USER, {
    onCompleted: () => handleShowPopup('User blocked successfully!'),
    onError: (error) => handleShowPopup(`Error blocking user: ${error.message}`)
  });
  const [unblockUser] = useMutation(UNBLOCK_USER, {
    onCompleted: () => handleShowPopup('User unblocked successfully!'),
    onError: (error) => handleShowPopup(`Error unblocking user: ${error.message}`)
  });
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Data:', data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleShowPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleBlockUser = (id) => {
    blockUser({ variables: { id } });
  };

  const handleUnblockUser = (id) => {
    unblockUser({ variables: { id } });
  };

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.isBlocked ? 'Blocked' : 'Active'}
            <button onClick={() => handleBlockUser(user.id)}>Block</button>
            <button onClick={() => handleUnblockUser(user.id)}>Unblock</button>
          </li>
        ))}
      </ul>
      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default UserManagement;
