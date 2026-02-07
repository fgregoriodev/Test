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
import { useEffect, useState } from "react";
import { downloadXml } from "../utils/filedownload";


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
    const [isLoading, setIsLoading] = useState(true)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")


    useEffect(()=>{
      const params = new URLSearchParams()

      if(firstName){
        params.append("FirstName", firstName);
      }

      if(lastName){
        params.append("LastName", lastName);
      }
      fetch(`/api/employees/list?${params.toString()}`)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setList(data)
        })
        .finally(()=>{
          setIsLoading(false)
        })
    },[firstName, lastName])


  if (isLoading) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Loading...
      </Typography>
    );
  }


  function employeesToXml(employees: EmployeeListQuery[]):string {
    const escape = (value:string) => 
      value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

    return `
    <Employees>
    ${employees
      .map((e)=>`
      <Employee>
        <Id>${e.id}</Id>
        <Code>${escape(e.code)}</Code>
        <FirstName>${escape(e.firstName)}</FirstName>
        <LastName>${escape(e.lastName)}</LastName>
        <Email>${escape(e.email)}</Email>
        <Phone>${escape(e.phone)}</Phone>
        <Address>${escape(e.address)}</Address>
        <Department>
          <Code>${escape(e.department?.code ?? "")}</Code>
          <Description>${escape(e.department?.description ?? "")}</Description>
        </Department>
      </Employee>`)
        .join("")}
    </Employees>`
    .trim();
  }

  const handleExport = () => {
    const xml = employeesToXml(list);
    downloadXml(xml, "employees.xml");
  };

  
  const filters = (
      <Paper sx={{ p: 2, mb: 3, mt: 2 }}>
      <TableRow sx={{ display: "flex", gap: 2 }}>
        <TableCell sx={{ flex: 1, borderBottom: "none" }}>
          <TextField
            fullWidth
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </TableCell>

        <TableCell sx={{ flex: 1, borderBottom: "none" }}>
          <TextField
            fullWidth
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </TableCell>
      </TableRow>
    </Paper>
  )

  return (
    <>
      {filters}

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