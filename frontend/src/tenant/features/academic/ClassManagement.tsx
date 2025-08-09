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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
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
  Group,
  Schedule,
  LocationOn,
} from '@mui/icons-material';
import PermissionGate from '@shared/rbac/components/PermissionGate';

interface Class {
  id: number;
  name: string;
  grade: string;
  section: string;
  teacher: string;
  teacherId: number;
  students: number;
  capacity: number;
  room: string;
  schedule: string;
  subjects: string[];
  status: 'active' | 'inactive';
}

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  avatar: string;
}

const mockClasses: Class[] = [
  {
    id: 1,
    name: 'Class 8A',
    grade: 'Grade 8',
    section: 'A',
    teacher: 'Dr. Sarah Johnson',
    teacherId: 1,
    students: 28,
    capacity: 30,
    room: 'Room 201',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
    subjects: ['Mathematics', 'Physics', 'English', 'History'],
    status: 'active',
  },
  {
    id: 2,
    name: 'Class 9B',
    grade: 'Grade 9',
    section: 'B',
    teacher: 'Prof. Michael Chen',
    teacherId: 2,
    students: 25,
    capacity: 30,
    room: 'Room 205',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    status: 'active',
  },
  {
    id: 3,
    name: 'Class 7A',
    grade: 'Grade 7',
    section: 'A',
    teacher: 'Ms. Emily Davis',
    teacherId: 3,
    students: 30,
    capacity: 30,
    room: 'Room 103',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
    subjects: ['English', 'Mathematics', 'Science', 'Social Studies'],
    status: 'active',
  },
];

const mockStudents: Student[] = [
  { id: 1, name: 'John Smith', rollNumber: '2024001', avatar: 'JS' },
  { id: 2, name: 'Sarah Johnson', rollNumber: '2024002', avatar: 'SJ' },
  { id: 3, name: 'Mike Wilson', rollNumber: '2024003', avatar: 'MW' },
  { id: 4, name: 'Emily Brown', rollNumber: '2024004', avatar: 'EB' },
];

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'add'>('view');
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterGrade = (event: any) => {
    setFilterGrade(event.target.value);
    setPage(0);
  };

  const handleFilterStatus = (event: any) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, classItem: Class) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClass(null);
  };

  const handleDialogOpen = (type: 'view' | 'edit' | 'add') => {
    setDialogType(type);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedClass(null);
  };

  const handleStudentsDialogOpen = () => {
    setOpenStudentsDialog(true);
    handleMenuClose();
  };

  const handleStudentsDialogClose = () => {
    setOpenStudentsDialog(false);
  };

  const handleDeleteClass = () => {
    if (selectedClass) {
      setClasses(classes.filter(classItem => classItem.id !== selectedClass.id));
    }
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getCapacityColor = (students: number, capacity: number) => {
    const percentage = (students / capacity) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !filterGrade || classItem.grade === filterGrade;
    const matchesStatus = !filterStatus || classItem.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const paginatedClasses = filteredClasses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const grades = Array.from(new Set(classes.map(classItem => classItem.grade)));

  return (
    <PermissionGate resource="classes" action="view">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Class Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen('add')}
          >
            Add Class
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Classes
                </Typography>
                <Typography variant="h4">
                  {classes.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Classes
                </Typography>
                <Typography variant="h4" color="success.main">
                  {classes.filter(c => c.status === 'active').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Students
                </Typography>
                <Typography variant="h4" color="primary">
                  {classes.reduce((acc, c) => acc + c.students, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Class Size
                </Typography>
                <Typography variant="h4" color="info.main">
                  {Math.round(classes.reduce((acc, c) => acc + c.students, 0) / classes.length)}
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
                placeholder="Search classes..."
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
                <InputLabel>Grade</InputLabel>
                <Select
                  value={filterGrade}
                  label="Grade"
                  onChange={handleFilterGrade}
                >
                  <MenuItem value="">All Grades</MenuItem>
                  {grades.map(grade => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
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
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Class Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Class</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Subjects</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedClasses.map((classItem) => (
                  <TableRow key={classItem.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{classItem.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {classItem.grade}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                        {classItem.teacher}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {classItem.students}/{classItem.capacity}
                        </Typography>
                        <Chip
                          label={`${Math.round((classItem.students / classItem.capacity) * 100)}%`}
                          size="small"
                          color={getCapacityColor(classItem.students, classItem.capacity) as any}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                        {classItem.room}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                        {classItem.schedule}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {classItem.subjects.slice(0, 2).map((subject, index) => (
                          <Chip
                            key={index}
                            label={subject}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {classItem.subjects.length > 2 && (
                          <Chip
                            label={`+${classItem.subjects.length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={classItem.status}
                        color={getStatusColor(classItem.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, classItem)}
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
            count={filteredClasses.length}
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
          <MenuItem onClick={handleStudentsDialogOpen}>
            <Group sx={{ mr: 1 }} />
            View Students
          </MenuItem>
          <MenuItem onClick={() => handleDialogOpen('edit')}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClass}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Class Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogType === 'add' ? 'Add New Class' : 
             dialogType === 'edit' ? 'Edit Class' : 'Class Details'}
          </DialogTitle>
          <DialogContent>
            {selectedClass && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Class Name"
                    defaultValue={selectedClass.name}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Grade</InputLabel>
                    <Select
                      defaultValue={selectedClass.grade}
                      label="Grade"
                      disabled={dialogType === 'view'}
                    >
                      <MenuItem value="Grade 6">Grade 6</MenuItem>
                      <MenuItem value="Grade 7">Grade 7</MenuItem>
                      <MenuItem value="Grade 8">Grade 8</MenuItem>
                      <MenuItem value="Grade 9">Grade 9</MenuItem>
                      <MenuItem value="Grade 10">Grade 10</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Section"
                    defaultValue={selectedClass.section}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Class Teacher"
                    defaultValue={selectedClass.teacher}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Room"
                    defaultValue={selectedClass.room}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    type="number"
                    defaultValue={selectedClass.capacity}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Schedule"
                    defaultValue={selectedClass.schedule}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      defaultValue={selectedClass.status}
                      label="Status"
                      disabled={dialogType === 'view'}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
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
                {dialogType === 'add' ? 'Add Class' : 'Save Changes'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Students Dialog */}
        <Dialog
          open={openStudentsDialog}
          onClose={handleStudentsDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Students in {selectedClass?.name}
          </DialogTitle>
          <DialogContent>
            <List>
              {mockStudents.map((student, index) => (
                <React.Fragment key={student.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {student.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name}
                      secondary={`Roll Number: ${student.rollNumber}`}
                    />
                  </ListItem>
                  {index < mockStudents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleStudentsDialogClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGate>
  );
};

export default ClassManagement;
