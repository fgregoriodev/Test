import { useEffect, useState } from "react";
import { EmployeeApiResponse, EmployeeFilters } from "../models/employee";


export function useEmployees(filters: EmployeeFilters) {
  const [employees, setEmployees] = useState<EmployeeApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const params = new URLSearchParams();
    if (filters.firstName) params.append("FirstName", filters.firstName);
    if (filters.lastName) params.append("LastName", filters.lastName);

    fetch(`/api/employees/list?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data)=>setEmployees(data))
      .catch(() => setError("Unable to load employees"))
      .finally(() => setIsLoading(false));
  }, [filters]);

  return { employees, isLoading, error };
}
