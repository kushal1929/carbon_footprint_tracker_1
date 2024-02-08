import * as React from "react";
import './common/Tailwind.css';

export default function Prelogin_2()
{
    return (
      <section class="bg-white text-black">
        <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">

          <div class="mx-auto max-w-lg text-center">
            <h2 class="text-3xl font-bold sm:text-4xl text-emerald-900 hover:text-emerald-500 ">
                Key Features
            </h2>
          </div>

          <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Carbon Footprint Calculator
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Detailed montly calculation based on lifestyle factors like
                transportation, energy use, and diet.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Personalized Sustainability Plan:
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Tailored action plan to reduce carbon emissions, empowering
                users with achievable steps.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Interactive Map for Recycling Locations:
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Locate nearby recycling facilities for convenient waste
                management.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Competitive Leaderboards:
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Engage in friendly competition, track progress, and motivate
                peers through challenges and leaderboards.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                User-Friendly Interface:
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Our user-friendly interface ensures easy navigation and
                accessibility, making sustainability engaging.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">Analytics:</h2>

              <p class="mt-1 text-sm text-black-300">
                Users can monitor progress and gain insights into their
                sustainability journey through analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
}