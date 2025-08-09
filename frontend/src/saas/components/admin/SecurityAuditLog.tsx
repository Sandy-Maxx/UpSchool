import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SecurityEvent {
  id: string;
  timestamp: string;
  event_type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'ACCOUNT_LOCKED' | 'SUSPICIOUS_ACTIVITY' | 'DATA_ACCESS' | 'PERMISSION_DENIED';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  username?: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  details: string;
  metadata?: {
    [key: string]: any;
  };
}

interface SecuritySummary {
  total_events: number;
  login_attempts_today: number;
  failed_logins_today: number;
  suspicious_activities: number;
  blocked_ips: number;
}

const eventTypeConfig = {
  LOGIN_ATTEMPT: { label: 'Login Attempt', icon: PersonIcon, color: 'primary' as const },
  LOGIN_SUCCESS: { label: 'Login Success', icon: CheckCircleIcon, color: 'success' as const },
  LOGIN_FAILED: { label: 'Login Failed', icon: ErrorIcon, color: 'error' as const },
  LOGOUT: { label: 'Logout', icon: PersonIcon, color: 'default' as const },
  PASSWORD_CHANGE: { label: 'Password Change', icon: SecurityIcon, color: 'warning' as const },
  ACCOUNT_LOCKED: { label: 'Account Locked', icon: ErrorIcon, color: 'error' as const },
  SUSPICIOUS_ACTIVITY: { label: 'Suspicious Activity', icon: WarningIcon, color: 'error' as const },
  DATA_ACCESS: { label: 'Data Access', icon: VisibilityIcon, color: 'info' as const },
  PERMISSION_DENIED: { label: 'Permission Denied', icon: ErrorIcon, color: 'warning' as const },
};

const severityConfig = {
  low: { label: 'Low', color: 'success' as const },
  medium: { label: 'Medium', color: 'warning' as const },
  high: { label: 'High', color: 'error' as const },
  critical: { label: 'Critical', color: 'error' as const },
};

export const SecurityAuditLog: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [summary, setSummary] = useState<SecuritySummary>({
    total_events: 0,
    login_attempts_today: 0,
    failed_logins_today: 0,
    suspicious_activities: 0,
    blocked_ips: 0,
  });

  // Pagination and filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Detail dialog
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Generate mock security events
  const generateMockEvents = (): SecurityEvent[] => {
    const mockEvents: SecurityEvent[] = [];
    const eventTypes = Object.keys(eventTypeConfig) as (keyof typeof eventTypeConfig)[];
    const severities: SecurityEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
    const mockIps = ['192.168.1.100', '10.0.0.50', '203.45.67.89', '172.16.0.1'];
    const mockUsers = ['admin@upschool.com', 'superadmin@upschool.com', 'system@upschool.com'];
    
    for (let i = 0; i < 100; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const ip = mockIps[Math.floor(Math.random() * mockIps.length)];
      const user = Math.random() > 0.3 ? mockUsers[Math.floor(Math.random() * mockUsers.length)] : undefined;
      
      const event: SecurityEvent = {
        id: `event_${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        event_type: eventType,
        severity,
        user_id: user ? `user_${Math.floor(Math.random() * 1000)}` : undefined,
        username: user,
        ip_address: ip,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia'][Math.floor(Math.random() * 4)],
        details: getEventDetails(eventType, user, ip),
        metadata: {
          session_id: `session_${Math.random().toString(36).substr(2, 9)}`,
          device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
        },
      };
      
      mockEvents.push(event);
    }
    
    return mockEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getEventDetails = (eventType: string, user?: string, ip?: string): string => {
    switch (eventType) {
      case 'LOGIN_ATTEMPT':
        return `Login attempt from ${user || 'unknown user'} at IP ${ip}`;
      case 'LOGIN_SUCCESS':
        return `Successful login by ${user || 'unknown user'} from ${ip}`;
      case 'LOGIN_FAILED':
        return `Failed login attempt for ${user || 'unknown user'} from ${ip}`;
      case 'LOGOUT':
        return `User ${user || 'unknown'} logged out`;
      case 'PASSWORD_CHANGE':
        return `Password changed for user ${user || 'unknown'}`;
      case 'ACCOUNT_LOCKED':
        return `Account locked for user ${user || 'unknown'} due to multiple failed attempts`;
      case 'SUSPICIOUS_ACTIVITY':
        return `Suspicious activity detected from IP ${ip} - multiple failed login attempts`;
      case 'DATA_ACCESS':
        return `Sensitive data accessed by ${user || 'unknown user'}`;
      case 'PERMISSION_DENIED':
        return `Access denied for ${user || 'unknown user'} attempting to access restricted resource`;
      default:
        return 'Security event occurred';
    }
  };

  // Load security events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockEvents = generateMockEvents();
        setEvents(mockEvents);
        
        // Calculate summary
        const today = new Date().toDateString();
        const todayEvents = mockEvents.filter(event => 
          new Date(event.timestamp).toDateString() === today
        );
        
        setSummary({
          total_events: mockEvents.length,
          login_attempts_today: todayEvents.filter(e => e.event_type === 'LOGIN_ATTEMPT').length,
          failed_logins_today: todayEvents.filter(e => e.event_type === 'LOGIN_FAILED').length,
          suspicious_activities: mockEvents.filter(e => e.event_type === 'SUSPICIOUS_ACTIVITY').length,
          blocked_ips: 3, // Mock value
        });
        
      } catch (error) {
        console.error('Failed to load security events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.ip_address.includes(searchQuery) ||
      event.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEventType = eventTypeFilter === 'all' || event.event_type === eventTypeFilter;
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    
    return matchesSearch && matchesEventType && matchesSeverity;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEventClick = (event: SecurityEvent) => {
    setSelectedEvent(event);
    setDetailDialogOpen(true);
  };

  const handleExport = () => {
    // In a real implementation, this would export to CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,Event Type,Severity,Username,IP Address,Details\n" +
      filteredEvents.map(event => 
        `"${event.timestamp}","${event.event_type}","${event.severity}","${event.username || 'N/A'}","${event.ip_address}","${event.details}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventIcon = (eventType: SecurityEvent['event_type']) => {
    const config = eventTypeConfig[eventType];
    const IconComponent = config.icon;
    return <IconComponent fontSize="small" />;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon fontSize="large" color="primary" />
            Security Audit Log
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and track all security events across the platform
          </Typography>
        </Box>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <SecurityIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {summary.total_events}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Events
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <PersonIcon color="info" fontSize="large" />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {summary.login_attempts_today}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Login Attempts Today
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ErrorIcon color="error" fontSize="large" />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {summary.failed_logins_today}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Failed Logins Today
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <WarningIcon color="warning" fontSize="large" />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {summary.suspicious_activities}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Suspicious Activities
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <LocationIcon color="error" fontSize="large" />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {summary.blocked_ips}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Blocked IPs
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by username, IP, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Event Type"
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  {Object.entries(eventTypeConfig).map(([type, config]) => (
                    <MenuItem key={type} value={type}>
                      {config.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Severity"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <MenuItem value="all">All Severities</MenuItem>
                  {Object.entries(severityConfig).map(([severity, config]) => (
                    <MenuItem key={severity} value={severity}>
                      {config.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                  >
                    Export CSV
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Events Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader
            title="Security Events"
            subheader={`${filteredEvents.length} events found`}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      Loading security events...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((event) => (
                      <TableRow key={event.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatTimestamp(event.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getEventIcon(event.event_type)}
                            label={eventTypeConfig[event.event_type].label}
                            color={eventTypeConfig[event.event_type].color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={severityConfig[event.severity].label}
                            color={severityConfig[event.severity].color}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {event.username || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {event.ip_address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {event.location || 'Unknown'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                            {event.details}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleEventClick(event)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredEvents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </motion.div>

      {/* Event Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Security Event Details
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Event ID
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {selectedEvent.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Timestamp
                  </Typography>
                  <Typography variant="body1">
                    {formatTimestamp(selectedEvent.timestamp)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Event Type
                  </Typography>
                  <Chip
                    icon={getEventIcon(selectedEvent.event_type)}
                    label={eventTypeConfig[selectedEvent.event_type].label}
                    color={eventTypeConfig[selectedEvent.event_type].color}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Severity
                  </Typography>
                  <Chip
                    label={severityConfig[selectedEvent.severity].label}
                    color={severityConfig[selectedEvent.severity].color}
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.username || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    IP Address
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {selectedEvent.ip_address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.location || 'Unknown'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User Agent
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {selectedEvent.user_agent}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Details
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.details}
                  </Typography>
                </Grid>
                {selectedEvent.metadata && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Metadata
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" component="pre" fontFamily="monospace">
                        {JSON.stringify(selectedEvent.metadata, null, 2)}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SecurityAuditLog;
