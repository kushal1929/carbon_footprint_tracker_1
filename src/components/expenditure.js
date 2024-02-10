import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
} from "firebase/firestore";
import { FaQuestionCircle } from "react-icons/fa";
import "./common/Tailwind.css";

export const CarbonFootprintCalculatorExpenditure = () => {
    const [Eating_out, setEating_out] = useState("");
    const [Car_Maintenance, setCar_Maintenance] = useState("");
    const [clothing, setclothing] = useState("");
    const [Furniture, setFurniture] = useState("");
    const [Domestic_Water, setDomestic_Water] = useState("");
    const [Telephone_Internet, setTelephone_Internet] = useState("");
    const [Computer_Elec, setComputer_Elec] = useState("");
    const [Electrical_Appliances, setElectrical_Appliances] = useState("");
    const [Postage, setPostage] = useState("");
    const [Magazines, setMagazines] = useState("");
    const [Stationary, setStationary] = useState("");
    const [Hair_SelfCare, setHair_SelfCare] = useState("");
    const [Pet_Food, setPet_Food] = useState("");
    const [Hotel_Stays, setHotel_Stays] = useState("");
    const [Insurance, setInsurance] = useState("");
    const [Other, setOther] = useState("");
    let [ExpenditureCarbonFootprint, setExpenditureCarbonFootprint] =
        useState(null);
    const [username, setUsername] = useState("");

    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const navigate = useNavigate();
    const [tooltipVisible1, setTooltipVisible1] = useState(false);
    const toggleTooltip = () => {
      setTooltipVisible(!tooltipVisible);
    };
    const toggleTooltip1 = () => {
      setTooltipVisible1(!tooltipVisible1);
    };

    const calculateCarbonFootprintExpenditure = async (
        ExpenditureCarbonFootprint
    ) => {
        const newExpenditureData = {
            Eating_out,
            Car_Maintenance,
            clothing,
            Furniture,
            Domestic_Water,
            Telephone_Internet,
            Computer_Elec,
            Electrical_Appliances,
            Postage,
            Magazines,
            Stationary,
            Hair_SelfCare,
            Pet_Food,
            Hotel_Stays,
            Insurance,
            Other,
            ExpenditureCarbonFootprint,
            timestamp: new Date(),
        };

        const userEmail = sessionStorage.getItem("User Email");
        const userQuery = query(usersCollection, where("email", "==", userEmail));

        try {
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setUsername(userDoc.id || "");

                const userDocRef = doc(usersCollection, userDoc.id);

                // Include year in the current month
                const currentDate = new Date();
                const currentMonthYear = currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                });
                const currentMonthRef = collection(userDocRef, currentMonthYear);

                // Use consumptionHome as the document id
                const consumptionExpenditureRef = doc(
                    currentMonthRef,
                    "consumptionExpenditure"
                );

                try {
                    await setDoc(consumptionExpenditureRef, newExpenditureData);
                    
                    await calculateAndStoreTotal(
                        currentMonthRef,
                        currentMonthYear,
                        userDocRef
                    );
                } catch (error) {
                    
                    alert(error.message);
                }
            } else {
                
                alert("User not found in Firestore");
            }
        } catch (error) {
           
            alert("Error fetching user data:", error.message);
        }
    };

    const calculateAndStoreTotal = async (
        currentMonthRef,
        currentMonthYear,
        userDocRef
    ) => {
        const totalDocRef = collection(userDocRef, "Total");
        const totalMYDocRef = doc(totalDocRef, currentMonthYear);

        const querySnapshot = await getDocs(currentMonthRef);

        let totalHome = 0;
        let totalFood = 0;
        let totalVehicle = 0;
        let totalFlight = 0;
        let totalPublicVehicle = 0;
        let totalExpenditure = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            totalHome += data.homeCarbonFootprint || 0;
            totalFood += data.foodCarbonFootprint || 0;
            totalVehicle += data.vehicleCarbonFootprint || 0;
            totalFlight += data.flightCarbonFootprint || 0;
            totalPublicVehicle += data.PublicVehicleCarbonFootprint || 0;
            totalExpenditure += data.ExpenditureCarbonFootprint || 0;
        });

        const totalDocData = {
            totalHome,
            totalFood,
            totalVehicle,
            totalFlight,
            totalPublicVehicle,
            totalExpenditure,
            totalCarbonFootprint:
                totalHome +
                totalFood +
                totalVehicle +
                totalFlight +
                totalPublicVehicle +
                totalExpenditure,
            timestamp: new Date(),
        };

        try {
            await setDoc(totalMYDocRef, totalDocData);
            
        } catch (error) {
            
            alert(error.message);
        }
    };

    const handleExpenditureCalculate = () => {
        const Eating_outFactor = 0.22;
        const Car_MaintenanceFactor = 0.16;
        const clothingFactor = 0.62;
        const FurnitureFactor = 0.29;
        const Domestic_WaterFactor = 0.19;
        const Telephone_InternetFactor = 0.08;
        const Computer_ElecFactor = 0.29;
        const Electrical_AppliancesFactor = 0.39;
        const PostageFactor = 0.19;
        const MagazinesFactor = 0.62;
        const StationaryFactor = 0.55;
        const Hair_SelfCareFactor = 0.62;
        const Pet_FoodFactor = 0.71;
        const Hotel_StaysFactor = 0.25;
        const InsuranceFactor = 0.62;
        const OtherLegalFactor = 0.47;

        const totalExpenditureCarbonFootprint =
            Eating_out * Eating_outFactor +
            Car_Maintenance * Car_MaintenanceFactor +
            clothing * clothingFactor +
            Furniture * FurnitureFactor +
            Domestic_Water * Domestic_WaterFactor +
            Telephone_Internet * Telephone_InternetFactor +
            Computer_Elec * Computer_ElecFactor +
            Electrical_Appliances * Electrical_AppliancesFactor +
            Postage * PostageFactor +
            Magazines * MagazinesFactor +
            Stationary * StationaryFactor +
            Hair_SelfCare * Hair_SelfCareFactor +
            Pet_Food * Pet_FoodFactor +
            Hotel_Stays * Hotel_StaysFactor +
            Insurance * InsuranceFactor +
            Other * OtherLegalFactor;

        setExpenditureCarbonFootprint(totalExpenditureCarbonFootprint);
        calculateCarbonFootprintExpenditure(totalExpenditureCarbonFootprint);
    };

    return (
      <div className="w-[90%] flex flex-col items-center py-10 mx-[5vw]">
        <div className="w-full pt-5 text:black bg-white font-extrabold text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-center z-10">
          Carbon Footprint from Other Expenditures
        </div>

        <div className="flex flex-row items-center flex-wrap bg-white w-full h-[90%]">
          <p className="w-full pt-5 text:black bg-white  sm:text-xl md:text-xl lg:text-xl xl:text-xl 2xl:text-xl text-center z-10">
                  Note: Please fill in the details once a month
                  <FaQuestionCircle className="mx-auto"
                    onMouseEnter={toggleTooltip1}
                    onMouseLeave={toggleTooltip1}
                  />
                  {tooltipVisible1 && (
                    <div className="bg-white p-2 rounded shadow-lg z-10">
                      <div className="flex flex-col z-10">
                        <p className="text-xs">If you wish to update some values in the current month then you will have to update all the fields in the current screen.</p>
                      </div>
                    </div>
                  )}
            </p>
          <div className="flex items-center flex-col w-full h-full lg:w-1/2 lg:mt-[1%] space-y-0 py-20">
            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Food:</span>
              <label className="relative block w-1/2 sm:w-auto rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={Eating_out}
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  onChange={(e) => setEating_out(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Car Maintenance:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Car_Maintenance}
                  onChange={(e) => setCar_Maintenance(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Clothing:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={clothing}
                  onChange={(e) => setclothing(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Furniture:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Furniture}
                  onChange={(e) => setFurniture(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Domestic Water:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Domestic_Water}
                  onChange={(e) => setDomestic_Water(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4 px-10 ">
              <span className="mr-2 font-medium">Telephone & Internet:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Telephone_Internet}
                  onChange={(e) =>
                    setTelephone_Internet(parseFloat(e.target.value))
                  }
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4 px-10">
              <span className="mr-2 font-medium">Computer & Electronics:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Computer_Elec}
                  onChange={(e) => setComputer_Elec(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4 px-10">
              <span className="mr-2 font-medium">Electrical Appliances:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Electrical_Appliances}
                  onChange={(e) =>
                    setElectrical_Appliances(parseFloat(e.target.value))
                  }
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Postage & Couriers:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Postage}
                  onChange={(e) => setPostage(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4 px-2">
              <span className="mr-2 font-medium">Magazines & Books:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Magazines}
                  onChange={(e) => setMagazines(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Stationery:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Stationary}
                  onChange={(e) => setStationary(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Hair & Self-care:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={Hair_SelfCare}
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  onChange={(e) => setHair_SelfCare(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Pet Food:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Pet_Food}
                  onChange={(e) => setPet_Food(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Hotel Stays:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Hotel_Stays}
                  onChange={(e) => setHotel_Stays(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Insurance:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  placeholder="In USD"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  value={Insurance}
                  onChange={(e) => setInsurance(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row">
              <div>
                <FaQuestionCircle
                  onMouseEnter={toggleTooltip}
                  onMouseLeave={toggleTooltip}
                />
                {tooltipVisible && (
                  <div className="absolute -left-[25px] bg-white p-2 rounded shadow-lg z-10">
                    <div className="flex flex-col z-10">
                      <p>
                        Any kind of legal representation, includes
                        solicitors,will
                      </p>
                      <p>
                        writing services, etc. Excludes actually going to court.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center justify-center mb-4">
                <span className="mr-2 font-medium">Other Legal Services:</span>
                <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                  <input
                    type="number"
                    placeholder="In USD"
                    className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                    value={Other}
                    onChange={(e) => setOther(parseFloat(e.target.value))}
                  />
                </label>
              </div>
            </div>
            <br />

            <button onClick={handleExpenditureCalculate}>
              <a className="group inline-block rounded bg-gradient-to-r from-yellow-300 via-lime-300 to-green-300 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
                <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
                  Calculate
                </span>
              </a>
            </button>
            <br />
            {ExpenditureCarbonFootprint !== null && (
              <div className="text-xl font-bold mb-4">
                <p>Your estimated carbon footprint from misc expenditures is: </p>
                {ExpenditureCarbonFootprint} kgCO2 per month
              </div>
            )}
            {/* {calculateCarbonFootprintExpenditure} */}
          </div>

          <div className="flex lg:h-full w-0 lg:w-1/2 px-10 py-10">
          <img className="object-contain" src={require("../assets/expenditure.jpg")}/>
        </div>
        </div>
      </div>
    );
};

export default CarbonFootprintCalculatorExpenditure;
