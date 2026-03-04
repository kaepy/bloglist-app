/**
 * @component UserList
 * Fetches all users and renders them in a table with their blog counts.
 * Each username links to the user's detail page (/users/:id).
 */
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/users";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Link as MuiLink,
} from "@mui/material";

const UserList = () => {
  const users = useQuery({ queryKey: ["users"], queryFn: getAllUsers });

  if (users.isLoading) return <LoadingSpinner message="Loading users..." />;

  if (users.isError) return <Alert severity="error">Error loading users. Please try again.</Alert>;

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ my: 2 }}>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "secondary.main",
                // Kaikki solut headerin sisällä saavat mustan, bold-tekstin
                "& .MuiTableCell-root": {
                  color: "secondary.contrastText",
                  fontWeight: 700,
                },
              }}
            >
              <TableCell>User</TableCell>
              <TableCell align="right">Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.data.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 214, 0, 0.08) !important", // Keltainen sävy
                  },
                  transition: "background-color 0.2s ease",
                }}
              >
                <TableCell>
                  <MuiLink component={Link} to={`/users/${user.id}`}>
                    {user.username}
                  </MuiLink>
                </TableCell>
                <TableCell align="right">{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserList;
