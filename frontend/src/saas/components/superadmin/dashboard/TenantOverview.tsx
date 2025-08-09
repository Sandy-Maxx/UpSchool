import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Visibility,
  Pause,
  PlayArrow,
  Delete,
  Settings,
  TrendingUp,
  TrendingDown,
  School,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { formatNumber, formatCurrency, formatDate } from '../../../../shared/utils/formatters';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  plan: 'starter' | 'professional' | 'enterprise';
  users: number;
  students: number;
  monthlyRevenue: number;
  createdAt: string;
  lastActive: string;
  growth: number;
  logo?: string;
}

interface TenantRowProps {
  tenant: Tenant;
  onAction: (action: string, tenant: Tenant) => void;
}

const TenantRow: React.FC<TenantRowProps> = ({ tenant, onAction }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    handleClose();
    onAction(action, tenant);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      active: { color: 'success' as const, label: 'Active' },
      inactive: { color: 'default' as const, label: 'Inactive' },
      suspended: { color: 'error' as const, label: 'Suspended' },
      trial: { color: 'warning' as const, label: 'Trial' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getPlanChip = (plan: string) => {
    const planConfig = {
      starter: { color: 'default' as const, label: 'Starter' },
      professional: { color: 'primary' as const, label: 'Professional' },
      enterprise: { color: 'secondary' as const, label: 'Enterprise' },
    };

    const config = planConfig[plan as keyof typeof planConfig] || planConfig.starter;
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
    ) : (
      <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
    );
  };

  return (
    <TableRow hover data-testid={`tenant-row-${tenant.id}`}>
      <TableCell>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={tenant.logo} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <School fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {tenant.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {tenant.subdomain}.schoolerp.com
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{getStatusChip(tenant.status)}</TableCell>
      <TableCell>{getPlanChip(tenant.plan)}</TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <People fontSize="small" color="action" />
          <Typography variant="body2">{formatNumber(tenant.users)}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <School fontSize="small" color="action" />
          <Typography variant="body2">{formatNumber(tenant.students)}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <AttachMoney fontSize="small" color="action" />
          <Typography variant="body2">{formatCurrency(tenant.monthlyRevenue)}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={0.5}>
          {getGrowthIcon(tenant.growth)}
          <Typography variant="caption" color={tenant.growth > 0 ? 'success.main' : 'error.main'}>
            {tenant.growth > 0 ? '+' : ''}
            {tenant.growth}%
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="caption" color="text.secondary">
          {formatDate(tenant.lastActive)}
        </Typography>
      </TableCell>
      <TableCell>
        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? 'tenant-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="tenant-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'tenant-button',
          }}
        >
          <MenuItem onClick={() => handleAction('view')}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('edit')}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Tenant</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('settings')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          {tenant.status === 'active' ? (
            <MenuItem onClick={() => handleAction('suspend')}>
              <ListItemIcon>
                <Pause fontSize="small" />
              </ListItemIcon>
              <ListItemText>Suspend</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleAction('activate')}>
              <ListItemIcon>
                <PlayArrow fontSize="small" />
              </ListItemIcon>
              <ListItemText>Activate</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

export const TenantOverview: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/saas/tenants');
      if (!response.ok) {
        throw new Error('Failed to fetch tenants');
      }
      const result = await response.json();
      setTenants(result.data.tenants);
      setError(null);
    } catch (err) {
      setError('Failed to load tenant data');
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleTenantAction = (action: string, tenant: Tenant) => {
    console.log(`Action ${action} for tenant:`, tenant);
    // Implement actual actions like view, edit, suspend, etc.
    switch (action) {
      case 'view':
        // Navigate to tenant details
        break;
      case 'edit':
        // Open edit dialog
        break;
      case 'suspend':
        // Suspend tenant
        break;
      case 'activate':
        // Activate tenant
        break;
      case 'delete':
        // Delete tenant with confirmation
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <LinearProgress data-testid="tenant-overview-loading" />;
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={4} data-testid="tenant-overview-error">
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} data-testid="tenant-overview-header">
        <Typography variant="body2" color="text.secondary">
          {tenants.length} tenants • {tenants.filter(t => t.status === 'active').length} active
        </Typography>
        <Button variant="outlined" size="small">
          View All Tenants
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>School</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Growth</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell width={50}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.slice(0, 5).map(tenant => (
              <TenantRow key={tenant.id} tenant={tenant} onAction={handleTenantAction} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {tenants.length > 5 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="text" color="primary">
            Show {tenants.length - 5} more tenants
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TenantOverview;
