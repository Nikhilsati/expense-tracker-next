import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseTypes } from "@/lib/utils";

export const ExpenseSelector = React.forwardRef(
  ({ placeholder, ...otherProps }: any, ref: any) => {
    return (
      <Select
        {...otherProps}
        onValueChange={otherProps.onChange}
        defaultValue={otherProps.value}
        ref={ref}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Expense Type</SelectLabel>
            {expenseTypes.map((item) => (
              <SelectItem value={item} key={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

ExpenseSelector.displayName = "ExpenseSelector";
