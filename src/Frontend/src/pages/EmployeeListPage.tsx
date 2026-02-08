import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import {  useState } from "react";
import { downloadXml, employeesToXml } from "../utils/employeeXml";
import { EmployeeFilters } from "../models/employee";
import { useEmployees } from "../hooks/useEmployees";

export default function EmployeeListPage() {
  const [firstNameInput, setFirstNameInput] = useState<string>("")
  const [lastNameInput, setLastNameInput] = useState<string>("")
  const [filters, setFilters] = useState<EmployeeFilters>({
    firstName: "",
    lastName: "",
  });
  const { employees, isLoading, isFetching, error} = useEmployees(filters);


  const handleExport = () => {
    const xml = employeesToXml(employees);
    downloadXml(xml, "employees.xml");
  };

  const renderFilters = ()=> {
    const isSearchDisabled = firstNameInput.trim() === "" && lastNameInput.trim() === "";
    const isResetDisabled = firstNameInput === "" && lastNameInput === "" && filters.firstName === "" && filters.lastName === "";
      
    return(
      <Paper sx={{ p: 2, mb: 3, mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          <TextField
            disabled={isLoading || isFetching}
            fullWidth
            label="First name"
            value={firstNameInput}
            onChange={(e) => setFirstNameInput(e.target.value)}
          />
          <TextField
            disabled={isLoading || isFetching}
            fullWidth
            label="Last name"
            value={lastNameInput}
            onChange={(e) => setLastNameInput(e.target.value)}
          />
          <Button
            disabled={isSearchDisabled }
            variant="contained"
            onClick={() =>
              setFilters({
                firstName: firstNameInput.trim(),
                lastName: lastNameInput.trim(),
              })
            }
          >
            Search
          </Button>
          <Button
            variant="outlined"
            disabled={isResetDisabled  }
            onClick={() => {
              setFirstNameInput("");
              setLastNameInput("");
              setFilters({ firstName: "", lastName: "" });
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>
  )}

    if (isLoading) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Loading...
      </Typography>
    );
  }

  const hasActiveFilters = filters.firstName !== "" || filters.lastName !== "";
  const isExportDisabled = isLoading || isFetching || error !== null || employees.length === 0;

  return (
    <>
      {renderFilters()}

      {isFetching && (
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "text.secondary", textAlign: "right" }}
        >
          Updating results...
        </Typography>
      )}

      {(filters.firstName || filters.lastName) && (
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Active filters:
          {filters.firstName && ` First name = "${filters.firstName}"`}
          {filters.lastName && ` Last name = "${filters.lastName}"`}
        </Typography>
      )}

      <Button disabled={isExportDisabled} variant="contained" onClick={handleExport}>
        Export XML
      </Button>

      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Employees
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>Department</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="error">
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            ) :employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography
                    sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}
                  >
                    {hasActiveFilters
                      ? "No employees found with the selected filters."
                      : "No employees available."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.firstName} {row.lastName}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.department?.description ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>  
  );
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));