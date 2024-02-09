import './common/Tailwind.css';
import * as React from 'react';
import Button from './common/Button';



export default function BasicTextFields({ title, setPassword, setEmail, handleAction, password }) {
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = () => {
    if (title === 'Register' && password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      handleAction();
    }
  };

    

return(
    <section className="bg-white">
    <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
        <img
            alt="Pattern"
            src={require("../assets/signup.jpg")}
            className="absolute inset-0 h-full w-full object-cover"
        />
        </aside>

        <main
        className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
        <div className="max-w-xl lg:max-w-3xl">
            <div className="block text-blue-600">
            <span className="sr-only">Home</span>
            <img src={require("../assets/Ecolibrium_Logo.png")} className='h-10 w-10'/>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Welcome to ECOLIBRIUM!
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
            Start Your Green Odyssey! Measure. Improve. Thrive. Ecolibrium - Your Personal Guide to a Greener, Healthier Tomorrow!
            </p>

            <form action="#" className="mt-8 grid grid-cols-6 gap-6">
            {/* <div className="col-span-6 sm:col-span-3">
                <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                First Name
                </label>

                <input
                type="text"
                id="FirstName"
                name="first_name"
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
            </div>

            <div className="col-span-6 sm:col-span-3">
                <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
                Last Name
                </label>

                <input
                type="text"
                id="LastName"
                name="last_name"
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
            </div> */}

            <div className="col-span-6">
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700"> Email </label>

                <input
                type="email"
                id="Email"
                name="email"
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="col-span-6 sm:col-span-3">
                <label htmlFor="Password" className="block text-sm font-medium text-gray-700"> Password </label>

                <input
                type="password"
                id="Password"
                name="password"
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="col-span-6 sm:col-span-3">
                <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
                Password Confirmation
                </label>

                <input
                type="password"
                id="PasswordConfirmation"
                name="password_confirmation"
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <div className="col-span-6">
                <label htmlFor="MarketingAccept" className="flex gap-4">
                <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
                />

                <span className="text-sm text-gray-700">
                    I want to receive emails about events, product updates and company announcements.
                </span>
                </label>
            </div>

            <div className="col-span-6">
                <p className="text-sm text-gray-500">
                By creating an account, you agree to our
                <a href="#" className="text-gray-700 underline"> terms and conditions </a>
                and
                <a href="#" className="text-gray-700 underline">privacy policy</a>.
                </p>
            </div>

            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                
                <Button title={title} handleAction={handleRegister} />

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                Already have an account?
                <a href="/login" className="text-gray-700 underline">Log in</a>.
                </p>
            </div>
            </form>
        </div>
        </main>
    </div>
    </section>
)
}
