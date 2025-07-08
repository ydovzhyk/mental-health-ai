// 'use client';

// import Image from 'next/image';
// import { useEffect, useRef, useState } from 'react';
// import { useChat } from 'ai/react';
// import ReactMarkdown from 'react-markdown';
// import avatar from '@/images/ai-avatar02.png';
// import { useTranslate } from '@/utils/translating/translating';
// import Text from '../shared/text/text';
// import { FiX } from 'react-icons/fi';
// import { PiBroomLight } from 'react-icons/pi';
// import { TiMessages } from 'react-icons/ti';

// const ChatWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const chatContainerRef = useRef(null);
//   const translatedPlaceholder = useTranslate('Type your message...');
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     let storedId = localStorage.getItem('mental_health_chat_user_id');
//     if (!storedId) {
//       const randomPart = Math.random().toString(36).substring(2, 8);
//       storedId = `${Date.now()}_${randomPart}`;
//       localStorage.setItem('mental_health_chat_user_id', storedId);
//     }
//     setUserId(storedId);
//   }, []);

//   const {
//     messages,
//     input,
//     handleInputChange,
//     handleSubmit,
//     isLoading,
//     setMessages,
//   } = useChat({
//     api: '/api/agent-ai-stream',
//     body: {
//       user_id: userId,
//     },
//     onError: error => {
//       console.error('Chat error:', error);
//     },
//   });

//   const toggleChat = () => {
//     if (!isOpen && messages.length === 0) {
//       setMessages([
//         {
//           id: 'initial',
//           role: 'assistant',
//           content:
//             'Hi! How are you feeling today? What would you like to talk about?',
//         },
//       ]);
//     }
//     setIsOpen(prev => !prev);
//   };

//   const handleKeyDown = e => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   const clearChat = () => {
//     setMessages([]);
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <>
//       <button
//         onClick={toggleChat}
//         className={`fixed bottom-32 right-6 z-50 flex items-center justify-center rounded-full bg-[#00B2DF] p-4 text-white shadow-xl hover:bg-[#00A5CC] transition ${
//           isOpen ? '' : 'animate-pulse'
//         }`}
//       >
//         <div className={`relative ${!isOpen ? 'animate-shakeCustom' : ''}`}>
//           {isOpen ? <FiX size={24} /> : <TiMessages size={24} />}
//         </div>
//       </button>

//       {isOpen && (
//         <div className="fixed bottom-0 sm:bottom-8 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 sm:right-24 z-100 w-[90%] sm:w-[350px] rounded-xl border border-neutral-200 p-4 shadow-xl bg-white text-[#333]">
//           <div className="flex flex-row justify-between items-stretch gap-2 mb-4">
//             <div className="flex flex-row items-center gap-3 w-[80%] rounded-xl border border-neutral-200 pl-[10px] pr-[10px] py-1 shadow-sm">
//               <Image src={avatar} alt="bot avatar" width={38} height={38} />
//               <Text
//                 type="small"
//                 as="p"
//                 fontWeight="normal"
//                 className="text-gray-600"
//               >
//                 I'm here for you!
//               </Text>
//             </div>
//             <button
//               onClick={clearChat}
//               className="flex flex-row items-center justify-center w-[20%] rounded-xl border border-neutral-200 shadow-sm text-gray-500 hover:text-[#00B2DF] transition"
//             >
//               <PiBroomLight size={22} />
//             </button>
//           </div>

//           <div className="h-[390px] sm:h-[50vh] flex flex-col">
//             <div
//               ref={chatContainerRef}
//               className="flex flex-col flex-1 overflow-y-auto pr-2 text-sm mb-2 space-y-3 custom-scroll"
//             >
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`flex flex-col ${
//                     msg.role === 'user' ? 'items-end' : 'items-start'
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[92%] p-3 rounded-lg break-words ${
//                       msg.role === 'user'
//                         ? 'bg-[#E6F7FB] text-[#333]'
//                         : 'bg-white text-[#333] border border-neutral-200 shadow-sm'
//                     }`}
//                   >
//                     <ReactMarkdown>
//                       {msg.content.replace(/\[TOOL: SAVE_HISTORY\]/gi, '')}
//                     </ReactMarkdown>
//                   </div>
//                   <div className="text-xs text-gray-400 mt-1">
//                     {msg.role === 'user' ? 'You' : 'Assistant'}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative w-full">
//             <textarea
//               value={input}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               placeholder={translatedPlaceholder}
//               rows={1}
//               disabled={isLoading}
//               className="w-full min-h-[40px] bg-[#F9FAFB] rounded-md border border-neutral-200 px-3 py-2 pr-10 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B2DF] custom-scroll"
//             />
//           </div>
//           <button
//             onClick={handleSubmit}
//             disabled={!input.trim() || isLoading}
//             className="mt-3 w-full rounded-md bg-[#00B2DF] hover:bg-[#00A5CC] py-2 px-4 text-white text-sm transition"
//           >
//             <Text />
//             Send
//           </button>
//         </div>
//       )}

//       <style jsx>{`
//         .custom-scroll::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: #00b2df;
//           border-radius: 10px;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.05);
//           }
//         }

//         .animate-pulse {
//           animation: pulse 2s infinite;
//         }

//         @keyframes shakeCustom {
//           0%,
//           100% {
//             transform: rotate(0);
//           }
//           25% {
//             transform: rotate(5deg);
//           }
//           75% {
//             transform: rotate(-5deg);
//           }
//         }

//         .animate-shakeCustom {
//           animation: shakeCustom 1.2s infinite;
//         }
//       `}</style>
//     </>
//   );
// };

// export default ChatWidget;

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import avatar from '@/images/ai-avatar02.png';
import { useTranslate } from '@/utils/translating/translating';
import Text from '../shared/text/text';
import { FiX } from 'react-icons/fi';
import { PiBroomLight } from 'react-icons/pi';
import { TiMessages } from 'react-icons/ti';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const translatedPlaceholder = useTranslate('Type your message...');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    let storedId = localStorage.getItem('mental_health_chat_user_id');
    if (!storedId) {
      const randomPart = Math.random().toString(36).substring(2, 8);
      storedId = `${Date.now()}_${randomPart}`;
      localStorage.setItem('mental_health_chat_user_id', storedId);
    }
    setUserId(storedId);
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append,
  } = useChat({
    api: '/api/agent-ai-stream',
    body: {
      user_id: userId,
    },
    onError: error => {
      console.error('Chat error:', error);
    },
  });

  const toggleChat = () => {
    if (!isOpen) {
      if (messages.length === 0) {
        append(
          {
            role: 'system',
            content: '',
          },
          {
            body: {
              user_id: userId,
              initial_greet: true,
            },
          }
        );
      }

      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }

    setIsOpen(prev => !prev);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-32 right-6 z-50 flex items-center justify-center rounded-full bg-[#00B2DF] p-4 text-white shadow-xl hover:bg-[#00A5CC] transition ${
          isOpen ? '' : 'animate-pulse'
        }`}
      >
        <div className={`relative ${!isOpen ? 'animate-shakeCustom' : ''}`}>
          {isOpen ? <FiX size={24} /> : <TiMessages size={24} />}
        </div>
      </button>

      {isOpen && (
        <div className="fixed bottom-0 sm:bottom-8 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 sm:right-24 z-100 w-[90%] sm:w-[350px] rounded-xl border border-neutral-200 p-4 shadow-xl bg-white text-[#333]">
          <div className="flex flex-row justify-between items-stretch gap-2 mb-4">
            <div className="flex flex-row items-center gap-3 w-[80%] rounded-xl border border-neutral-200 pl-[10px] pr-[10px] py-1 shadow-sm">
              <Image src={avatar} alt="bot avatar" width={38} height={38} />
              <Text
                type="small"
                as="p"
                fontWeight="normal"
                className="text-gray-600"
              >
                I'm here for you!
              </Text>
            </div>
            <button
              onClick={clearChat}
              className="flex flex-row items-center justify-center w-[20%] rounded-xl border border-neutral-200 shadow-sm text-gray-500 hover:text-[#00B2DF] transition"
            >
              <PiBroomLight size={22} />
            </button>
          </div>

          <div className="h-[390px] sm:h-[50vh] flex flex-col">
            <div
              ref={chatContainerRef}
              className="flex flex-col flex-1 overflow-y-auto pr-2 text-sm mb-2 space-y-3 custom-scroll"
            >
              {messages
                .filter(msg => msg.content.trim() !== '')
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[92%] p-3 rounded-lg break-words ${
                        msg.role === 'user'
                          ? 'bg-[#E6F7FB] text-[#333]'
                          : 'bg-white text-[#333] border border-neutral-200 shadow-sm'
                      }`}
                    >
                      <ReactMarkdown>
                        {msg.content.replace(/\[TOOL: SAVE_HISTORY\]/gi, '')}
                      </ReactMarkdown>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="relative w-full">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={translatedPlaceholder}
              rows={1}
              disabled={isLoading}
              className="w-full min-h-[40px] bg-[#F9FAFB] rounded-md border border-neutral-200 px-3 py-2 pr-10 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B2DF] custom-scroll"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="mt-3 w-full rounded-md bg-[#00B2DF] hover:bg-[#00A5CC] py-2 px-4 text-white text-sm transition"
          >
            <Text type="tiny" as="span" className="ml-1">
              Send
            </Text>
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #00b2df;
          border-radius: 10px;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes shakeCustom {
          0%,
          100% {
            transform: rotate(0);
          }
          25% {
            transform: rotate(5deg);
          }
          75% {
            transform: rotate(-5deg);
          }
        }
        .animate-shakeCustom {
          animation: shakeCustom 1.2s infinite;
        }
      `}</style>
    </>
  );
};

export default ChatWidget;

