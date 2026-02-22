/**
 * @component User
 * Detail page for a single user. Reads :id from the URL and fetches the user
 * (including their blogs array) via useQuery.
 *
 * Each blog title links to its detail page (/blogs/:id).
 */
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserById } from "../services/users";
import { Link } from "react-router-dom";

const User = () => {
  const { id } = useParams();

  // useQuery returns { data, isLoading, isError, ... } — not the data directly
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>User not found.</div>;

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
