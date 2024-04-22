import { SegmentedControl as RadixSegmentedControl } from '@radix-ui/themes';
import { ComponentProps } from 'react';

export type SegmentedControlProps = {
  options: { value: string; label: string }[];
} & ComponentProps<typeof RadixSegmentedControl.Root>;

function SegmentedControl({ options, ...rest }: SegmentedControlProps) {
  return (
    <RadixSegmentedControl.Root {...rest}>
      {options.map((option) => (
        <RadixSegmentedControl.Item key={option.value} value={option.value}>
          {option.label}
        </RadixSegmentedControl.Item>
      ))}
    </RadixSegmentedControl.Root>
  );
}

export default SegmentedControl;
