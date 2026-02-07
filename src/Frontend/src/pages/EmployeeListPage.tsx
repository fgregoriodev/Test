import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useEffect, useState } from "react";


interface EmployeeListQuery {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  code: string;
  department: {
    code: string;
    description: string;
  } | null;
}

export default function EmployeeListPage() {
    const [list, setList] = useState<EmployeeListQuery[]>([])

    useEffect(()=>{
      fetch("/api/employees/list")
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
          console.log(data)
            setList(data)
        })
    },[])

return (
  <>
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
          {list.map((row) => (
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