import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  School,
  Person,
  Email,
  Phone,
  Subject,
  Class,
} from '@mui/icons-material';
import PermissionGate from '@shared/rbac/components/PermissionGate';

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: number;
  status: 'active' | 'inactive' | 'on-leave';
  avatar: string;
  joinDate: string;
  classes: string[];
  salary: number;
}

const mockTeachers: Teacher[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1-555-0123',
    subject: 'Mathematics',
    qualification: 'Ph.D. Mathematics',
    experience: 8,
    status: 'active',
    avatar: 'SJ',
    joinDate: '2020-01-15',
    classes: ['8A', '8B', '9A'],
    salary: 65000,
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    email: 'michael.chen@school.com',
    phone: '+1-555-0124',
    subject: 'Physics',
    qualification: 'M.Sc. Physics',
    experience: 5,
    status: 'active',
    avatar: 'MC',
    joinDate: '2021-03-20',
    classes: ['9A', '9B', '10A'],
    salary: 58000,
  },
  {
    id: 3,
    name: 'Ms. Emily Davis',
    email: 'emily.davis@school.com',
    phone: '+1-555-0125',
    subject: 'English Literature',
    qualification: 'M.A. English',
    experience: 3,
    status: 'on-leave',
    avatar: 'ED',
    joinDate: '2022-08-10',
    classes: ['7A', '7B', '8A'],
    salary: 52000,
  },
];

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'add'>('view');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterSubject = (event: any) => {
    setFilterSubject(event.target.value);
    setPage(0);
  };

  const handleFilterStatus = (event: any) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, teacher: Teacher) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeacher(teacher);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeacher(null);
  };

  const handleDialogOpen = (type: 'view' | 'edit' | 'add') => {
    setDialogType(type);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTeacher(null);
  };

  const handleDeleteTeacher = () => {
    if (selectedTeacher) {
      setTeachers(teachers.filter(teacher => teacher.id !== selectedTeacher.id));
    }
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'on-leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || teacher.subject === filterSubject;
    const matchesStatus = !filterStatus || teacher.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const paginatedTeachers = filteredTeachers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const subjects = Array.from(new Set(teachers.map(teacher => teacher.subject)));

  return (
    <PermissionGate resource="teachers" action="view">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Teacher Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen('add')}
          >
            Add Teacher
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Teachers
                </Typography>
                <Typography variant="h4">
                  {teachers.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Teachers
                </Typography>
                <Typography variant="h4" color="success.main">
                  {teachers.filter(t => t.status === 'active').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  On Leave
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {teachers.filter(t => t.status === 'on-leave').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Experience
                </Typography>
                <Typography variant="h4" color="primary">
                  {Math.round(teachers.reduce((acc, t) => acc + t.experience, 0) / teachers.length)}y
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={filterSubject}
                  label="Subject"
                  onChange={handleFilterSubject}
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={handleFilterStatus}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on-leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Teacher Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Qualification</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Classes</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTeachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {teacher.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{teacher.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {teacher.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Subject sx={{ mr: 1, color: 'primary.main' }} />
                        {teacher.subject}
                      </Box>
                    </TableCell>
                    <TableCell>{teacher.qualification}</TableCell>
                    <TableCell>{teacher.experience} years</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {teacher.classes.map((cls, index) => (
                          <Chip
                            key={index}
                            label={cls}
                            size="small"
                            variant="outlined"
                            icon={<Class />}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={teacher.status.replace('-', ' ')}
                        color={getStatusColor(teacher.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{teacher.joinDate}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, teacher)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTeachers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleDialogOpen('view')}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleDialogOpen('edit')}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteTeacher}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Teacher Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogType === 'add' ? 'Add New Teacher' : 
             dialogType === 'edit' ? 'Edit Teacher' : 'Teacher Details'}
          </DialogTitle>
          <DialogContent>
            {selectedTeacher && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    defaultValue={selectedTeacher.name}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={selectedTeacher.email}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    defaultValue={selectedTeacher.phone}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    defaultValue={selectedTeacher.subject}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Qualification"
                    defaultValue={selectedTeacher.qualification}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Experience (years)"
                    type="number"
                    defaultValue={selectedTeacher.experience}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    type="number"
                    defaultValue={selectedTeacher.salary}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      defaultValue={selectedTeacher.status}
                      label="Status"
                      disabled={dialogType === 'view'}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="on-leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>
              {dialogType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {dialogType !== 'view' && (
              <Button variant="contained" onClick={handleDialogClose}>
                {dialogType === 'add' ? 'Add Teacher' : 'Save Changes'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGate>
  );
};

export default TeacherList;
