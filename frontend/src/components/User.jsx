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

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
  Box,
  Chip,
} from "@mui/material";

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

  if (isLoading)
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 4 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading user data...
        </Typography>
      </Box>
    );
  if (isError) return <Alert severity="error">User not found.</Alert>;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          Blogs added by{" "}
          <Box component="span" sx={{ color: "primary.main", fontWeight: "bold" }}>
            {user.username}
          </Box>
        </Typography>
      </CardContent>

      <Divider />

      {user.blogs.length > 0 ? (
        <List sx={{ listStyleType: "disc", pl: 4 }}>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id} disablePadding sx={{ display: "list-item" }}>
              <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
                <ListItemText primary={blog.title} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Chip label={blog.likes} size="small" variant="outlined" />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No blogs added yet.
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default User;
