/**
 * @component User
 * Detail page for a single user. Reads :id from the URL and fetches the user
 * (including their blogs array) via useQuery.
 *
 * Each blog title links to its detail page (/blogs/:id).
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserById } from "../services/users";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

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
  const queryClient = useQueryClient();

  // useQuery returns { data, isLoading, isError, ... } — not the data directly
  // placeholderData: if UserList has already fetched ["users"], find the matching
  // user in that cache so this page renders instantly instead of showing a spinner.
  // isPlaceholderData will be true until the real getUserById fetch completes.
  // On hard refresh, ["users"] is empty too — spinner shows normally in that case.
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    placeholderData: () => {
      const users = queryClient.getQueryData(["users"]);
      return users?.find((u) => u.id === id);
    },
  });

  if (isLoading) return <LoadingSpinner message="Loading user data..." />;
  if (isError) return <Alert severity="error">User not found.</Alert>;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          Blogs added by{" "}
          <Typography
            variant="h4"
            component="span"
            sx={{
              backgroundColor: "secondary.main",
              color: "secondary.contrastText", // #212121 — musta
              px: 1, // Marginaali sivuille
              borderRadius: 1,
            }}
          >
            {user.username}
          </Typography>
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
                  <Chip label={blog.likes} />
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
