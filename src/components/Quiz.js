
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './common/Tailwind.css';
import Header from './common/Header';
 

const QuizApp = ({ app }) => {
  const db = getFirestore();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomQuestions = async () => {
      try {
        const data = await getDocs(collection(db, 'QuizQuestions'));
        const allQuestions = data.docs.map(doc => doc.data());
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffledQuestions.slice(0, 5);
        setQuestions(selectedQuestions);
        setQuizCompleted(false);
      } catch (error) {
       
        alert('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomQuestions();
  }, [db]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);

    if (answerIndex === questions[currentQuestion]?.Correct_Answer) {
      setScore((prevScore) => prevScore + 1);
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 4000);
  };

  const renderQuizContent = () => (
    <div className="my-auto flex flex-col items-center">
      <h3 className="text-center text-indigo-800 text-opacity-50 text-3xl mt-[5%] mr-[5%] ml-[5%] mb-4 md:text-5xl">{`Question ${currentQuestion + 1}`}</h3>
      <p className="text-center text-2xl mr-[5%] ml-[5%] mt-[7%] mb-8 md:text-3xl">{questions[currentQuestion]?.Question}</p>
      
      {/* <div className="flex justify-center space-x-4"> */}
        {["Option1", "Option2"].map((option, index) => (
          <div
            key={index}
            className={`text-center w-[60%] mx-auto mt-[2%] mb-[5%] border-amber-300 border-2 p-4 rounded-md hover:bg-amber-100 ${
              selectedAnswer !== null && selectedAnswer===index &&
              (selectedAnswer === questions[currentQuestion]?.Correct_Answer
                ? "bg-green-300"
                : "bg-red-300")
            }`}
          >
            <button
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className="w-full"
            >
              {questions[currentQuestion]?.[option]}
            </button>
          </div>
        ))}
      {/* </div> */}

      {selectedAnswer !== null && (
        <div className="mt-4">
          <p className="text-3xl text-emerald-700">
            {selectedAnswer === questions[currentQuestion]?.Correct_Answer
              ? "Correct!"
              : "Incorrect!"}
          </p>
          <p>
            Correct Answer:{" "}
            {questions[currentQuestion]?.Correct_Answer === 0
              ? questions[currentQuestion]?.Option1
              : questions[currentQuestion]?.Option2}
          </p>
        </div>
      )}
    </div>
  );

  const renderQuizCompleted = () => (
    <div className="flex flex-col items-center">
      <h3 className="text-center text-indigo-800 text-opacity-50 text-3xl mt-[5%] mr-[5%] ml-[5%] mb-4 md:text-5xl">Quiz Completed</h3>
      <p className='text-center text-2xl mr-[5%] ml-[5%] mt-[7%] mb-8 md:text-3xl'>Your final score is: {score} out of {questions.length}</p>
    </div>
  );

  return (
    <div className='w-full h-full bg-gradient-to-r from-yellow-300 via-lime-300 to-green-300'>
      <Header/>
      <div className='flex items-center justify-center h-[90vh]'>
        <div className='mx-[5%] sm:mx-[15%] rounded bg-white'>
          {loading ? (
            <p>Loading questions...</p>
          ) : quizCompleted ? (
            renderQuizCompleted()
          ) : (
            renderQuizContent()
          )}
        </div>
      </div>
      
    </div>
  );
};

export default QuizApp;
