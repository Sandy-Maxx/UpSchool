import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Person, School, Assignment, FamilyRestroom, Build, MoreVert } from '@mui/icons-material';

interface UserStats {
  role: string;
  count: number;
  active: number;
  inactive: number;
  icon: React.ReactNode;
  color: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  avatar?: string;
}

const UserOverview: React.FC = () => {
  const theme = useTheme();

  const userStats: UserStats[] = [
    {
      role: 'Students',
      count: 1247,
      active: 1189,
      inactive: 58,
      icon: <School sx={{ fontSize: 20 }} />,
      color: theme.palette.primary.main,
    },
    {
      role: 'Teachers',
      count: 89,
      active: 87,
      inactive: 2,
      icon: <Assignment sx={{ fontSize: 20 }} />,
      color: theme.palette.success.main,
    },
    {
      role: 'Parents',
      count: 892,
      active: 845,
      inactive: 47,
      icon: <FamilyRestroom sx={{ fontSize: 20 }} />,
      color: theme.palette.info.main,
    },
    {
      role: 'Staff',
      count: 45,
      active: 42,
      inactive: 3,
      icon: <Build sx={{ fontSize: 20 }} />,
      color: theme.palette.warning.main,
    },
  ];

  const recentUsers: RecentUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@school.com',
      role: 'Student',
      status: 'active',
      lastActive: '2 hours ago',
      avatar: 'JD',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@school.com',
      role: 'Teacher',
      status: 'active',
      lastActive: '1 hour ago',
      avatar: 'JS',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@school.com',
      role: 'Parent',
      status: 'pending',
      lastActive: '3 hours ago',
      avatar: 'MJ',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@school.com',
      role: 'Staff',
      status: 'active',
      lastActive: '30 minutes ago',
      avatar: 'SW',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return theme.palette.primary.main;
      case 'teacher':
        return theme.palette.success.main;
      case 'parent':
        return theme.palette.info.main;
      case 'staff':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      {/* User Statistics */}
      <Grid container spacing={3} mb={4}>
        {userStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(stat.color, 0.02)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.1)}`,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha(stat.color, 0.1),
                  color: stat.color,
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
                {stat.count.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {stat.role}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="success.main">
                  {stat.active} Active
                </Typography>
                <Typography variant="caption" color="error.main">
                  {stat.inactive} Inactive
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Recent Users Table */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Recent Users
          </Typography>
          <Button variant="outlined" size="small">
            View All Users
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          bgcolor: getRoleColor(user.role),
                          fontSize: '0.875rem',
                        }}
                      >
                        {user.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        bgcolor: alpha(getRoleColor(user.role), 0.1),
                        color: getRoleColor(user.role),
                        fontWeight: 'medium',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={getStatusColor(user.status) as any}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.lastActive}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="text">
                      <MoreVert sx={{ fontSize: 16 }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UserOverview;
