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
} from '@mui/icons-material';
import PermissionGate from '@shared/rbac/components/PermissionGate';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  grade: string;
  class: string;
  rollNumber: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@school.com',
    phone: '+1-555-0123',
    grade: 'Grade 8',
    class: '8A',
    rollNumber: '2024001',
    status: 'active',
    avatar: 'JS',
    admissionDate: '2024-01-15',
    parentName: 'Michael Smith',
    parentPhone: '+1-555-0124',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1-555-0125',
    grade: 'Grade 7',
    class: '7B',
    rollNumber: '2024002',
    status: 'active',
    avatar: 'SJ',
    admissionDate: '2024-01-16',
    parentName: 'David Johnson',
    parentPhone: '+1-555-0126',
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@school.com',
    phone: '+1-555-0127',
    grade: 'Grade 9',
    class: '9A',
    rollNumber: '2024003',
    status: 'inactive',
    avatar: 'MW',
    admissionDate: '2024-01-17',
    parentName: 'Robert Wilson',
    parentPhone: '+1-555-0128',
  },
];

const StudentList: React.FC = () => {
  // Deprecated mock-based component. Redirecting users to the new Students page.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'add'>('view');

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, student: Student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleDialogOpen = (type: 'view' | 'edit' | 'add') => {
    setDialogType(type);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      setStudents(students.filter(student => student.id !== selectedStudent.id));
    }
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.includes(searchTerm);
    const matchesGrade = !filterGrade || student.grade === filterGrade;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <PermissionGate resource="students" action="view">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Student Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen('add')}
          >
            Add Student
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search students..."
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
                  <MenuItem value="Grade 6">Grade 6</MenuItem>
                  <MenuItem value="Grade 7">Grade 7</MenuItem>
                  <MenuItem value="Grade 8">Grade 8</MenuItem>
                  <MenuItem value="Grade 9">Grade 9</MenuItem>
                  <MenuItem value="Grade 10">Grade 10</MenuItem>
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
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Student Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Grade & Class</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Admission Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {student.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{student.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{student.grade}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Class {student.class}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{student.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{student.parentName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.parentPhone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        color={getStatusColor(student.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{student.admissionDate}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, student)}
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
            count={filteredStudents.length}
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
          <MenuItem onClick={handleDeleteStudent}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Student Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogType === 'add' ? 'Add New Student' : 
             dialogType === 'edit' ? 'Edit Student' : 'Student Details'}
          </DialogTitle>
          <DialogContent>
            {selectedStudent && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    defaultValue={selectedStudent.name}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={selectedStudent.email}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    defaultValue={selectedStudent.phone}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Roll Number"
                    defaultValue={selectedStudent.rollNumber}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Grade</InputLabel>
                    <Select
                      defaultValue={selectedStudent.grade}
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
                    label="Class"
                    defaultValue={selectedStudent.class}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Parent Name"
                    defaultValue={selectedStudent.parentName}
                    disabled={dialogType === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Parent Phone"
                    defaultValue={selectedStudent.parentPhone}
                    disabled={dialogType === 'view'}
                  />
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
                {dialogType === 'add' ? 'Add Student' : 'Save Changes'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGate>
  );
};

export default StudentList;
