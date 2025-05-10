import React from 'react'
import EmptyImage from './EmptyImage'

const LoadingPage: React.FC = () => {
  return (
    <div className='flex justify-center items-center w-full h-full'>
      <div className='flex flex-col justify-center items-center text-center'>
        <EmptyImage />
        <div className='mt-12'>
          <p className='text-xl whitespace-nowrap'>It’s the beginning of a legendary sales pipeline</p>
          <p className='text-[#9E9E9E] text-[18px] mt-6'>
            When you have inbound E-mails <br /> you’ll see them here
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage
