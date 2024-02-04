import React from 'react';
import Header from "./common/Header";
import "./common/Tailwind.css";

export default function Credits(){

    return (
      <div>
        <Header />
        <section className="bg-white-900 text-black">
          <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Attribution</h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    1.
                    <a href="#about" className="text-black-500">
                      https://www.hyperui.dev/components/marketing/sections
                    </a>
                  </h2>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    2.
                    <a href="#about" className="text-black-500">
                      https://www.hyperui.dev/components/marketing/sections
                    </a>
                  </h2>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    3.
                    <a href="#about" className="text-black-500">
                      https://www.hyperui.dev/components/marketing/sections
                    </a>
                  </h2>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    4.
                    <a href="#about" className="text-black-500">
                      ABOUT
                    </a>
                  </h2>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    5.
                    <a href="#about" className="text-black-500">
                      ABOUT
                    </a>
                  </h2>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    6.
                    <a href="#about" className="text-black-500">
                      ABOUT
                    </a>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
}