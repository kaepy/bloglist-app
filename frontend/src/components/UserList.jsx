import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/users";
import { Link } from "react-router-dom";

const UserList = () => {
  const users = useQuery({ queryKey: ["users"], queryFn: getAllUsers });

  if (users.isLoading) {
    return <div>loading users...</div>;
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>User</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td style={{ textAlign: "center" }}>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
