import type { fetcherLoginHistory } from "@/app/auth/auth-fetchers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { use } from "react";

export default function TabLoginHistory({
  loginHistory,
}: {
  loginHistory: ReturnType<typeof fetcherLoginHistory>;
}) {
  const items = use(loginHistory);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>IP</TableHead>
          <TableHead>Device</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.createdAt.toLocaleString()}</TableCell>
            <TableCell>{item.username}</TableCell>
            <TableCell>{item.action}</TableCell>
            <TableCell>{item.ip}</TableCell>
            <TableCell className="whitespace-normal">{item.ua}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
