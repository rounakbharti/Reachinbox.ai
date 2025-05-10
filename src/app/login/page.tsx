'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const Login = () => {
  useEffect(() => {
  }, [])

  return (
    <div className="bg-black min-h-screen text-white flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <div className="w-full h-16 flex justify-center items-center border-b border-slate-900 shadow-md">
        <img
          src="https://reachinbox.ai/assets/shared/reachinboxLogo.svg"
          alt="reachinbox-logo"
          className="h-7"
        />
      </div>

      {/* Main Form */}
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="w-full max-w-md bg-[#111214] rounded-2xl border border-gray-700 py-10 px-6 sm:px-10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div className="text-center">
            <p className="text-3xl sm:text-2xl font-semibold mb-8 tracking-wide">Create a new account</p>

            <div className="rounded border border-gray-600 h-12 flex justify-center items-center gap-3 mb-10 hover:bg-gray-800 hover:border-gray-400 transition duration-300 cursor-pointer">
              <img
                src="https://static.vecteezy.com/system/resources/previews/013/760/951/non_2x/colourful-google-logo-in-dark-background-free-vector.jpg"
                alt="Google Logo"
                className="bg-black rounded-full h-5"
              />
              <Link
                href="https://hiring.reachinbox.xyz/api/v1/auth/google-login?redirect_to=https://reachinbox-tau.vercel.app/onebox"
                className="text-sm text-gray-300 hover:text-white transition"
              >
                Sign Up with Google
              </Link>
            </div>

            <button className="w-full h-12 bg-gradient-to-r from-[#4B63DD] to-[#5A75F4] rounded-md text-white font-medium mb-6 hover:brightness-110 active:scale-95 transition duration-200">
              Create an account
            </button>

            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <span className="underline cursor-pointer hover:text-white transition">Sign In</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full h-12 flex justify-center items-center border-t border-slate-800 px-4">
        <p className="text-gray-600 text-xs text-center tracking-wider">
          ©️ 2025 Reachinbox. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
