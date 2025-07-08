'use client';

import { useSelector, useDispatch } from 'react-redux';
import { getAccessCode } from '@/redux/auth/auth-selectors';
import { setCopiedAccessCode } from '@/redux/technical/technical-slice';
import { clearMessageIncognito } from '@/redux/auth/auth-slice';
import Text from '@/components/shared/text/text';
import { TfiClose } from 'react-icons/tfi';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AccessCodeModal = () => {
  const dispatch = useDispatch();
  const accessCode = useSelector(getAccessCode);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      toast.success('Access code copied!');
      dispatch(setCopiedAccessCode(true));
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const closeModal = () => {
    dispatch(clearMessageIncognito());
    dispatch(setCopiedAccessCode(true));
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[360px] text-center">
        <button
          className="absolute top-[5px] right-[10px] w-[20px] h-[20px] flex items-center justify-center"
          onClick={closeModal}
        >
          <TfiClose color="var(--text-color)" size={15} />
        </button>

        <Text
          type="tiny"
          as="p"
          fontWeight="normal"
          className="text-center mb-4"
        >
          Save this access code to retain future access to your account.
        </Text>

        <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-gray-50">
          <span className="text-sm font-mono">{accessCode}</span>
          <button onClick={handleCopy}>
            {copied && (
              <Text
                type="tiny"
                as="span"
                fontWeight="normal"
                className="text-sm text-[#00f] hover:underline"
              >
                Copied
              </Text>
            )}
            {!copied && (
              <Text
                type="tiny"
                as="span"
                fontWeight="normal"
                className="text-sm text-[#00f] hover:underline"
              >
                Copy
              </Text>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeModal;
