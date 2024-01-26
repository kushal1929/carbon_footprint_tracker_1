import React,{useState} from 'react';
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

export const CarbonFootprintCalculatorExpenditure = () => {

    const [Eating_out,setEating_out] = useState('');
    const [Car_Maintenance,setCar_Maintenance]=useState('');
    const [clothing,setclothing]=useState('');
    const [Furniture,setFurniture]=useState('');
    const [Domestic_Water,setDomestic_Water]=useState('');
    const [Telephone_Internet,setTelephone_Internet]=useState('');
    const [Computer_Elec,setComputer_Elec]=useState('');
    const [Electrical_Appliances,setElectrical_Appliances]=useState('');
    const [Postage,setPostage]=useState('');
    const [Magazines,setMagazines]=useState('');
    const [Stationary,setStationary]=useState('');
    const [Hair_SelfCare,setHair_SelfCare]=useState('');
    const [Pet_Food,setPet_Food]=useState('');
    const [Hotel_Stays,setHotel_Stays]=useState('');
    const [Insurance,setInsurance]=useState('');
    const [Other,setOther]=useState('');
    let [ExpenditureCarbonFootprint,setExpenditureCarbonFootprint]=useState(null);
    const [username, setUsername] = useState("");

    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const navigate = useNavigate();

    const calculateCarbonFootprintExpenditure = async(ExpenditureCarbonFootprint)=>{
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
            timestamp:new Date(),
        };

        const userEmail = sessionStorage.getItem("User Email");
        const userQuery = query(
          usersCollection,
          where("email", "==", userEmail)
        );

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
              console.log(
                "Carbon footprint data saved to Firestore for the current month ",
                newExpenditureData
              );
              await calculateAndStoreTotal(currentMonthRef,currentMonthYear,userDocRef);
            } catch (error) {
              console.error(
                "Error saving carbon footprint data to Firestore:",
                error
              );
              alert(error.message);
            }
          } else {
            console.log("User not found in Firestore");
            alert("User not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Error fetching user data:", error.message);
        }
    }

    const calculateAndStoreTotal = async (currentMonthRef,currentMonthYear,userDocRef) => {
        const totalDocRef = collection(userDocRef, 'Total');
        const totalMYDocRef=doc(totalDocRef,currentMonthYear)
    
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
            totalHome + totalFood + totalVehicle + totalFlight + totalPublicVehicle + totalExpenditure,
            timestamp: new Date(),
        };
    
        try {
          await setDoc(totalMYDocRef, totalDocData);
          console.log('Total carbon footprint data saved to Firestore for the current month ', totalDocData);
        } catch (error) {
          console.error('Error saving total carbon footprint data to Firestore:', error);
          alert(error.message);
        }
      };
      

    const handleExpenditureCalculate = ()=>{
        const Eating_outFactor= 0.22;
        const Car_MaintenanceFactor =0.16;
        const clothingFactor = 0.62;
        const FurnitureFactor = 0.29;
        const Domestic_WaterFactor = 0.19;
        const Telephone_InternetFactor = 0.08;
        const Computer_ElecFactor = 0.29;
        const Electrical_AppliancesFactor = 0.39;
        const PostageFactor = 0.19;
        const MagazinesFactor =0.62;
        const StationaryFactor = 0.55;
        const Hair_SelfCareFactor = 0.62;
        const Pet_FoodFactor = 0.71;
        const Hotel_StaysFactor = 0.25;
        const InsuranceFactor = 0.62;
        const OtherLegalFactor = 0.47;

        const totalExpenditureCarbonFootprint =
        Eating_out*Eating_outFactor + 
        Car_Maintenance*Car_MaintenanceFactor +
        clothing*clothingFactor+
        Furniture*FurnitureFactor+
        Domestic_Water*Domestic_WaterFactor+
        Telephone_Internet*Telephone_InternetFactor+
        Computer_Elec*Computer_ElecFactor+
        Electrical_Appliances*Electrical_AppliancesFactor+
        Postage*PostageFactor+
        Magazines*MagazinesFactor+
        Stationary*StationaryFactor+
        Hair_SelfCare*Hair_SelfCareFactor+
        Pet_Food*Pet_FoodFactor+
        Hotel_Stays*Hotel_StaysFactor+
        Insurance*InsuranceFactor+
        Other*OtherLegalFactor ;

        setExpenditureCarbonFootprint(totalExpenditureCarbonFootprint);
        calculateCarbonFootprintExpenditure(totalExpenditureCarbonFootprint);
    };

    return (
        <div>
            <h1>CarbonFootPrint from Expenditure</h1>
            <label>
                Enter the average monthly expenditure(in USD) on food outside:
                <input
                    type="number"
                    value={Eating_out}
                    onChange={(e)=>setEating_out(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Car Maintenance:
                <input
                    type="number"
                    value={Car_Maintenance}
                    onChange={(e)=>setCar_Maintenance(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on clothing:
                <input
                    type="number"
                    value={clothing}
                    onChange={ (e)=>setclothing(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on furniture:
                <input
                    type="number"
                    value={Furniture}
                    onChange={ (e)=>setFurniture(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Domestic Water:
                <input
                    type="number"
                    value={Domestic_Water}
                    onChange={ (e)=>setDomestic_Water(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Telephone & Internet:
                <input
                    type="number"
                    value={Telephone_Internet}
                    onChange={ (e)=>setTelephone_Internet(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Computer & Electronics:
                <input
                    type="number"
                    value={Computer_Elec}
                    onChange={ (e)=>setComputer_Elec(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Electrical Appliances:
                <input
                    type="number"
                    value={Electrical_Appliances}
                    onChange={ (e)=>setElectrical_Appliances(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Postage & Couriers:
                <input
                    type="number"
                    value={Postage}
                    onChange={ (e)=>setPostage(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Magazines & Books:
                <input
                    type="number"
                    value={Magazines}
                    onChange={ (e)=>setMagazines(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Stationary:
                <input
                    type="number"
                    value={Stationary}
                    onChange={ (e)=>setStationary(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on  Hair & Self-care:
                <input
                    type="number"
                    value={Hair_SelfCare}
                    onChange={ (e)=>setHair_SelfCare(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on  Pet Food:
                <input
                    type="number"
                    value={Pet_Food}
                    onChange={ (e)=>setPet_Food(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Hotel Stays:
                <input
                    type="number"
                    value={Hotel_Stays}
                    onChange={ (e)=>setHotel_Stays(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on Insurance:
                <input
                    type="number"
                    value={Insurance}
                    onChange={ (e)=>setInsurance(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the average monthly expenditure(in USD) on  Other Legal Services:
                <input
                    type="number"
                    value={Other}
                    onChange={ (e)=>setOther(Number(e.target.value))}
                />
            </label>
            <br/>
            <button onClick={handleExpenditureCalculate}>
                Calculate CarbonFootPrint from Expenditure
            </button>
            <br/>
            {ExpenditureCarbonFootprint !== null && (
            <p>
                Your estimated vehicle carbon footprint is: {ExpenditureCarbonFootprint}{" "}
                kgCO2 per month
            </p>
            )}
            {calculateCarbonFootprintExpenditure}
        </div>
    );
};

export default CarbonFootprintCalculatorExpenditure;
