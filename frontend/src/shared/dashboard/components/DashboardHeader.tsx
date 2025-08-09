import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  Tooltip,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Menu as MenuIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import type { DashboardHeaderProps } from '../types/dashboard';

/**
 * DashboardHeader - Header component for all dashboards
 *
 * This component provides a consistent header across all dashboards with:
 * - Title and subtitle display
 * - Breadcrumb navigation
 * - Action buttons (refresh, settings, fullscreen)
 * - Custom action area
 * - Responsive design
 * - Theme integration
 */

interface ExtendedDashboardHeaderProps extends DashboardHeaderProps {
  /** Show menu button (for mobile) */
  showMenu?: boolean;

  /** Menu button click handler */
  onMenuClick?: () => void;

  /** Is fullscreen mode active */
  isFullscreen?: boolean;

  /** Show loading indicator */
  isLoading?: boolean;

  /** Additional header info */
  info?: React.ReactNode;

  /** Header variant */
  variant?: 'default' | 'compact' | 'minimal';
}

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  zIndex: theme.zIndex.drawer - 1,
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: 64,
  gap: theme.spacing(2),
}));

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0, // Allow text truncation
}));

const ActionsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginLeft: 'auto',
  flexShrink: 0,
}));

const BreadcrumbSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const LoadingIndicator = styled(Box)(({ theme }) => ({
  width: 3,
  height: 3,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  animation: 'pulse 1.5s infinite ease-in-out',
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 0.4,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.2)',
    },
  },
}));

const DashboardHeader: React.FC<ExtendedDashboardHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  showRefresh = true,
  showSettings = true,
  showFullscreen = true,
  showMenu = false,
  onRefresh,
  onSettings,
  onFullscreen,
  onMenuClick,
  isFullscreen = false,
  isLoading = false,
  info,
  variant = 'default',
}) => {
  const theme = useTheme();

  const renderBreadcrumbs = () => {
    if (!breadcrumbs?.length) return null;

    return (
      <BreadcrumbSection>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            if (isLast || !crumb.path) {
              return (
                <Typography
                  key={crumb.label}
                  color={isLast ? 'text.primary' : 'text.secondary'}
                  variant="body2"
                  fontWeight={isLast ? 500 : 400}
                >
                  {crumb.label}
                </Typography>
              );
            }

            return (
              <Link
                key={crumb.label}
                color="text.secondary"
                href={crumb.path}
                variant="body2"
                underline="hover"
                sx={{
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </BreadcrumbSection>
    );
  };

  const renderActionButtons = () => (
    <ActionsSection>
      {/* Custom Actions */}
      {actions}

      {/* Divider if custom actions exist */}
      {actions && (showRefresh || showSettings || showFullscreen) && (
        <Divider orientation="vertical" flexItem />
      )}

      {/* Refresh Button */}
      {showRefresh && onRefresh && (
        <Tooltip title="Refresh Dashboard">
          <IconButton
            onClick={onRefresh}
            disabled={isLoading}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <RefreshIcon
              sx={{
                animation: isLoading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      )}

      {/* Settings Button */}
      {showSettings && onSettings && (
        <Tooltip title="Dashboard Settings">
          <IconButton
            onClick={onSettings}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Fullscreen Button */}
      {showFullscreen && onFullscreen && (
        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
          <IconButton
            onClick={onFullscreen}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      )}
    </ActionsSection>
  );

  const renderTitle = () => {
    switch (variant) {
      case 'compact':
        return (
          <TitleSection>
            <Typography variant="h6" component="h1" noWrap>
              {title}
            </Typography>
          </TitleSection>
        );

      case 'minimal':
        return (
          <Typography variant="h6" component="h1" noWrap>
            {title}
          </Typography>
        );

      default:
        return (
          <TitleSection>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="h5"
                component="h1"
                fontWeight={600}
                noWrap
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              {isLoading && <LoadingIndicator />}
            </Box>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  lineHeight: 1.3,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </TitleSection>
        );
    }
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar
        disableGutters
        sx={{
          px: { xs: 2, sm: 3 },
          minHeight: variant === 'compact' ? 56 : 64,
        }}
      >
        <HeaderContent>
          {/* Menu Button (Mobile) */}
          {showMenu && onMenuClick && (
            <IconButton
              edge="start"
              onClick={onMenuClick}
              sx={{
                display: { md: 'none' },
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Title Section */}
          {renderTitle()}

          {/* Info Section */}
          {info && variant === 'default' && (
            <InfoSection>
              <Divider orientation="vertical" flexItem />
              {info}
            </InfoSection>
          )}

          {/* Actions */}
          {renderActionButtons()}
        </HeaderContent>
      </Toolbar>

      {/* Breadcrumbs Row */}
      {breadcrumbs?.length && variant === 'default' && (
        <>
          <Divider />
          <Toolbar
            variant="dense"
            disableGutters
            sx={{
              px: { xs: 2, sm: 3 },
              minHeight: 48,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            {renderBreadcrumbs()}
          </Toolbar>
        </>
      )}
    </StyledAppBar>
  );
};

export default DashboardHeader;

// Export additional components for custom usage
export {
  StyledAppBar,
  HeaderContent,
  TitleSection,
  ActionsSection,
  BreadcrumbSection,
  InfoSection,
  LoadingIndicator,
};
