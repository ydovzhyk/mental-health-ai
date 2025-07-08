import Text from '../text/text';

export default function FormInputFile({
  register,
  name,
  accept,
  multiple = false,
  onChange,
  label,
}) {
  const handleFileChange = event => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="relative inline-flex justify-center items-center w-[170px] h-[40px] rounded-[5px] border border-[var(--accent)] bg-[var(--accent)] text-white transition-all duration-300 hover:bg-transparent hover:text-[var(--accent)] hover:border-[var(--accent)] group cursor-pointer">
      <label
        htmlFor={name}
        className="flex justify-center items-center w-full h-full cursor-pointer"
      >
        <Text type="small" as="span" fontWeight="font-light" lineHeight="none">
          {label}
        </Text>
      </label>
      <input
        type="file"
        id={name}
        accept={accept}
        className="hidden"
        {...register(name)}
        multiple={multiple}
        onChange={handleFileChange}
      />
    </div>
  );
}
