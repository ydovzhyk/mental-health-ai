'use client';

import Text from '@/components/shared/text/text';

const RoleCheckbox = ({ value, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 cursor-pointer"
      />
      <Text type="tiny" as="span" fontWeight="normal">
        I am registering as a doctor
      </Text>
    </label>
  );
};

export default RoleCheckbox;
