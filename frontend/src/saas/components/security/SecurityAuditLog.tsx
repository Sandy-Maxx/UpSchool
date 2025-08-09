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
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Warning,
  Security,
  Person,
  Block,
  CheckCircle,
  Error,
  Info,
  VpnKey,
  Login,
  Logout,
  AdminPanelSettings,
  Business,
  Refresh,
  Download,
} from '@mui/icons-material';
import { format, subDays, isWithinInterval } from 'date-fns';

// Types for security audit log
interface SecurityEvent {
  id: string;
  timestamp: Date;
  eventType:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'PASSWORD_RESET'
    | 'ACCOUNT_LOCKED'
    | 'PERMISSION_DENIED'
    | 'TOKEN_REFRESH'
    | 'SESSION_EXPIRED'
    | 'LOGOUT'
    | 'TENANT_ACCESS'
    | 'SUSPICIOUS_ACTIVITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId?: string;
  userEmail?: string;
  userRole?: string;
  tenantId?: string;
  tenantName?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  details: string;
  metadata?: Record<string, any>;
}

// Mock data for demonstration
const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    timestamp: new Date(),
    eventType: 'LOGIN_SUCCESS',
    severity: 'LOW',
    userId: 'user_123',
    userEmail: 'admin@example.com',
    userRole: 'superadmin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'New York, NY',
    details: 'Successful login to system admin portal',
    metadata: { loginMethod: 'password', mfa: true },
  },
  {
    id: '2',
    timestamp: subDays(new Date(), 1),
    eventType: 'LOGIN_FAILURE',
    severity: 'MEDIUM',
    userEmail: 'unknown@test.com',
    ipAddress: '10.0.0.50',
    userAgent: 'curl/7.68.0',
    location: 'Unknown',
    details: 'Failed login attempt with invalid credentials',
    metadata: { attempts: 3, blocked: false },
  },
  {
    id: '3',
    timestamp: subDays(new Date(), 2),
    eventType: 'TENANT_ACCESS',
    severity: 'LOW',
    userId: 'user_456',
    userEmail: 'school.admin@brightfuture.edu',
    userRole: 'admin',
    tenantId: 'tenant_789',
    tenantName: 'Bright Future Academy',
    ipAddress: '203.0.113.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    location: 'San Francisco, CA',
    details: 'Admin accessed tenant dashboard',
  },
  {
    id: '4',
    timestamp: subDays(new Date(), 3),
    eventType: 'SUSPICIOUS_ACTIVITY',
    severity: 'HIGH',
    userId: 'user_789',
    userEmail: 'suspicious@domain.com',
    ipAddress: '198.51.100.25',
    userAgent: 'Python/3.9 requests/2.25.1',
    location: 'Unknown',
    details: 'Multiple failed login attempts from suspicious IP',
    metadata: { attempts: 15, timeWindow: '5 minutes', blocked: true },
  },
];

const eventTypeColors = {
  LOGIN_SUCCESS: 'success',
  LOGIN_FAILURE: 'error',
  PASSWORD_RESET: 'info',
  ACCOUNT_LOCKED: 'warning',
  PERMISSION_DENIED: 'error',
  TOKEN_REFRESH: 'info',
  SESSION_EXPIRED: 'warning',
  LOGOUT: 'default',
  TENANT_ACCESS: 'primary',
  SUSPICIOUS_ACTIVITY: 'error',
} as const;

const severityColors = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error',
  CRITICAL: 'error',
} as const;

const eventTypeIcons = {
  LOGIN_SUCCESS: CheckCircle,
  LOGIN_FAILURE: Error,
  PASSWORD_RESET: VpnKey,
  ACCOUNT_LOCKED: Block,
  PERMISSION_DENIED: Warning,
  TOKEN_REFRESH: Refresh,
  SESSION_EXPIRED: Warning,
  LOGOUT: Logout,
  TENANT_ACCESS: Business,
  SUSPICIOUS_ACTIVITY: Security,
};

const SecurityAuditLog: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState(7); // days
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        event =>
          event.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.ipAddress.includes(searchTerm) ||
          event.tenantName?.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Date range filter
    const now = new Date();
    const startDate = subDays(now, dateRange);
    filtered = filtered.filter(event =>
      isWithinInterval(event.timestamp, { start: startDate, end: now })
    );

    setFilteredEvents(filtered);
    setPage(0); // Reset to first page when filters change
  }, [events, searchTerm, severityFilter, eventTypeFilter, dateRange]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleViewDetails = (event: SecurityEvent) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  const handleExport = () => {
    // Export functionality
    const csvContent = [
      'Timestamp,Event Type,Severity,User Email,IP Address,Location,Details',
      ...filteredEvents.map(
        event =>
          `${format(event.timestamp, 'yyyy-MM-dd HH:mm:ss')},${event.eventType},${event.severity},${event.userEmail || 'N/A'},${event.ipAddress},${event.location || 'Unknown'},${event.details.replace(/,/g, ';')}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSeverityIcon = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <Error color="error" />;
      case 'HIGH':
        return <Warning color="error" />;
      case 'MEDIUM':
        return <Info color="warning" />;
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
          Security Audit Log
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor and track all security-related events across the platform
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
                    Critical Events
                  </Typography>
                  <Typography variant="h4">
                    {filteredEvents.filter(e => e.severity === 'CRITICAL').length}
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
                <Error color="warning" sx={{ fontSize: 40 }} />
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
                    Suspicious Activity
                  </Typography>
                  <Typography variant="h4">
                    {filteredEvents.filter(e => e.eventType === 'SUSPICIOUS_ACTIVITY').length}
                  </Typography>
                </Box>
                <Warning color="error" sx={{ fontSize: 40 }} />
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
            Filters
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by email, IP, details..."
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
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={eventTypeFilter}
                  label="Event Type"
                  onChange={e => setEventTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.keys(eventTypeColors).map(type => (
                    <MenuItem key={type} value={type}>
                      {type
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, l => l.toUpperCase())}
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

            <Grid item xs={12} md={2}>
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
                <TableCell>Location</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(event => {
                  const EventIcon = eventTypeIcons[event.eventType];
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
                          icon={<EventIcon />}
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
                        {event.userEmail ? (
                          <Box>
                            <Typography variant="body2">{event.userEmail}</Typography>
                            {event.userRole && (
                              <Typography variant="caption" color="text.secondary">
                                {event.userRole}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Unknown
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {event.ipAddress}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{event.location || 'Unknown'}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {event.details}
                        </Typography>
                        {event.tenantName && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Tenant: {event.tenantName}
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

                {selectedEvent.userEmail && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        User Email
                      </Typography>
                      <Typography variant="body2">{selectedEvent.userEmail}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        User Role
                      </Typography>
                      <Typography variant="body2">{selectedEvent.userRole || 'Unknown'}</Typography>
                    </Grid>
                  </>
                )}

                {selectedEvent.tenantName && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Tenant
                      </Typography>
                      <Typography variant="body2">{selectedEvent.tenantName}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Tenant ID
                      </Typography>
                      <Typography variant="body2" fontFamily="monospace">
                        {selectedEvent.tenantId}
                      </Typography>
                    </Grid>
                  </>
                )}

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

export default SecurityAuditLog;
