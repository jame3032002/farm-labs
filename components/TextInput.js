import React from 'react'

const TextInput = React.forwardRef((props, ref) => {
  return (
    <>
      <input
        ref={ref}
        type='text'
        className='block text-sm py-3 px-4 rounded-lg w-full border outline-none'
        {...props}
      />
      {
        props?.error?.message && <span className='text-xs text-red-400'>* {props.error.message}</span>
      }
    </>
  )
})

TextInput.displayName = 'TextInput'

export default TextInput
