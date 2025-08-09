import React from 'react';
import { Drawer, Box, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DashboardSidebarProps } from '../types/dashboard';

/**
 * DashboardSidebar - Navigation sidebar for dashboards
 *
 * This component provides a responsive sidebar for navigation and additional
 * dashboard controls with support for temporary/persistent modes.
 */

const StyledDrawer = styled(Drawer)<{ drawerWidth: number }>(({ theme, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const SidebarContent = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  open,
  onClose,
  width = 280,
  variant = 'persistent',
  anchor = 'left',
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerVariant = isMobile ? 'temporary' : variant;

  return (
    <StyledDrawer
      variant={drawerVariant}
      open={open}
      onClose={onClose}
      anchor={anchor}
      drawerWidth={width}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      <SidebarContent>{children}</SidebarContent>
    </StyledDrawer>
  );
};

export default DashboardSidebar;
