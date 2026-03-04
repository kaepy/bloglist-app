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
    <ListItem
      className="blog"
      disablePadding
      sx={{
        // Keltainen vasen reunaviiva — antaa listan elementeille "korttimaisen" ilmeen
        borderLeft: "3px solid transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          borderLeft: "3px solid",
          borderLeftColor: "secondary.main", // Keltainen viiva hoverilla
          transform: "translateX(4px)", // Siirtyy hieman oikealle
          backgroundColor: "rgba(255, 214, 0, 0.04)", // Hienoinen keltainen tausta
        },
      }}
    >
      <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
        <ListItemText primary={blog.title} secondary={`by ${blog.author}`} />
        <Chip
          icon={<ThumbUpIcon sx={{ color: "inherit" }} />}
          label={blog.likes}
          sx={{
            color: "secondary.contrastText",
            fontWeight: 600,
            // Ikonin väri — Chip ylikirjoittaa lapsen värin,
            // joten se pitää pakottaa tässä
            "& .MuiChip-icon": {
              color: "inherit",
            },
            // Lisää ilmavuutta
            px: 0.5,
            height: 28,
          }}
        />
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
