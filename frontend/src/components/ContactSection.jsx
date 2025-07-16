import React from 'react';

const ContactSection = () => {
  return (
    <div className="mx-16 p-8 px-14 pt-10 bg-gray-50 rounded-2xl font-sans">
      <button className="border border-[#2D6A4F] text-[#2D6A4F] px-4 py-1 rounded-lg mb-6">
        Contact
      </button>

      <div className="text-black grid md:grid-cols-2 gap-8">
        {/* Left Side */}
        <div>
          <h2 className="text-black text-3xl font-semibold mb-6 max-w-lg">
            If you have any questions or you’d like to find out more about our services, please get in touch.
          </h2>

          <div className="space-y-4 text-sm mt-36">
            <div>
              <p className="font-medium text-2xl">Contact Details</p>
              <p className='textl-xl text-gray-400 font-medium'>📞 1234–5678–9000</p>
            </div>
            <div>
              <p className="font-medium text-2xl">Office Location</p>
              <p className='textl-xl text-gray-400 font-medium'>📍 Jl. Telekomunikasi No. 1, Kabupaten Bandung</p>
            </div>
            <div>
              <p className="font-medium text-2xl">Email Address</p>
              <p className='textl-xl text-gray-400 font-medium'>✉️ equirk@company.com</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-lg mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-2 border border-gray-300 rounded bg-white"
            />
          </div>
          <div className='mt-3'>
            <label className="block text-lg mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 border border-gray-300 rounded bg-white"
            />
          </div>
          <div className='mt-3'>
            <label className="block text-lg mb-1">Message</label>
            <textarea
              rows="6"
              placeholder="Write your message here..."
              className="w-full p-2 border border-gray-300 rounded bg-white"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-[#2D6A4F] text-white py-3 rounded-lg hover:bg-green-800">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
