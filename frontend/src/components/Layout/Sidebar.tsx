import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  LibraryBooks as LibraryIcon,
  DirectionsBus as TransportIcon,
  Message as CommunicationIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Book as BookIcon,
  Group as TeachersIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@shared/store';
import PermissionGate from '@shared/rbac/components/PermissionGate';

interface SidebarProps {
  onClose?: () => void;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/overview',
    },
    {
      text: 'Students',
      icon: <PeopleIcon />,
      path: '/admin/students',
    },
    // Academic Section
    {
      text: 'Academic: Grades',
      icon: <ClassIcon />,
      path: '/admin/academic/grades',
    },
    {
      text: 'Academic: Subjects',
      icon: <BookIcon />,
      path: '/admin/academic/subjects',
    },
    {
      text: 'Academic: Assignments',
      icon: <TeachersIcon />,
      path: '/admin/academic/assignments',
    },
    {
      text: 'Academic: Timetable',
      icon: <SchoolIcon />,
      path: '/admin/academic/timetable',
    },
    {
      text: 'Academic: Exams',
      icon: <SchoolIcon />,
      path: '/admin/academic/exams',
    },
    {
      text: 'Academic: Calendar',
      icon: <SchoolIcon />,
      path: '/admin/academic/calendar',
    },
    {
      text: 'Library',
      icon: <LibraryIcon />,
      path: '/library',
    },
    {
      text: 'Transport',
      icon: <TransportIcon />,
      path: '/transport',
    },
    {
      text: 'Communication',
      icon: <CommunicationIcon />,
      path: '/communication',
    },
    {
      text: 'Reports',
      icon: <ReportsIcon />,
      path: '/reports',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              mr: 2,
            }}
          >
            <SchoolIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user?.school?.name || 'School ERP'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {user?.school?.tenant?.subdomain || 'school'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              bgcolor: 'white',
              color: theme.palette.primary.main,
            }}
          >
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => {
            const node = (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.contrastText,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color:
                        location.pathname === item.path
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                  />
                  {item.badge && (
                    <Box
                      sx={{
                        backgroundColor: theme.palette.error.main,
                        color: 'white',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            );
            // Gate only academic items with RBAC
            if (item.path.startsWith('/admin/academic')) {
              return (
                <PermissionGate key={item.text} resource="academic" action="view" fallback={null}>
                  {node}
                </PermissionGate>
              );
            }
            return node;
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          © 2024 School ERP Platform
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: theme.palette.text.secondary }}>
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
