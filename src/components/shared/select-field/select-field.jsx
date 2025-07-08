import Select from 'react-select';
import Text from '../text/text';

const SelectField = ({
  name,
  value,
  handleChange,
  placeholder,
  required,
  options,
  defaultValue,
  width,
  showLabelWithValue = false,
  topPlaceholder = false,
  textAlign = 'center',
}) => {
  const customStyles = {
    container: provided => ({
      ...provided,
      width: width,
    }),
    control: (provided, state) => ({
      ...provided,
      outline: 'none',
      cursor: 'pointer',
      height: '40px',
      backgroundColor: 'transparent',
      borderColor: state.isFocused
        ? provided.borderColor
        : 'var(--accent-background)',
      boxShadow: state.isFocused ? 'var(--accent-background)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': { borderColor: 'var(--accent-background)' },
    }),
    singleValue: provided => ({
      ...provided,
      paddingTop: '0px',
      textAlign: textAlign,
      color: 'black',
    }),
    input: provided => ({
      ...provided,
      padding: '0px',
      marginTop: '0px',
      fontSize: '16px',
      textAlign: textAlign,
      color: 'black',
      backgroundColor: 'transparent',
    }),
    placeholder: provided => ({
      ...provided,
      fontSize: '16px',
      textAlign: textAlign,
      color: 'black',
      marginTop: '2px',
      backgroundColor: 'transparent',
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: 'black',
      '&:hover': {
        color: 'gray',
      },
    }),

    indicatorSeparator: provided => ({
      ...provided,
      backgroundColor: 'black',
    }),
  };

  const valueId = `select-${name}`;
  const dynamicValue = textAlign === 'center' ? 'center' : 'flex-start';

  return (
    <label className="relative w-full flex flex-col items-center gap-[0px]">
      {topPlaceholder && (
        <div
          className="absolute top-[-23px] left-0 w-full flex items-center"
          style={{ justifyContent: dynamicValue }}
        >
          <Text
            type="small"
            as="span"
            fontWeight="normal"
            className={topPlaceholder ? 'text-white' : 'text-black'}
          >
            {placeholder}
          </Text>
        </div>
      )}
      <Select
        id={valueId}
        instanceId={valueId}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        options={options}
        styles={customStyles}
        defaultValue={defaultValue}
        formatOptionLabel={option =>
          showLabelWithValue
            ? `${option.value} - ${option.label}`
            : option.label
        }
        theme={theme => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary: 'var(--accent-background)',
          },
        })}
      />
    </label>
  );
};

export default SelectField