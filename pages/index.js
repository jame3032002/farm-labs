import * as yup from 'yup'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import NumberInput from '../components/NumberInput'
import { findTheBestForUnstake } from '../helpers'
import LogoPicture from '../public/process.jpeg'
import BestImage from '../public/best.png'

const schema = yup.object({
  cost: yup.number().positive('กรุณากรอกเงินลงทุนมากกว่า 0').required().typeError('กรุณากรอกเงินที่ลงทุน เป็นตัวเลขที่มากกว่า 0'),
  apr: yup.number().positive('กรุณากรอก APR% มากกว่า 0').required().typeError('กรุณากรอก APR% เป็นตัวเลขที่มากกว่า 0'),
  fee: yup.number().required().typeError('กรุณาระบุค่าธรรมเนียม'),
  days: yup.number().positive('จำนวนวันต้องมากกว่า 0 วัน').required().typeError('กรุณาระบุจำนวนวันที่ต้องการคำนวณ')
}).required()

function Home () {
  const [state, setState] = useState({
    show: false,
    days: null,
    money: null,
    experimentalResults: [],
    showTheBestDetail: false,
    showAllExperimental: false
  })

  const { handleSubmit, formState: { errors }, control, reset } = useForm({
    defaultValues: {
      cost: '',
      apr: '',
      fee: '',
      days: ''
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = ({ cost, apr, fee, days }) => {
    const { experimentalResults, theBestResult } = findTheBestForUnstake({
      cost: parseFloat(cost),
      apr: parseFloat(apr),
      fee: parseFloat(fee),
      days: parseFloat(days)
    })

    const { days: bestDayOfUnstake, money } = theBestResult

    setState({ show: true, days: bestDayOfUnstake, money, experimentalResults })
  }

  const tryToUseAgain = () => {
    reset({})
    setState({ ...state, show: false })
  }

  const editData = () => {
    setState({ ...state, show: false })
  }

  const toggleTheBestDetail = ({ open, days }) => {
    let newState = { ...state, showTheBestDetail: open }
    if (days) {
      const details = state.experimentalResults.find(d => d.days === days)
      newState = { ...newState, details }
    }

    setState(newState)
  }

  const toggleAllExperimental = (open) => {
    setState({ ...state, showAllExperimental: open })
  }

  return (
    <div className='min-h-screen bg-purple-400 flex justify-center items-center'>
      <div className='py-12 px-12 bg-white rounded-2xl shadow-xl relative overflow-hidden'>
        <div>
          <h1 className='text-3xl font-bold text-center mb-4'>Farm Labs</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <NumberInput name='cost' control={control} placeholder='เงินที่ลงทุน' error={errors.cost} />
            <NumberInput name='apr' control={control} placeholder='APR' error={errors.apr} />
            <NumberInput name='fee' control={control} placeholder='ค่าธรรมเนียมต่อครั้ง' error={errors.fee} />
            <NumberInput name='days' control={control} placeholder='จำนวนวันที่ต้องการคำนวณ' error={errors.days} />
          </div>

          <div className='text-center mt-6'>
            <button className='py-2 w-64 text-lg text-white bg-purple-500 hover:bg-purple-400 rounded-2xl shadow-xl'>
              คำนวณ
            </button>
          </div>
        </form>

        <div className={`absolute ${state.show ? 'top-0' : 'top-full'} left-0 w-full bg-white rounded-2xl transition-all duration-1000 h-full`}>
          <Image src={LogoPicture} alt='logo' className='rounded-t-2xl shadow-2xl object-cover' />

          <div className='bg-white shadow-2xl rounded-b-3xl pt-5'>
            <div className='grid grid-cols-2 w-9/12 m-auto bg-indigo-50 p-4 rounded-2xl'>
              <div className='col-span-2'>
                <p className='text-gray-500 text-md text-center'>Stake ทุก ๆ</p>
                <p className='text-gray-800 font-bold text-2xl text-center'>{state.days} วัน</p>
                <p className='text-gray-500 text-md mt-2 text-center'>ผลตอบแทนโดยประมาณ</p>
                <p className='text-gray-800 font-bold text-2xl text-center'>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(state.money)}
                </p>
              </div>

              <div className='pt-2 col-span-2 text-center'>
                <a onClick={toggleTheBestDetail.bind(this, { open: true, days: state.days })} className='text-indigo-700 text-sm hover:text-indigo-500 font-bold text-center cursor-pointer'>
                  แสดงรายละเอียด
                </a>
              </div>
            </div>

            <div className='text-center'>
              <button onClick={toggleAllExperimental.bind(this, true)} className='bg-blue-700 w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-indigo-500 rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700 text-sm'>
                แสดงรายละเอียดทั้งหมด
              </button>
            </div>

            <div className='text-center m-auto mt-4 w-full h-16 space-x-4'>
              <button className='text-gray-500 font-bold lg:text-sm hover:text-gray-900' onClick={editData}>
                กลับไปแก้ไขข้อมูล
              </button>

              <button className='text-gray-500 font-bold lg:text-sm hover:text-gray-900' onClick={tryToUseAgain}>
                เคลียร์ข้อมูล
              </button>
            </div>
          </div>
        </div>

        {
          state.experimentalResults &&
            <div className={`absolute ${state.showAllExperimental ? 'top-0' : 'top-full'} left-0 w-full bg-gray-50 rounded-2xl transition-all duration-1000 h-full`}>
              <div className='overflow-y-auto' style={{ height: '90%' }}>
                {
                  state.experimentalResults.map(data => {
                    return (
                      <div className='grid grid-cols-1 bg-indigo-50 p-4 rounded-2xl shadow-md m-4 relative' key={`all-${data.days}`}>
                        {
                          data.days.toString() === state.days.toString() &&
                            <div className='absolute top-3 right-4'>
                              <Image src={BestImage} alt='best selection' width='32' height='32' />
                            </div>
                        }

                        <div className='col-span-2'>
                          <p className='text-gray-500 text-md text-center'>Stake ทุก ๆ</p>
                          <p className='text-gray-800 font-bold text-2xl text-center'>{data.days} วัน</p>
                          <p className='text-gray-500 text-md mt-2 text-center'>ผลตอบแทนโดยประมาณ</p>
                          <p className='text-gray-800 font-bold text-2xl text-center'>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.money)}
                          </p>
                        </div>

                        <div className='pt-2 col-span-2 text-center'>
                          <a onClick={toggleTheBestDetail.bind(this, { open: true, days: data.days })} className='text-indigo-700 text-sm hover:text-indigo-500 font-bold text-center cursor-pointer'>
                            แสดงรายละเอียด
                          </a>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className='text-center m-auto p-4 w-full drop-shadow-md shadow-inner'>
                <button className='text-gray-500 font-bold lg:text-sm hover:text-gray-900' onClick={toggleAllExperimental.bind(this, false)}>
                  ย้อนกลับ
                </button>
              </div>
            </div>
        }

        {
          state.experimentalResults &&
            <div className={`absolute ${state.showTheBestDetail ? 'top-0' : 'top-full'} left-0 w-full bg-gray-50 rounded-2xl transition-all duration-1000 h-full`}>
              <div className='overflow-y-auto' style={{ height: '90%' }}>
                <table className='table text-gray-400 space-y-6 text-sm w-full'>
                  <thead className='bg-indigo-50 text-gray-500'>
                    <tr>
                      <th className='p-3 text-center font-thin text-xs' style={{ width: '10%' }}>วันที่</th>
                      <th className='p-3 text-center font-thin text-xs' style={{ width: '40%' }}>ยอดเงิน</th>
                      <th className='p-3 text-center font-light text-xs' style={{ width: '30%' }}>Pending Reward</th>
                      <th className='p-3 text-center font-light text-xs' style={{ width: '10%' }}>Fee</th>
                      <th className='p-3 text-center font-light text-xs' style={{ width: '10%' }}>Compound</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                    state?.details?.experimental.map(({ day, compounding, pendingReward, fee }) => {
                      return (
                        <tr key={day} className={fee < 0 ? 'bg-green-100' : ''}>
                          <td className='p-4 text-center text-xs font-light relative'>
                            {day}
                          </td>
                          <td className='p-1 text-center text-xs font-light'>{parseFloat(compounding).toFixed(2)}</td>
                          <td className='p-1 text-center text-xs font-light text-green-600'>{parseFloat(pendingReward).toFixed(2)}</td>
                          <td className={`p-1 text-center text-xs font-light ${fee < 0 && 'text-red-300'}`}>{fee}</td>
                          <td className='text-center'>
                            {
                              fee < 0 &&
                                <span className='bg-green-400 text-gray-50 rounded-md' style={{ fontSize: '0.6em', padding: '3px', paddingLeft: '4px', paddingRight: '4px' }}>
                                  Compound
                                </span>
                            }
                          </td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              </div>
              <div className='text-center m-auto p-4 w-full drop-shadow-md shadow-inner'>
                <button className='text-gray-500 font-bold lg:text-sm hover:text-gray-900' onClick={toggleTheBestDetail.bind(this, false)}>
                  ย้อนกลับ
                </button>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Home
