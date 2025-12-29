'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLES, getRoleLabel } from '@/lib/permissions';

export default function RoleSelector({ value, onChange, disabled }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ROLES.ADMIN}>{getRoleLabel(ROLES.ADMIN)}</SelectItem>
        <SelectItem value={ROLES.MANAGER}>{getRoleLabel(ROLES.MANAGER)}</SelectItem>
        <SelectItem value={ROLES.SALES_REP}>{getRoleLabel(ROLES.SALES_REP)}</SelectItem>
        <SelectItem value={ROLES.VIEWER}>{getRoleLabel(ROLES.VIEWER)}</SelectItem>
      </SelectContent>
    </Select>
  );
}