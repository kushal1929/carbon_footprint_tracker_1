import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Header from "./common/Header";
import "./common/Tailwind.css";
import { prompt1send } from "./Prompt1";
import { prompt2send } from "./Prompt2";
import { Prompt1fetchData } from "./Prompt1";
import { Prompt2fetchData } from "./Prompt2";
import LoadingSymbol from "./common/LoadingSymbol";
import { toast } from "react-toastify";

export default function ActionPlan() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState('loading'); // Consolidate state handling

  const [prompt1Response, setPrompt1Response] = useState('');
  const [prompt2Response, setPrompt2Response] = useState('');
  const { prompt2string } = Prompt2fetchData();
  const { prompt1string } = Prompt1fetchData();

  useEffect(() => {
    const userEmail = sessionStorage.getItem("User Email");

    if (!userEmail) {
      navigate("/login");
      return;
    }

    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", userEmail));

    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUsername(doc.id || ""); // Extracting and setting the username here
          });
        } else {
          navigate(`/verify-email/${userEmail}`);
        }
        setStatus('fetchingData'); // Update status to show loading data
      })
      .catch((error) => {
        console.error("Error fetching user data:", error.message);
        toast.error("An error occurred while fetching user data.");
        setStatus('error');
      });
  }, [navigate]);

  useEffect(() => {
    const fetchResponses = async () => {
      if (status !== 'fetchingData') return;

      try {
        if (prompt1string && prompt2string) {
          const [resp1, resp2] = await Promise.all([
            prompt1send(prompt1string),
            prompt2send(prompt2string)
          ]);

          setPrompt1Response(resp1);
          setPrompt2Response(resp2);
          setStatus('ready');
        }
      } catch (error) {
        console.error("Error fetching prompt responses:", error.message);
        setStatus('error');
      }
    };

    fetchResponses();
  }, [prompt1string, prompt2string, status]);

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prompt1array = prompt1Response.split(/\d+\./).filter(sentence => sentence.trim() !== '');
  const prompt2array = prompt2Response.split(/\d+\./).filter(sentence => sentence.trim() !== '');
  const totalArray = prompt1array.concat(prompt2array);

  const StringArrayRenderer = ({ stringArray }) => {
    return (
      <>
        {stringArray.map((str, index) => (
          <a
            key={index}
            className="block rounded-xl border border-gray-200 p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-lime-300/20"
          >
            <h2 className="mt-4 text-xl font-bold text-black">{index + 1}.</h2>
            <div className="mt-1 text-sm text-black">{str}</div>
          </a>
        ))}
      </>
    );
  };

  if (status === 'loading' || status === 'fetchingData') {
    return (
      <>
        <Header />
        <div className="flex flex-col h-[90%] w-full justify-center items-center">
          <div className="text-3xl mb-6 text-[#005e03] text-center">Please wait while we create your personalized action plan...</div>
          <LoadingSymbol type="spinningBubbles" color="#005e03" />
          <div className="text-2xl mt-6 px-4 text-center">Make sure you've filled in all the 6 categories in the Carbon Footprint Calculator first!</div>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Header />
        <div className="grid h-screen place-content-center bg-white px-4">
          <div className="text-black text-3xl">Oops! Looks like there was some error on our side. Please try again after some time.</div>
          <div className="text-black text-3xl">Also ensure you have filled in all 6 categories in the <a href='/Consumption-data' className="w-fit font-bold text-blue-600 underline dark:text-blue-500 hover:no-underline">Carbon Footprint Calculator</a> first.</div>
        </div>
      </>
    );
  }

  if (status === 'ready') {
    return (
      <>
        <Header />
        <div>
          <section className="bg-white text-black"  style={{ backgroundColor: '#FFFCF7',  }}>
            <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-[10%] lg:py-16" >
              <div className="mx-auto max-w-lg text-center">
                <h1 className="mx-auto w-fit bg-gradient-to-r from-orange-300 via-rose-300 to-pink-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
                  style={{ paddingBottom: '10px' }}>
                  {username}'s Action Plan
                </h1>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: '#FFFF',  }}>
                <StringArrayRenderer stringArray={totalArray} />
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return null;
}
