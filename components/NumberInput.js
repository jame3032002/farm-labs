import React from 'react'
import { Controller } from 'react-hook-form'

const numberFormat = /^[+-]?\d*(?:[.,]\d*)?$/
const NumberInput = (arg) => (
  <>
    <Controller
      {...arg}
      render={({ field }) => (
        <div className='flex flex-col space-y-2'>
          <label htmlFor={arg.name} className='text-gray-500 font-semibold text-sm'>
            {arg.placeholder}
          </label>
          <input
            {...field}
            className='block text-sm py-3 px-4 rounded-lg w-full border outline-none'
            placeholder={arg.placeholder}
            onChange={(e) =>
              field.onChange(
                numberFormat.test(e.target.value)
                  ? e.target.value
                  : Number.isNaN(parseFloat(e.target.value))
                    ? ''
                    : parseFloat(e.target.value)
              )}
          />
        </div>
      )}
    />
    {
      arg?.error?.message && <span className='text-xs text-red-400'>* {arg.error.message}</span>
    }
  </>
)

export default NumberInput
