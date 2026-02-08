import {
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
import { useEmployees } from "../hooks/useEmploye";

export default function EmployeeListPage() {
  const [firstNameInput, setFirstNameInput] = useState<string>("")
  const [lastNameInput, setLastNameInput] = useState<string>("")
  const [filters, setFilters] = useState<EmployeeFilters>({
    firstName: "",
    lastName: "",
  });
  const { employees, isLoading, error,} = useEmployees(filters);


  const handleExport = () => {
    const xml = employeesToXml(employees);
    downloadXml(xml, "employees.xml");
  };

  const renderFilters = ()=> {
    const isSearchDisabled = firstNameInput.trim() === "" && lastNameInput.trim() === "";
    const isResetDisabled = firstNameInput === "" && lastNameInput === "" && filters.firstName === "" && filters.lastName === "";
      
    return(
      <Paper sx={{ p: 2, mb: 3, mt: 2 }}>
        <TableRow sx={{ display: "flex", gap: 2 }}>
          <TableCell sx={{ flex: 1, borderBottom: "none" }}>
            <TextField
              fullWidth
              label="First name"
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
            />
          </TableCell>

          <TableCell sx={{ flex: 1, borderBottom: "none" }}>
            <TextField
              fullWidth
              label="Last name"
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Button
              disabled={isSearchDisabled }
              variant="contained"
              onClick={() =>
                setFilters({
                  firstName: firstNameInput,
                  lastName: lastNameInput,
                })
              }
            >
              Search
            </Button>
          </TableCell>
          <TableCell>
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
          </TableCell>
        </TableRow>
      </Paper>
  )}

    if (isLoading) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Loading...
      </Typography>
    );
  }


  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }



  if (employees.length === 0) {
    const hasActiveFilters = filters.firstName !== "" || filters.lastName !== "";
    return (
      <>
        {renderFilters()}

        <Typography
          sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}
        >
          {hasActiveFilters
            ? "No employees found with the selected filters."
            : "No employees available."}
        </Typography>
      </>
    );
  }

  return (
    <>
      {renderFilters()}

      <Button variant="contained" onClick={handleExport}>
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
            {employees.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.firstName} {row.lastName}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.department?.description ?? "-"}</TableCell>
              </TableRow>
            ))}
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