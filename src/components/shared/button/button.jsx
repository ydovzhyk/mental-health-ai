'use client';

import React from 'react';
import Text from '../text/text';
import Image from 'next/image';

const Button = ({
  text = '',
  type = 'submit',
  btnClass = 'btnDark',
  textColor = 'text-black',
  onClick,
  id = '',
  image = null,
  disabled = false,
  width = '170px',
}) => {
  const baseClasses =
    'flex items-center justify-center hover-transition group w-[150px] h-[40px] md:w-[170px] transition-shadow duration-300 hover:shadow-md';
  const btnDarkClasses = 'border border-[var(--accent)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)]';
  const btnDarkDarkClasses =
    'border border-[var(--accent)] bg-[var(--accent)] hover:bg-transparent hover:border-[var(--accent)]';
  const btnLightClasses =
    'regular-border bg-transparent hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white';
  const btnDisabledClasses =
    'bg-text-color border border-text-color text-main-color cursor-not-allowed';
  const btnHeaderClasses =
    'border border-solid border-black bg-transparent hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white';

  let buttonClasses = '';
  let textClasses = '';

  if (disabled) {
    buttonClasses = btnDisabledClasses;
  } else if (btnClass === 'btnDark') {
    buttonClasses = btnDarkClasses;
  } else if (btnClass === 'btnDarkDark') {
    buttonClasses = btnDarkDarkClasses;
  } else if (btnClass === 'btnLight') {
    buttonClasses = btnLightClasses;
    textClasses = 'text-black group-hover:text-white';
  } else if (btnClass === 'btnHeader') {
    buttonClasses = btnHeaderClasses;
    textClasses = 'text-black group-hover:text-white';
  }

  return (
    <button
      id={id}
      className={`${baseClasses} ${buttonClasses}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{ width, borderRadius: '5px' }}
    >
      <div className="flex flex-row items-center justify-center gap-2.5 mt-[-2px]">
        {image && (
          <Image
            src={image}
            alt="icon"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        )}
        {text && (
          <Text
            type="tiny"
            as="span"
            fontWeight="normal"
            lineHeight="none"
            className={`${textColor} hover-transition duration-300 ${textClasses} text-[16px]`}
          >
            {text}
          </Text>
        )}
      </div>
    </button>
  );
};

export default Button;
