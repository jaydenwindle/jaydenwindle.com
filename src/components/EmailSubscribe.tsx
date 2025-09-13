import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface EmailFormData {
  email: string;
}

const DOLLAR_SYMBOL_WIDTH = 20;
const CURSOR_UPDATE_DELAY = 3000;

const EmailSubscribe: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setError,
    clearErrors
  } = useForm<EmailFormData>();

  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized cursor position update function
  const updateCursorPosition = useCallback(() => {
    if (!inputRef.current) return;

    const span = document.createElement('span');
    const inputStyles = window.getComputedStyle(inputRef.current);

    Object.assign(span.style, {
      font: inputStyles.font,
      visibility: 'hidden',
      position: 'absolute'
    });

    span.textContent = inputRef.current.value;
    document.body.appendChild(span);

    const textWidth = span.offsetWidth;
    document.body.removeChild(span);

    setCursorPosition(DOLLAR_SYMBOL_WIDTH + textWidth);
  }, []);

  // Initialize cursor position
  useEffect(() => {
    updateCursorPosition();
  }, [updateCursorPosition]);

  // Form submission handler
  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    clearErrors();

    try {
      const formData = new FormData();
      formData.append('email', data.email);

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const result = await response.json();
        setError('root.serverError', {
          type: 'server',
          message: result.error || 'something went wrong, please try again'
        });
        return;
      }

      reset();
      setTimeout(updateCursorPosition, CURSOR_UPDATE_DELAY);
    } catch {
      setError('root.serverError', {
        type: 'server',
        message: 'something went wrong, please try again'
      });
    }
  };

  // Input change handler with debounced cursor update
  const handleInputChange = useCallback(() => {
    setTimeout(updateCursorPosition, 0);
  }, [updateCursorPosition]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isSubmitting && !isSubmitSuccessful) {
        handleSubmit(onSubmit)();
      }
    }
  }, [isSubmitting, isSubmitSuccessful, handleSubmit, onSubmit]);

  // Computed values
  const isDisabled = isSubmitting || isSubmitSuccessful;
  const hasError = !!(errors.email || errors.root?.serverError);
  const messageText = errors.email?.message ||
    errors.root?.serverError?.message ||
    (isSubmitSuccessful ? 'thanks! see you on the interwebs :)' : 'no spam, unsubscribe anytime');

  // Button text logic
  const getButtonText = () => {
    if (isSubmitting) {
      return (
        <span>
          sending
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </span>
      );
    }
    return isSubmitSuccessful ? 'subscribed!' : '[subscribe]';
  };


  return (
    <>
      <style>{`
        .terminal-input {
          caret-color: transparent;
        }
        
        .cursor-block {
          position: absolute;
          width: 0.5em;
          height: 1.2em;
          background-color: #f5f5f5;
          animation: blink 1s infinite;
          pointer-events: none;
          top: 50%;
          transform: translateY(-50%);
          display: none;
        }
        
        .cursor-block.visible {
          display: block;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .loading-dots span {
          animation: loading-dot 1.4s infinite;
        }
        
        .loading-dots span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes loading-dot {
          0%, 20% { opacity: 0.3; }
          50% { opacity: 1; }
          80%, 100% { opacity: 0.3; }
        }
      `}</style>

      <section>
        <h1 className="font-mono text-neutral-100 text-xl mb-4">
          <span className="text-neutral-600">#</span> subscribe
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
          <div className="flex justify-between items-center mb-4">
            {/* Input container with terminal cursor */}
            <div className="flex-1 flex items-center relative">
              <span className="font-mono text-neutral-600 mr-2">$</span>

              <input
                {...register('email', {
                  required: 'please enter a valid email address',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'that email is invalid, try again'
                  },
                  onChange: handleInputChange
                })}
                type="email"
                placeholder="your@email.com"
                className="flex-1 font-mono bg-transparent border-none text-neutral-100 focus:outline-none placeholder-neutral-600 terminal-input"
                ref={(e) => {
                  const { ref } = register('email');
                  ref(e);
                  inputRef.current = e;
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
              />

              {/* Terminal cursor */}
              <div
                className={`cursor-block ${isFocused ? 'visible' : ''}`}
                style={{ left: `${cursorPosition}px` }}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`font-mono px-1 ${isDisabled
                ? 'text-neutral-500'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer'
                }`}
            >
              {getButtonText()}
            </button>
          </div>

          {/* Status message */}
          <div className="font-mono text-xs">
            <span className={hasError ? 'text-red-400' : 'text-neutral-600'}>
              {messageText}
            </span>
          </div>
        </form>
      </section>
    </>
  );
};

export default EmailSubscribe;
