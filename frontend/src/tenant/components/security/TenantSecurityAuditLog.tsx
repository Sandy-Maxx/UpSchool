import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Warning,
  Security,
  Person,
  CheckCircle,
  Error,
  Info,
  VpnKey,
  Login,
  Logout,
  SupervisorAccount,
  PersonOutline,
  Groups,
  AccountBalance,
  Refresh,
  Download,
  School,
} from '@mui/icons-material';
import { format, subDays, isWithinInterval } from 'date-fns';
import { useAuth } from '../../../shared/store/hooks';

// Types for tenant security audit log
interface TenantSecurityEvent {
  id: string;
  timestamp: Date;
  eventType:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'PASSWORD_CHANGE'
    | 'PROFILE_UPDATE'
    | 'PERMISSION_DENIED'
    | 'SESSION_EXPIRED'
    | 'LOGOUT'
    | 'DATA_ACCESS'
    | 'BULK_OPERATION'
    | 'GRADE_MODIFICATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  userId: string;
  userName: string;
  userRole: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
  ipAddress: string;
  userAgent: string;
  location?: string;
  details: string;
  affectedResource?: string;
  metadata?: Record<string, any>;
}

// Mock data for demonstration
const mockTenantEvents: TenantSecurityEvent[] = [
  {
    id: '1',
    timestamp: new Date(),
    eventType: 'LOGIN_SUCCESS',
    severity: 'LOW',
    userId: 'admin_001',
    userName: 'John Administrator',
    userRole: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'New York, NY',
    details: 'Successful login to school admin portal',
    metadata: { loginMethod: 'password', sessionDuration: '4h 30m' },
  },
  {
    id: '2',
    timestamp: subDays(new Date(), 1),
    eventType: 'GRADE_MODIFICATION',
    severity: 'MEDIUM',
    userId: 'teacher_005',
    userName: 'Sarah Johnson',
    userRole: 'teacher',
    ipAddress: '10.0.0.25',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    location: 'School Campus',
    details: 'Modified grades for Mathematics - Class 10A',
    affectedResource: 'student_grades',
    metadata: { studentsAffected: 25, subject: 'Mathematics', class: '10A' },
  },
  {
    id: '3',
    timestamp: subDays(new Date(), 2),
    eventType: 'BULK_OPERATION',
    severity: 'HIGH',
    userId: 'admin_001',
    userName: 'John Administrator',
    userRole: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'New York, NY',
    details: 'Bulk student enrollment for new academic year',
    affectedResource: 'student_records',
    metadata: { operation: 'bulk_create', recordsAffected: 150, fileUploaded: 'students_2024.csv' },
  },
  {
    id: '4',
    timestamp: subDays(new Date(), 3),
    eventType: 'LOGIN_FAILURE',
    severity: 'MEDIUM',
    userId: 'parent_012',
    userName: 'Maria Garcia',
    userRole: 'parent',
    ipAddress: '198.51.100.25',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    location: 'Remote',
    details: 'Failed login attempt - incorrect password',
    metadata: { attempts: 3, accountLocked: false },
  },
];

const eventTypeColors = {
  LOGIN_SUCCESS: 'success',
  LOGIN_FAILURE: 'error',
  PASSWORD_CHANGE: 'info',
  PROFILE_UPDATE: 'info',
  PERMISSION_DENIED: 'error',
  SESSION_EXPIRED: 'warning',
  LOGOUT: 'default',
  DATA_ACCESS: 'primary',
  BULK_OPERATION: 'warning',
  GRADE_MODIFICATION: 'secondary',
} as const;

const severityColors = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error',
} as const;

const roleConfigs = {
  admin: { label: 'Administrator', icon: SupervisorAccount, color: '#1976d2' },
  teacher: { label: 'Teacher', icon: Person, color: '#388e3c' },
  student: { label: 'Student', icon: PersonOutline, color: '#f57c00' },
  parent: { label: 'Parent', icon: Groups, color: '#7b1fa2' },
  staff: { label: 'Staff', icon: AccountBalance, color: '#5d4037' },
};

const TenantSecurityAuditLog: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<TenantSecurityEvent[]>(mockTenantEvents);
  const [filteredEvents, setFilteredEvents] = useState<TenantSecurityEvent[]>(mockTenantEvents);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedEvent, setSelectedEvent] = useState<TenantSecurityEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState(7); // days
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        event =>
          event.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.ipAddress.includes(searchTerm) ||
          event.affectedResource?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Severity filter
    if (severityFilter) {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }

    // Event type filter
    if (eventTypeFilter) {
      filtered = filtered.filter(event => event.eventType === eventTypeFilter);
    }

    // Role filter
    if (roleFilter) {
      filtered = filtered.filter(event => event.userRole === roleFilter);
    }

    // Date range filter
    const now = new Date();
    const startDate = subDays(now, dateRange);
    filtered = filtered.filter(event =>
      isWithinInterval(event.timestamp, { start: startDate, end: now })
    );

    setFilteredEvents(filtered);
    setPage(0); // Reset to first page when filters change
  }, [events, searchTerm, severityFilter, eventTypeFilter, roleFilter, dateRange]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleViewDetails = (event: TenantSecurityEvent) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  const handleExport = () => {
    // Export functionality
    const csvContent = [
      'Timestamp,Event Type,Severity,User,Role,IP Address,Location,Details',
      ...filteredEvents.map(
        event =>
          `${format(event.timestamp, 'yyyy-MM-dd HH:mm:ss')},${event.eventType},${event.severity},${event.userName},${event.userRole},${event.ipAddress},${event.location || 'Unknown'},${event.details.replace(/,/g, ';')}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school-security-audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSeverityIcon = (severity: TenantSecurityEvent['severity']) => {
    switch (severity) {
      case 'HIGH':
        return <Error color="error" />;
      case 'MEDIUM':
        return <Warning color="warning" />;
      case 'LOW':
        return <CheckCircle color="success" />;
      default:
        return <Info />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Security sx={{ mr: 2 }} />
          School Security Audit Log
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor and track all security-related events within your school portal
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    High Priority Events
                  </Typography>
                  <Typography variant="h4">
                    {filteredEvents.filter(e => e.severity === 'HIGH').length}
                  </Typography>
                </Box>
                <Error color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Failed Logins
                  </Typography>
                  <Typography variant="h4">
                    {filteredEvents.filter(e => e.eventType === 'LOGIN_FAILURE').length}
                  </Typography>
                </Box>
                <Login color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Admin Actions
                  </Typography>
                  <Typography variant="h4">
                    {filteredEvents.filter(e => e.userRole === 'admin').length}
                  </Typography>
                </Box>
                <SupervisorAccount color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Events
                  </Typography>
                  <Typography variant="h4">{filteredEvents.length}</Typography>
                </Box>
                <Security color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            Filters & Search
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search by user, details..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severity"
                  onChange={e => setSeverityFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>User Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="User Role"
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {Object.entries(roleConfigs).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Time Range"
                  onChange={e => setDateRange(Number(e.target.value))}
                >
                  <MenuItem value={1}>Last 24 hours</MenuItem>
                  <MenuItem value={7}>Last 7 days</MenuItem>
                  <MenuItem value={30}>Last 30 days</MenuItem>
                  <MenuItem value={90}>Last 90 days</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>User</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(event => {
                  const roleConfig = roleConfigs[event.userRole];
                  const RoleIcon = roleConfig.icon;

                  return (
                    <TableRow key={event.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {format(event.timestamp, 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(event.timestamp, 'HH:mm:ss')}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={event.eventType.replace(/_/g, ' ')}
                          color={eventTypeColors[event.eventType] as any}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          icon={getSeverityIcon(event.severity)}
                          label={event.severity}
                          color={severityColors[event.severity] as any}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: roleConfig.color, width: 32, height: 32 }}>
                            <RoleIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {event.userName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {roleConfig.label}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {event.ipAddress}
                        </Typography>
                        {event.location && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {event.location}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                          {event.details}
                        </Typography>
                        {event.affectedResource && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Resource: {event.affectedResource}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(event)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredEvents.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Security sx={{ mr: 1 }} />
            Security Event Details
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedEvent && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Event ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {selectedEvent.id}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Timestamp
                  </Typography>
                  <Typography variant="body2">{format(selectedEvent.timestamp, 'PPpp')}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Event Type
                  </Typography>
                  <Chip
                    size="small"
                    label={selectedEvent.eventType.replace(/_/g, ' ')}
                    color={eventTypeColors[selectedEvent.eventType] as any}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Severity
                  </Typography>
                  <Chip
                    size="small"
                    label={selectedEvent.severity}
                    color={severityColors[selectedEvent.severity] as any}
                    variant="filled"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User
                  </Typography>
                  <Typography variant="body2">{selectedEvent.userName}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body2">
                    {roleConfigs[selectedEvent.userRole].label}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    IP Address
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {selectedEvent.ipAddress}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">{selectedEvent.location || 'Unknown'}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User Agent
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {selectedEvent.userAgent}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Details
                  </Typography>
                  <Typography variant="body2">{selectedEvent.details}</Typography>
                </Grid>

                {selectedEvent.affectedResource && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Affected Resource
                    </Typography>
                    <Typography variant="body2">{selectedEvent.affectedResource}</Typography>
                  </Grid>
                )}

                {selectedEvent.metadata && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Additional Metadata
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                        {JSON.stringify(selectedEvent.metadata, null, 2)}
                      </pre>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantSecurityAuditLog;
