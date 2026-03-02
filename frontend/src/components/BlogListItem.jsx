/**
 * @component BlogListItem
 * Displays a single blog entry with expandable details.
 *
 * Features:
 * - Collapsed view shows only the title and a "view" toggle button
 * - Expanded view shows author, url, likes (with like button), and username
 * - The "remove" button is only visible to the blog's creator
 * - Uses React Query mutations for like and delete operations
 * - Notifications via NotificationContext on success/error
 *
 * Props:
 * - blog: Blog object { id, title, author, url, likes, user }
 */

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { ListItem, ListItemButton, ListItemText, Chip, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const BlogListItem = ({ blog }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
        <ListItemText primary={blog.title} secondary={`by ${blog.author}`} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Chip label={blog.likes} size="small" variant="outlined" />
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

BlogListItem.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
};

export default BlogListItem;
