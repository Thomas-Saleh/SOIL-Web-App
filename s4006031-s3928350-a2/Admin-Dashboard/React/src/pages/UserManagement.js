import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, BLOCK_USER, UNBLOCK_USER } from '../queries';

const UserManagement = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [blockUser] = useMutation(BLOCK_USER);
  const [unblockUser] = useMutation(UNBLOCK_USER);

  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Data:', data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.isBlocked ? 'Blocked' : 'Active'}
            <button onClick={() => blockUser({ variables: { id: user.id } })}>Block</button>
            <button onClick={() => unblockUser({ variables: { id: user.id } })}>Unblock</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
